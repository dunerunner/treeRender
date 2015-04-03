'use strict';
angular.module('treeRenderApp.directiveRecursive', ['ngRoute'])
        .directive('recursiveTree', ['$compile', function ($compile) {
                return {
                    restrict: 'E',
                    transclude: true,
                    scope: {
                        parent: '=',
                        nodes: '=',
                        rootTree: '='
                    },
                    templateUrl: 'templates/templateRecursive.html',
                    controller: ['$scope', 'Storage', function ($scope, Storage) {
                            $scope.addChildNode = function (data) {
                                var nodeCounter = Storage.retrieveData('recursiveMaxIndex') || 0;
                                var nodeId = ++nodeCounter;
                                if (!data) {
                                    return;
                                }
                                var newName = 'Node ID: ' + nodeId + ' Child Of ' + data.id;
                                data.childNodes.push({id: nodeId, name: newName, childNodes: []});
                                Storage.storeData('recursive', $scope.rootTree);
                                Storage.storeData('recursiveMaxIndex', nodeCounter);
                            };
                            $scope.editNode = function (data) {
                                var newName = window.prompt('Enter new node name:');
                                if (newName !== null && newName.trim().length > 0) {
                                    data.name = newName;
                                    Storage.storeData('recursive', $scope.rootTree);
                                } else {
                                    alert('Please enter a valid name!');
                                }
                            };
                            $scope.deleteNode = function (data) {
                                var arrayToSearch = $scope.parent ? $scope.parent.childNodes : $scope.rootTree;
                                arrayToSearch.forEach(function (element, index, array) {
                                    if (element.id === data.id) {
                                        array.splice(index, 1);
                                        Storage.storeData('recursive', $scope.rootTree);
                                        if ($scope.rootTree.length === 0) {
                                            Storage.storeData('recursiveMaxIndex', 0);
                                        }
                                        return;
                                    }
                                });
                            };
                        }],
                    compile: function (tElement, tAttr, transclude) {
                        var contents = tElement.contents().remove();
                        var compiledContents;
                        return function (scope, iElement, iAttr) {
                            if (!compiledContents) {
                                compiledContents = $compile(contents, transclude);
                            }
                            compiledContents(scope, function (clone, scope) {
                                iElement.append(clone);
                            });
                        };
                    }
                };
            }]);