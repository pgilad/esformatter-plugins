'use strict';

angular.module('npm-plugin-browser').controller('PluginListCtrl', function ($scope, $http, $location) {
    var fields = ['name', 'keywords', 'rating', 'description', 'author', 'modified', 'homepage', 'version'];
    var keywords = ['keywords:esformatter-plugin'];
    var initialFetchSize = 20;

    function formatResult(data) {
        fields.forEach(function (k) {
            if (k === 'keywords') {
                return;
            }
            if (!Array.isArray(data[k])) {
                return;
            }
            data[k] = data[k][0];
        });
        return data;
    }

    function formatData(data) {
        return {
            results: data.results.map(formatResult),
            total: data.total
        };
    }

    function makeRequest(start, size) {
        return $http.get('http://npmsearch.com/query', {
            params: {
                q: keywords,
                fields: fields.join(','),
                start: start,
                size: size,
                sort: 'rating:desc'
            },
            transformResponse: $http.defaults.transformResponse.concat([formatData])
        });
    }

    function sortBy() {
        var args = arguments;

        return function (a, b) {
            var scoreA, scoreB;

            for (var i = 0, len = args.length; i < len; i++) {
                scoreA = args[i](a);
                scoreB = args[i](b);
                if (scoreA < scoreB) {
                    return -1;
                } else if (scoreA > scoreB) {
                    return 1;
                }
            }
            return 0;
        };
    }

    function byRating(plugin) {
        return -plugin.rating;
    }

    function byName(plugin) {
        return plugin.name;
    }

    function sortResults(results) {
        return results.sort(sortBy(byRating, byName));
    }

    makeRequest(0, initialFetchSize)
        .then(function (response) {
            $scope.data = sortResults(response.data.results);
            return makeRequest(initialFetchSize, response.data.total);
        })
        .then(function (response) {
            var allItems = $scope.data.concat(response.data.results);
            $scope.data = sortResults(allItems);
            if (angular.isString(($location.search()).q)) {
                $scope.search = ($location.search()).q;
            }
        });
});
