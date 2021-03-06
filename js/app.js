var angular = require('angular');
require('angular-route');
require('../dist/templateCachePartials');

angular.module('app', ['ngRoute','appPartials'])
	.config(function ($routeProvider) {
		'use strict';

		$routeProvider
			.when('/', {
                controller: 'MainCtrl',
                templateUrl: '/partials/app-index.html',
                resolve: {
                    key: function($http){
                        return $http.get('/config/api-key.txt')
                            .then(function(response){
                                return response.data;
                            })
                    }
                }
            })
			.otherwise({
				redirectTo: '/'
			});
	});

require('mainCtrl');
require('ideogram');