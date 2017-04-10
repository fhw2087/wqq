/**
 * Created by Administrator on 2017/4/7.
 */
var App = angular.module("myApp", []);
App.controller("myCtr", ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.isLogin = isLogin;
    $scope.gotologin = function () {
        window.location.href = '/login';
    };
    $scope.loginout = function () {
        $http({
            url:'login/loginOut'
        }).success(function (data) {
            if(data.success && data.msg == '退出成功'){
                window.location.href = '/';
            }
        });
    };
}]);