'use strict';

angular.module('treeRenderApp', [
    'ngRoute',
    'treeRenderApp.viewIterative',
    'treeRenderApp.viewRecursive',
    'treeRenderApp.storage'
])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/iterative'});
}]);
