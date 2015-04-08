'use strict';

describe('treeRenderApp.viewIterative module', function () {

    beforeEach(module('treeRenderApp.viewIterative'));
    beforeEach(module('treeRenderApp.storage'));
    describe('viewIterative controller', function () {
        var IterativeCtrl, scope;
        beforeEach(angular.mock.inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            IterativeCtrl = $controller('IterativeCtrl', {
                $scope: scope
            });
        }));
        it('should be defined', inject(function () {
            expect(IterativeCtrl).toBeDefined();
        }));
    });
});