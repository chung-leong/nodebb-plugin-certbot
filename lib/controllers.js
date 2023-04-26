'use strict';

module.exports = {
	renderAdminPage,
};

function renderAdminPage(req, res) {
	res.render('admin/plugins/certbot', {});
}
