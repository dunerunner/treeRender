/* global angular: true */
'use strict';

angular.module('treeRenderApp', [
    'ngRoute',
    'treeRenderApp.viewIterative',
    'treeRenderApp.viewRecursive',
    'treeRenderApp.storage',
    'treeRenderApp.directiveRecursive',
    'treeRenderApp.directiveIterative'
])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/iterative'});
}]);
