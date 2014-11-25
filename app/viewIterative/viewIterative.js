'use strict';

angular.module('treeRenderApp.viewIterative', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/iterative', {
                    templateUrl: 'viewIterative/viewIterative.html',
                    controller: 'IterativeCtrl'
                });
            }])

        .controller('IterativeCtrl', ['$scope', '$compile', 'Storage',
            function ($scope, $compile, Storage) {
                function NodeItem(data) {
                    this.data = data;
                    var container = document.createElement('li');
                    container.className = "b-node-list__node";
                    var elementWrap = container.appendChild(document.createElement('div'));
                    elementWrap.className = 'b-node';
                    var title = elementWrap.appendChild(document.createElement('div'));
                    title.className = 'b-node__title';

                    var controls = elementWrap.appendChild(document.createElement('div'));
                    controls.className = 'b-node__controls';

                    var addButton = document.createElement('button');
                    addButton.innerHTML = 'Add Child Node';
                    addButton.className = "b-button";
                    addButton.setAttribute('ng-click', 'addChildNode(' + data.id + ')');

                    var editButton = document.createElement('button');
                    editButton.innerHTML = 'Edit Node';
                    editButton.className = "b-button";
                    editButton.setAttribute('ng-click', 'editNode(' + data.id + ')');

                    var deleteButton = document.createElement('button');
                    deleteButton.innerHTML = 'Delete Node';
                    deleteButton.className = "b-button";
                    deleteButton.setAttribute('ng-click', 'deleteNode(' + data.id + ')');

                    controls.appendChild(addButton);
                    controls.appendChild(editButton);
                    controls.appendChild(deleteButton);

                    title.innerHTML = this.data.title;
                    this.element = container;
                }
                NodeItem.prototype = {
                    getChildContainer: function () {
                        if (this._childElement) {
                            return this._childElement;
                        } else {
                            var subList = document.createElement("ul");
                            subList.className = "b-node-list";
                            return this.element.appendChild(subList);
                        }
                    },
                    removeChildContainer: function () {
                        this._childElement = null;
                    }
                };

                var nodeContainer;
                var nodesById;
                var appendedNodesById;
                var treeData = Storage.retrieveData('iterative') || [];
                var nodeCounter = Storage.retrieveData('iterativeMaxIndex') || 0;

                function generateNodeTree() {
                    var nodeCollection = treeData.map(function (node) {
                        return new NodeItem(node);
                    });
                    nodesById = {};
                    appendedNodesById = {};
                    for (var i = 0; i < nodeCollection.length; i++) {
                        nodesById[nodeCollection[i].data.id] = nodeCollection[i];
                    }

                    nodeContainer = document.createElement("ul");
                    nodeContainer.className = "b-node-list";
                    nodeContainer.id = "rootNodeContainer";

                    for (var i = 0; i < nodeCollection.length; i++) {
                        var node = nodeCollection[i];
                        var parentElement = node.data.parentId ? nodesById[node.data.parentId].getChildContainer() : nodeContainer;
                        appendedNodesById[nodeCollection[i].data.id] = parentElement.appendChild(node.element);
                    }
                    document.getElementById('iterative').appendChild(nodeContainer);
                    angular.element($compile(nodeContainer)($scope));
                }

                generateNodeTree();

                $scope.addChildNode = function (parentID) {
                    var nodeId = ++nodeCounter;
                    var nodeData;
                    var container;
                    if (parentID) {
                        nodeData = {'id': nodeId, 'parentId': parentID, 'title': 'Node ID: ' + nodeId + ' Child Of ' + parentID};
                        container = nodesById[parentID].getChildContainer();
                    } else {
                        nodeData = {'id': nodeId, 'parentId': null, 'title': 'Node ID: ' + nodeId + ' ParentNode'};
                        container = nodeContainer;
                    }
                    treeData.push(nodeData);
                    var newNode = new NodeItem(nodeData);
                    nodesById[nodeId] = newNode;
                    appendedNodesById[nodeId] = container.appendChild(newNode.element);
                    angular.element($compile(appendedNodesById[nodeId])($scope));
                    Storage.storeData('iterative', treeData);
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
            }]);