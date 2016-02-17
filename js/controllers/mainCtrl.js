var angular = require('angular');
angular.module('app')
	.controller('MainCtrl', function TodoCtrl($scope, $http, key) {
		'use strict';

		var facetsUrl = 'https://api.solvebio.com/v1/dataset_fields/3176/facets?limit=100&access_token='+key;
		function getFacets() {
			$http.get(facetsUrl).success(function(data) {
				function isInteger(x) {
					return x % 1 === 0;
				}
				var numList = [], strList = [];
				data['facets'].forEach(function(d) {
					if(isInteger(d[0])) {
						d[0] = parseInt(d[0]);
						numList.push(d[0]);
					} else {
						strList.push(d[0]);
					}
				});
				numList.sort(function(a, b){return a-b});
				strList.sort();
				$scope.chromosomeList = numList.concat(strList);
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
					getBands(newVal);
				}
			}
		);
	});
