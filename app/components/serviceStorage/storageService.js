'use strict';

angular.module('treeRenderApp.storage', [])

        .factory('Storage', ['$window', function ($window) {
                return {
                    storeData: function (label, data) {
                        $window.localStorage.setItem(label, angular.toJson(data));
                    },
                    retrieveData: function (label) {
                        var data = $window.localStorage.getItem(label);
                        return angular.fromJson(data);
                    }
                };
            }]);