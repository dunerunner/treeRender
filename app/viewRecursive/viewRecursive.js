'use strict';

angular.module('treeRenderApp.viewRecursive', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/recursive', {
                    templateUrl: 'viewRecursive/viewRecursive.html',
                    controller: 'RecursiveCtrl'
                });
            }])

        .controller('RecursiveCtrl', ['$scope', 'Storage', function ($scope, Storage) {
                var nodeCounter = Storage.retrieveData('recursiveMaxIndex') || 0;
                $scope.addChildNode = function (data) {
                    var nodeId = ++nodeCounter;
                    if (!data) {
                        $scope.tree.push({id: nodeId, name: 'Node ID: ' + nodeId + ' ParentNode', childNodes: [], parentObject: null});
                        Storage.storeData('recursive', $scope.tree);
                        Storage.storeData('recursiveMaxIndex', nodeCounter);
                        return;
                    }
                    var newName = 'Node ID: ' + nodeId + ' Child Of ' + data.id;
                    data.childNodes.push({id: nodeId, name: newName, childNodes: []});
                    Storage.storeData('recursive', $scope.tree);
                    Storage.storeData('recursiveMaxIndex', nodeCounter);
                };
                $scope.editNode = function (data) {
                    var newName = window.prompt('Enter new node name:');
                    if (newName !== null && newName.trim().length > 0) {
                        data.name = newName;
                        Storage.storeData('recursive', $scope.tree);
                    } else {
                        alert('Please enter a valid name!');
                    }
                };
                $scope.deleteNode = function (data, parent) {
                    var arrayToSearch = parent ? parent : $scope.tree;
                    arrayToSearch.forEach(function (element, index, array) {
                        if (element.id === data.id) {
                            array.splice(index, 1);
                            Storage.storeData('recursive', $scope.tree);
                            if ($scope.tree.length === 0) {
                                nodeCounter = 0;
                                Storage.storeData('recursiveMaxIndex', 0);
                            }
                            return;
                        }
                    });
                };
                $scope.tree = Storage.retrieveData('recursive') || [];
            }]);