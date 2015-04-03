'use strict';

angular.module('treeRenderApp.viewRecursive', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/recursive', {
                    templateUrl: 'viewRecursive/viewRecursive.html',
                    controller: 'RecursiveCtrl'
                });
            }])

        .controller('RecursiveCtrl', ['$scope', 'Storage', function ($scope, Storage) {
                $scope.addRootNode = function () {
                    var nodeCounter = Storage.retrieveData('recursiveMaxIndex') || 0;
                    var nodeId = ++nodeCounter;
                    $scope.tree.push({id: nodeId, name: 'Node ID: ' + nodeId + ' ParentNode', childNodes: []});
                    Storage.storeData('recursive', $scope.tree);
                    Storage.storeData('recursiveMaxIndex', nodeCounter);
                };
                $scope.tree = Storage.retrieveData('recursive') || [];
            }]);