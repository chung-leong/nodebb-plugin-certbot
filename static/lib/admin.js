'use strict';

define('admin/plugins/certbot', [ 'settings', 'api' ], function (settings, api) {
	var ACP = {};

	ACP.init = function () {
		settings.load('certbot', $('.certbot-settings'));
		$('#save').on('click', saveSettings);

		socket.on('event:certbot_output', handleOutput);

		$(window).one('action:ajaxify.cleanup', () => {
			socket.off('event:certbot_output', handleOutput);
		});

		api.post('/plugins/certbot/certificates', {});
	};

	function saveSettings() {
		settings.save('certbot', $('.certbot-settings'));
	}

	function handleOutput({ status, content }) {
		$('#output').attr('class', status).text(content);
	}

	return ACP;
});
