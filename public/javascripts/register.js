/**
 * Created by Administrator on 2017/4/7.
 */
var App = angular.module("myApp", []);
App.controller("regCtr", ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.user = {};
    $scope.checkUsername = function () {
        if(!$scope.user.userName) return;
        $http({
            url:'register/checkUsername',
            params:{
                username:$scope.user.userName,
                timeStrap:new Date().getTime()
            }
        }).success(function (data) {
            if(!data.success) alert('用户名已存在');
        });
    };
    $scope.checkPassword = function () {
        if($scope.user.passWord !=$scope.user.passWord2) alert('两次密码不一致');
        return false;
    };
    $scope.register = function () {
        if($scope.user.userName && $scope.user.passWord && $scope.user.passWord2 && $scope.user.passWord == $scope.user.passWord2){
            $http({
                url:'register/register',
                method:'post',
                data:{
                    username:$scope.user.userName,
                    password:$scope.user.passWord
                }
            }).success(function (data) {
                if(data.success && data.msg == '注册成功'){
                    alert('恭喜你注册成功了');
                    setTimeout(function () {
                       window.location.href='/';
                    });
                }
            });
        } else {
            if(!$scope.checkPassword()) return;
            alert('傻逼没填完表');
        }
    };
}]);