'use strict';
'use strict';
angular.module('treeRenderApp.directiveIterative', ['ngRoute'])
        .directive('iterativeNode', ['$compile', 'Storage', function ($compile, Storage) {
                return {
                    restrict: 'E',
                    transclude: true,
                    scope: {
                        node: '=',
                        rootTree: '='
                    },
                    templateUrl: 'templates/templateIterative.html',
                    replace: true,
                    link: function ($scope) {
                        function searchForNode(id, node, newName, nodeToDelete) {
                            function searchInArray(array, nodeId) {
                                array.forEach(function (element, idx) {
                                    if (element.id === nodeId) {
                                        if (node) {
                                            element.childNodes.push(node);
                                        }
                                        if (newName) {
                                            element.name = newName;
                                        }
                                        if (nodeToDelete) {
                                            if (nodeId === nodeToDelete) {
                                                array.splice(idx, 1);
                                            }
                                            element.childNodes.forEach(function (child, index) {
                                                if (child.id === nodeToDelete) {
                                                    element.childNodes.splice(index, 1);
                                                    return;
                                                }
                                            });
                                        }
                                        return;
                                    }
                                    if (element.childNodes.length > 0) {
                                        searchInArray(element.childNodes, nodeId);
                                    }
                                });
                            }
                            searchInArray($scope.rootTree, id);
                        }
                        $scope.addChildNode = function (parentNode) {
                            var nodeCounter = Storage.retrieveData('iterativeMaxIndex') || 0;
                            var nodeId = ++nodeCounter;
                            var nodeData = {id: nodeId, parentId: parentNode.id, name: 'Node ID: ' + nodeId + ' Child Of ' + parentNode.id, childNodes: []};
                            searchForNode(parentNode.id, nodeData);
                            var nodeID = 'newNode' + nodeData.id;
                            $scope[nodeID] = nodeData;
                            var nodeToAdd = '<iterative-node root-tree="rootTree" node=' + nodeID + '></iterative-node>';
                            var el = angular.element($compile(nodeToAdd)($scope));
                            document.getElementById('c' + parentNode.id).appendChild(el[0]);
                            Storage.storeData('iterative', $scope.rootTree);
                            Storage.storeData('iterativeMaxIndex', nodeCounter);
                        };

                        $scope.editNode = function (node) {
                            var newName = window.prompt('Enter new node name:');
                            if (newName !== null && newName.trim().length > 0) {
                                searchForNode(node.id, null, newName);
                                node.name = newName;
                                Storage.storeData('iterative', $scope.rootTree);
                            } else {
                                alert('Please enter a valid name!');
                            }
                        };
                        $scope.deleteNode = function (node) {
                            var nodeContainer = document.getElementById('node' + node.id);
                            nodeContainer.parentNode.removeChild(nodeContainer);
                            searchForNode(node.parentId ? node.parentId : node.id, null, null, node.id);
                            Storage.storeData('iterative', $scope.rootTree);
                            if ($scope.rootTree.length === 0) {
                                Storage.storeData('iterativeMaxIndex', 0);
                            }
                        };
                    }
                };
            }]);