'use strict';

// Setting up route
angular.module('games').config(['$stateProvider',
	function($stateProvider) {
		// Game state routing
		$stateProvider.
		state('listGame', {
			url: '/games',
			templateUrl: 'modules/game/views/list-game.client.view.html'
		}).
		state('createGame', {
			url: '/games/create',
			templateUrl: 'modules/game/views/create-game.client.view.html'
		}).
		state('viewGame', {
			url: '/games/:gameId',
			templateUrl: 'modules/game/views/edit-game.client.view.html'
		}).
        state('endGame', {
            url: '/games/end/:gameId',
            templateUrl: 'modules/game/views/end-game.client.view.html'
        }).
		state('editGame', {
			url: '/games/:gameId/edit',
			templateUrl: 'modules/game/views/edit-game.client.view.html'
		});
	}
]);
