'use strict';

//Games service used for communicating with the games REST endpoints
angular.module('games').factory('Games', ['$resource',
	function($resource) {
		return $resource('games/:gameId', {
			gameId: '@_id'
		}, {
			update: {
				method: 'POST'
			}
		});
	}
]);
