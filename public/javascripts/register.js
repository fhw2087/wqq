/**
 * Created by Administrator on 2017/4/7.
 */
var App = angular.module("myApp", []);
App.controller("regCtr", ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.user = {
        part:0+''
    };
    $scope.part = ['未选择','总经办','综合部','数据开发组','数据分析组','平台架构组','运维组','前端组','测试组','征信技术部','数据应用组','征信事业部','政务大数据'];
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
        if($scope.user.passWord !=$scope.user.passWord2){
            alert('两次密码不一致');
            return false;
        }
       return true;
    };
    $scope.register = function () {
        if($scope.user.userName && $scope.user.passWord && $scope.user.name && $scope.user.passWord2 && $scope.user.passWord == $scope.user.passWord2 && $scope.user.fname && $scope.user.part>0){
            $http({
                url:'register/register',
                method:'post',
                data:{
                    username:$scope.user.userName,
                    password:$scope.user.passWord,
                    name:$scope.user.name,
                    fname:$scope.user.fname,
                    part:$scope.user.part
                }
            }).success(function (data) {
                if(data.success && data.msg == '注册成功'){
                    alert('恭喜你注册成功了');
                    setTimeout(function () {
                       window.location.href='report';
                    });
                }
            });
        } else {
            if(!$scope.checkPassword()) return;
            alert('傻逼没填完表');
        }
    };
}]);