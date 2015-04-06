'use strict';

angular.module('treeRenderApp.viewIterative', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/iterative', {
                    templateUrl: 'viewIterative/viewIterative.html',
                    controller: 'IterativeCtrl'
                });
            }])

        .controller('IterativeCtrl', ['$scope', '$compile', '$timeout', 'Storage',
            function ($scope, $compile, $timeout, Storage) {
                function generateNodeTree() {
                    function renderLevel(thisLevel) {
                        $scope.tree = Storage.retrieveData('iterative') || [];
                        var nextLevel = [];
                        while (thisLevel.length > 0) {
                            var currentElement = thisLevel.shift();
                            var nodeID = 'newNode' + currentElement.id;
                            $scope[nodeID] = currentElement;
                            var nodeToAdd = '<iterative-node root-tree="tree" node="' + nodeID + '"></iterative-node>';
                            var el = angular.element($compile(nodeToAdd)($scope));
                            if (currentElement.parentId) {
                                console.log('c' + currentElement.parentId);
                                console.log(document.getElementById('c' + currentElement.parentId));
                                document.getElementById('c' + currentElement.parentId).appendChild(el[0]);
                            } else {
                                nodeContainer.appendChild(el[0]);
                            }
                            if (currentElement.childNodes.length > 0) {
                                currentElement.childNodes.forEach(function (element) {
                                    nextLevel.push(element);
                                });
                            }
                        }
                        if (nextLevel.length > 0) {
                            $timeout(function () {
                                renderLevel(nextLevel);
                            }, 50);
                        }

                    }
                    renderLevel($scope.tree);
                }
                $scope.addRootNode = function () {
                    var nodeCounter = Storage.retrieveData('iterativeMaxIndex') || 0;
                    var nodeId = ++nodeCounter;
                    var nodeData = {id: nodeId, parentId: null, name: 'Node ID: ' + nodeId + ' ParentNode', childNodes: []};
                    $scope.tree.push(nodeData);
                    var nodeID = 'newNode' + nodeData.id;
                    $scope[nodeID] = nodeData;
                    var nodeToAdd = '<iterative-node root-tree="tree" node=' + nodeID + '></iterative-node>';
                    var el = angular.element($compile(nodeToAdd)($scope));
                    nodeContainer.appendChild(el[0]);
                    Storage.storeData('iterative', $scope.tree);
                    Storage.storeData('iterativeMaxIndex', nodeCounter);
                };
                var nodeContainer = document.getElementById('rootList');
                $scope.tree = Storage.retrieveData('iterative') || [];
                generateNodeTree();
            }]);