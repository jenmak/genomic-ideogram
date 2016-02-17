var angular = require('angular');
angular.module('app')
	.controller('MainCtrl', function TodoCtrl($scope, $http, key) {
		'use strict';
		
		var facetsUrl = 'https://api.solvebio.com/v1/dataset_fields/3176/facets?limit=100&access_token='+key;
		function getFacets() {
			$http.get(facetsUrl).success(function(data) {
				$scope.chromosomeList = data['facets'];
			});
		}

		var bandsUrl = 'https://api.solvebio.com/v1/datasets/ISCN/1.1.1-2015-01-05/Ideograms/data?access_token='+key;
		function getBands(chromosome) {
			var bandsData = {
				'fields': [
				"arm",
				"band_label",
				"genomic_coordinates.start",
				"genomic_coordinates.stop",
				"density"
				],
				'filters': [
					["genomic_coordinates.chromosome", chromosome],
					["band_level", "400"]
				]
			};

			$http.post(bandsUrl, bandsData).success(function(data) {
				$scope.selected.bands = data.results;
			});
		}

		getFacets();

		$scope.$watch( "selected.chromosome",
			function ( newVal ) {
				if(newVal != undefined) {
					getBands(newVal[0]);
				}
			}
		);
	});
