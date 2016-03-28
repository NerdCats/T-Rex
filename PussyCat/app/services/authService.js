(function() {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$window'];

    /* @ngInject */
    function authService($http, $q, localStorageService, ngAuthSettings, $window) {
        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var service = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: false
        };

        var _register = function(registration) {

            _logOut();

            // FIXME: this is ghetto here, can be refactored of course
            // Should we go for and defer $q here because we are not handling errors here
            return $http.post(serviceBase + 'api/account/register', registration).then(function(response) {
                return response;
            });
        };

        var _login = function(loginData) {

            //FIXME: This has to be fixed too. Im just adding it over manually as a querystring
            //really shouldnt do this and I think I have to add client to this as far as Im concerned

            var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password;
            data = data + "&client_id=" + ngAuthSettings.clientId;

            console.log(data);
            var deferred = $q.defer();

            //FIXME: I do can keep these routes noted somewhere
            $http.post(serviceBase + 'token', data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .success(function(response) {
                    var authorizationData = {};
                    authorizationData.token = response.access_token;
                    authorizationData.userName = loginData.userName;

                    if (loginData.useRefreshTokens) {
                        authorizationData.refreshToken = response.refresh_token;
                        authorizationData.useRefreshTokens = true;
                    } else {
                        authorizationData.refreshToken = "";
                        authorizationData.useRefreshTokens = false;
                    }

                    localStorageService.set('authorizationData', authorizationData);

                    _authentication.isAuth = true;
                    _authentication.userName = loginData.userName;
                    _authentication.useRefreshTokens = loginData.useRefreshTokens;

                    deferred.resolve(response);

                }).error(function(err, status) {
                    _logOut();
                    deferred.reject(err);
                });

            return deferred.promise;
        };

        var _logOut = function() {
            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.useRefreshTokens = false;
            console.log(_authentication);
        };

        var _populateAuthData = function() {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
            }
        };

        var _refreshToken = function() {
            var deferred = $q.defer();

            var authData = localStorageService.get('authorizationData');

            if (authData) {

                //FIXME: This is ghetto again, you already know what to do here if
                //you read the previous comments
                if (authData.useRefreshTokens) {

                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;
                    localStorageService.remove('authorizationData');

                    $http.post(serviceBase + 'token', data, {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                        .success(function(response) {
                            localStorageService.set('authorizationData', {
                                token: response.access_token,
                                userName: response.userName,
                                refreshToken: response.refresh_token,
                                useRefreshTokens: true
                            });

                            deferred.resolve(response);
                        })
                        .error(function(err, status) {
                            _logOut();
                            deferred.reject(err);
                        });
                } else {
                    //Not sure what to do here, we dont have a reason not to
                    //resolve the deferred, neither have any value to send back too
                    deferred.resolve(null);
                }

            }

            return deferred.promise;
        };

        var _fillAuthData = function() {

            var authData = localStorageService.get('authorizationData');
            console.log(authData);
            if (authData==null) {
                $window.location.href = '#/login';
            } else {            	
                if ($window.location.hash == '#/login') {
                    $window.location.href = '#/';
                }
            }
        }
        service.register = _register;
        service.login = _login;
        service.logOut = _logOut;
        service.populateAuthData = _populateAuthData;
        service.authentication = _authentication;
        service.refreshToken = _refreshToken;
        service.fillAuthData = _fillAuthData

        return service;
    }
})();