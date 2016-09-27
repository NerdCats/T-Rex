(function() {
  'use strict';

  angular
    .module('app')
    .factory('authInterceptorService', authInterceptorService);

  authInterceptorService.$inject = ['$q', '$injector', '$location', 'localStorageService'];

  /* @ngInject */
  function authInterceptorService($q, $injector, $location, localStorageService) {
    var authInterceptorServiceFactory = {};

    var _request = function(config) {

      config.headers = config.headers || {};

      var authData = localStorageService.get('authorizationData');
      if (authData) {
        config.headers.Authorization = 'Bearer ' + authData.token;
      }

      return config;
    };

    var _responseError = function(rejection) {
      if (rejection.status === 401) {
        var authService = $injector.get('authService');
        var authData = localStorageService.get('authorizationData');
        
        if (authData) {
          if (authData.useRefreshTokens) {
            authService.refreshToken().then(function(response){
              
            }, function(error){
              authService.logOut();
              $location.path('/login');
            })            
          }
        } else {
          authService.logOut();
          $location.path('/login');
        }
        
      }
      return $q.reject(rejection);
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
  }
})();
