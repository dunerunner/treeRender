'use strict';

describe('treeRenderApp.viewRecursive module', function () {

    beforeEach(module('treeRenderApp.viewRecursive'));
    beforeEach(module('treeRenderApp.storage'));

    describe('viewRecursive controller', function () {
        var RecursiveCrtl, scope;
        beforeEach(angular.mock.inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            RecursiveCrtl = $controller('RecursiveCtrl', {
                $scope: scope
            });
        }));
        it('should be defined', inject(function () {
            expect(RecursiveCrtl).toBeDefined();
        }));

    });
});