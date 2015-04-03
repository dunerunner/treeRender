'use strict';
'use strict';
angular.module('treeRenderApp.directiveIterative', ['ngRoute'])
        .directive('iterativeNode', ['$compile', function ($compile) {
                return {
                    restrict: 'E',
                    transclude: true,
                    scope: {
                        node: '=',
                        rootTree: '='
                    },
                    templateUrl: 'templates/templateIterative.html',
                    replace: true,
                    controller: ['$scope', 'Storage', function ($scope, Storage) {
                            $scope.addChildNode = function (parentNode) {
                                console.log(parentNode);
                                var nodeCounter = Storage.retrieveData('iterativeMaxIndex') || 0;
                                var nodeId = ++nodeCounter;
                                var nodeData = {id: nodeId, parentId: parentNode.id, name: 'Node ID: ' + nodeId + ' Child Of ' + parentNode.id, childNodes: []};
                                parentNode.childNodes.push(nodeData);
                                var nodeID = 'newNode' + nodeData.id;
                                $scope[nodeID] = nodeData;
                                var nodeToAdd = '<iterative-node root-tree="tree" node=' + nodeID + '></iterative-node>';
                                var el = angular.element($compile(nodeToAdd)($scope));
                                document.getElementById('c' + parentNode.id).appendChild(el[0]);
                                Storage.storeData('iterative', $scope.rootTree);
                                Storage.storeData('iterativeMaxIndex', nodeCounter);
                            };

                            $scope.editNode = function (nodeId) {
                                var newName = window.prompt('Enter new node name:');
                                if (newName !== null && newName.trim().length > 0) {
                                    treeData.forEach(function (element, index) {
                                        if (element.id === nodeId) {
                                            treeData[index].title = newName;
                                        }
                                        return;
                                    });
                                    appendedNodesById[nodeId].childNodes[0].childNodes[0].innerHTML = newName;
                                    Storage.storeData('iterative', treeData);
                                } else {
                                    alert('Please enter a valid name!');
                                }
                            };
                            function collectGarbage(nodeId) {
                                var deletedIds = [nodeId];
                                while (deletedIds.length > 0) {
                                    for (var i = treeData.length - 1; i >= 0; i--) {
                                        if (treeData[i].parentId === deletedIds[0]) {
                                            deletedIds.push(treeData[i].id);
                                            treeData.splice(i, 1);
                                        }
                                    }
                                    deletedIds.shift();
                                }
                            }
                            $scope.deleteNode = function (nodeId) {
                                var parentID;
                                treeData.forEach(function (element, index) {
                                    if (element.id === nodeId) {
                                        parentID = element.parentId;
                                        treeData.splice(index, 1);
                                        collectGarbage(nodeId);
                                        return;
                                    }
                                });
                                var parent = appendedNodesById[nodeId].parentNode;
                                parent.removeChild(appendedNodesById[nodeId]);
                                if (parent.childNodes.length < 1) {
                                    if (parentID) {
                                        nodesById[parentID].removeChildContainer();
                                        parent.parentNode.removeChild(parent);
                                    }
                                }
                                Storage.storeData('iterative', treeData);
                                if (treeData.length === 0) {
                                    nodeCounter = 0;
                                    Storage.storeData('iterativeMaxIndex', 0);
                                }
                            };
                        }]
                };
            }]);