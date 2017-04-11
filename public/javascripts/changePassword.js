/**
 * Created by Administrator on 2017/4/7.
 */
var App = angular.module("myApp", []);
App.controller("changePassCtr", ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.user = {
        userName:userName,
        passWord:'',
        passWordNew:'',
        passWordNew2:''
    };
    $scope.checkPassword = function () {
        if($scope.user.passWordNew != $scope.user.passWordNew2){
            alert('两次密码不一致');
            return false;
        }
        return true;
    };
    $scope.change = function () {
        for(var i in $scope.user){
            if(!$scope.user[i]){
                alert('填完东西啊傻逼');
                return;
            }
        }
        if(!$scope.checkPassword()) return;
        $http({
            url:'changePassword/changePassword',
            method:'post',
            data:{
                username:$scope.user.userName,
                password:$scope.user.passWord,
                passwordnew:$scope.user.passWordNew
            }
        }).success(function (data) {
            if(data.success && data.msg == '修改成功'){
                alert('修改密码成功了');
                setTimeout(function () {
                    window.location.href = 'login';
                },1000);
            }else{
                alert(data.msg);
            }
        });
    };
}]);