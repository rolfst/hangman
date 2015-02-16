'use strict';

module.exports = function(app, controllers) {
	// Root routing
	var core = controllers['core.server.controller'];
	app.route('/').get(core.index);
};
