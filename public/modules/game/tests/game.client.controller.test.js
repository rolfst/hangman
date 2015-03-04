'use strict';

(function () {
    // Game Controller Spec
    describe('GamesController', function () {
        // Initialize global variables
        var GamesController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function () {
            jasmine.addMatchers({
                toEqualData: function (util, customEqualityTesters) {
                    return {
                        compare: function (actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Game controller.
            GamesController = $controller('GamesController', {
                $scope: scope
            });
        }));

        //////////////////////////////////////////////////////////////////////////////////////////////////////
        // So far the mean stack boilerplate test setup now we do the real testing.
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        
        it('$scope.find() should create an array with at least one game object fetched from XHR', inject(function (Games) {
            // Create sample game using the Games service
            var sampleGame = new Games({
                _id: '525cf20451979dea2c000001',
                shaddowword: '_______',
                status: 'busy'
            });

            // Create a sample games array that includes the new game
            var sampleGames = [sampleGame];

            // Set GET response
            $httpBackend.expectGET('games').respond(sampleGames);

            // Run controller functionality
            scope.find();
            $httpBackend.flush();

            // Test scope value
            expect(scope.games).toEqualData(sampleGames);
        }));

        it('$scope.findOne() should create an array with one game object fetched from XHR using a gameId URL parameter', inject(function (Games) {
            // Define a sample games object
            var sampleGame = new Games({
                _id: '525cf20451979dea2c000001',
                shaddowword: '_______',
                status: 'busy'
            });

            // Set the URL parameter
            $stateParams.gameId = '525a8422f6d0f87f0e407a33';

            // Set GET response
            $httpBackend.expectGET(/games\/([0-9a-fA-F]{24})$/).respond(sampleGame);

            // Run controller functionality
            scope.findOne();
            $httpBackend.flush();

            // Test scope value
            expect(scope.game).toEqualData(sampleGame);
        }));

        it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function (Games) {
            // Create a sample game object
            var sampleGamePostData = new Games({});

            // Create a sample game response
            var sampleGameResponse = new Games({
                _id: '525cf20451979dea2c000001',
                shaddowword: '_______',
                status: 'busy'
            });

            // Fixture mock form input values
            scope.shadowword = '_______';
            scope.status = 'busy';

            // Set POST response
            $httpBackend.expectPOST('games', sampleGamePostData).respond(sampleGameResponse);

            // Run controller functionality
            scope.create();
            $httpBackend.flush();

            // Test form inputs are reset
            expect(scope.shadowword).toEqual('_______');
            expect(scope.status).toEqual('busy');

            // Test URL redirection after the game was created
            expect($location.path()).toBe('/games/' + sampleGameResponse._id);
        }));

        it('$scope.update() should update a valid game', inject(function (Games) {
            // Define a sample game put data
            var sampleGamePutData = new Games({
                _id: '525cf20451979dea2c000001',
                shadowword: '______',
                ch: 'a'
            });

            // Mock game in scope
            scope.game = sampleGamePutData;

            // Set PUT response
            $httpBackend.expectPOST(/games\/([0-9a-fA-F]{24})$/).respond();

            // Run controller functionality
            scope.update();
            $httpBackend.flush();

            // Test URL location to new object
            expect($location.path()).toBe('/games/end/' + sampleGamePutData._id);
        }));

    });
}());
