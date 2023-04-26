'use strict';

const os = require('os');
const http = require('http');
const _ = require.main.require('lodash');
const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const routeHelpers = require.main.require('./src/routes/helpers');
const controllers = require('./lib/controllers');
const helpers = require('./lib/helpers');

module.exports = {
	init,
	addRoutes,
	addAdminNavigation,
	handleSettingChange,
};

let currentSettings;

async function init(params) {
	const { router } = params;
	currentSettings = await meta.settings.get('certbot');

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/certbot', [], controllers.renderAdminPage);
}

async function addRoutes({ router, middleware }) {
	const middlewares = [
		middleware.ensureLoggedIn,
		middleware.admin.checkPrivileges,
	];
	routeHelpers.setupApiRoute(router, 'post', '/certbot/certificates', middlewares, helpers.listCertificates);
	routeHelpers.setupApiRoute(router, 'post', '/certbot/renewal', middlewares, helpers.renewCertificates);
}

function addAdminNavigation(header) {
	header.plugins.push({
		route: '/plugins/certbot',
		icon: 'fa-tint',
		name: 'Certbot',
	});
	return header;
}

async function handleSettingChange({ plugin, settings, caller }) {
	if (plugin === 'certbot') {
		try {
			const domainsBefore = parseDomains(currentSettings.names);
			const domains = parseDomains(settings.names);
			const emailBefore = currentSettings.email;
			const email = settings.email;
			currentSettings = settings;
	
			if (_.xor(domains, domainsBefore).length > 0) {
				helpers.acquireCertificates(domains, email, caller);
			} else if (email !== emailBefore) {
				helpers.updateContactEmail(email, caller);
			}	
		} catch (err) {
			winston.error(err);
		}
	}
}

function parseDomains(s) {
	return _.filter(s.trim().split(/\s+/));
}
