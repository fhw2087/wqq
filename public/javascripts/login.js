/**
 * Created by Administrator on 2017/4/6.
 */
var App = angular.module("myApp", []);
App.controller("loginCtr", ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.isLogin = isLogin;
    $scope.loginIn = function () {
        $http({
            method:'post',
            url:'login/login',
            data:{
                username:$scope.userName,
                password:$scope.passWord,
                timeStrap:new Date().getTime()
            }
        }).success(function (data) {
            if(data.success && data.msg == '登录成功'){
                setTimeout(function () {
                    window.location.href = '/';
                },500);
            }else{
                alert(data.msg);
            }
        });
    };
}]);