'use strict';

angular.module('games').controller('GamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Games',
	function($scope, $stateParams, $location, Authentication, Games) {
		$scope.authentication = Authentication;

		$scope.create = function() {
            var self = this;
			var game = new Games({
			});
			game.$save(function(response) {
				$location.path('games/' + response._id);
                $scope.game = response;
				$scope.ch = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(game) {
			if (game) {
				game.$remove();

				for (var i in $scope.games) {
					if ($scope.games[i] === games) {
						$scope.games.splice(i, 1);
					}
				}
			} else {
				$scope.games.$remove(function() {
					$location.path('games');
				});
			}
		};

		$scope.update = function() {
			var game = $scope.game;
            var ch = $scope.ch;
            game.ch = ch;

			game.$update(function(response) {
                $scope.game = response;
                $scope.ch = '';
                if ($scope.game.status !=='busy'){
                    $location.path('games/end/' + game._id);
                }

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.games = Games.query();
		};

		$scope.findOne = function() {
			Games.get({
				gameId: $stateParams.gameId
			}).$promise.then(function(game){
                    $scope.game = game;
                    if ($scope.game.status !=='busy'){
                        $location.path('games/end/' + game._id);
                    }

                });
		};
	}
]);
