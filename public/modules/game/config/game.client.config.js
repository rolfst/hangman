'use strict';

// Configuring the Game module
angular.module('games').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Game', 'games', 'dropdown', '/games(/create)?');
		Menus.addSubMenuItem('topbar', 'games', 'List Game', 'games');
		Menus.addSubMenuItem('topbar', 'games', 'New Game', 'games/create');
	}
]);
