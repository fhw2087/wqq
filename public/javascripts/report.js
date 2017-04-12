/**
 * Created by Administrator on 2017/4/7.
 */
var App = angular.module("myApp", []);
App.controller("reportCtr", ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.partC = ['未选择','总经办','综合部','数据开发组','数据分析组','平台架构组','运维组','前端组','测试组','征信技术部','数据应用组','征信事业部','政务大数据'];
    $scope.user = {
        username:username,
        name:name,
        level:level,
        fname:fname,
        part:$scope.partC[part]
    };
    $scope.reportConfig = {
        activeTabIndex:0,
        isFetchDate:[],
        nowReport:[
            {
                content:'',
                dur:''
            }
        ],
        myAddDate:new Date().toLocaleDateString(),
        hasConfirm:false,
        isChange:false,
        myReportDate:'',
        myDateReport:[],
        partTree:[],
        users:[],
        partQuery:true,
        queryPerName:'',
        queryPerUsername:'',
        queryPerDate:new Date().toLocaleDateString(),
        queryReportC: []
    };
    console.log($scope.reportConfig.partTree);
    $scope.fatchDate = function (n) {
        switch (n){
            case 0:{
                if(!$scope.reportConfig.isFetchDate[n]){
                    $('#myReportAddDate').datetimepicker({
                        format: 'yyyy-mm-dd',
                        minView: 2,
                        todayBtn: 'linked',
                        todayHighlight: true,
                        autoclose: true
                    });
                    $("#myReportAddDate_1").click(function () {
                        $('#myReportAddDate').focus();
                    });
                    $scope.reportConfig.isFetchDate[n] = true;
                }
                $scope.checkNow();
                break;
            }
            case  1:{
                if(!$scope.reportConfig.isFetchDate[n]){
                    $('#myReportDate').datetimepicker({
                        format: 'yyyy-mm-dd',
                        minView: 2,
                        todayBtn: 'linked',
                        todayHighlight: true,
                        autoclose: true
                    });
                    $("#myReportDate_1").click(function () {
                        $('#myReportDate').focus();
                    });
                    $scope.reportConfig.isFetchDate[n] = true;
                }
                break;
            }
            case  2:{
                if(!$scope.reportConfig.isFetchDate[n]){
                    $('#queryPerDate').datetimepicker({
                        format: 'yyyy-mm-dd',
                        minView: 2,
                        todayBtn: 'linked',
                        todayHighlight: true,
                        autoclose: true
                    });
                    $("#queryPerDate_1").click(function () {
                        $('#queryPerDate').focus();
                    });
                    $scope.reportConfig.isFetchDate[n] = true;
                }
                $scope.getUsers();
                break;
            }
        }
    };

    $scope.changeTab = function (n) {
        $scope.reportConfig.activeTabIndex = n || 0;
        $scope.fatchDate(n);
    };

    $scope.checkDur = function (n,v) {
        if(isNaN(v) || v < 0){
            alert('第'+(n+1)+'项时长不正确');
            return false
        }
        return true;
    };

    $scope.addNewItem = function () {
        if($scope.reportConfig.nowReport[$scope.reportConfig.nowReport.length-1].content && $scope.reportConfig.nowReport[$scope.reportConfig.nowReport.length-1].dur > 0 && !isNaN($scope.reportConfig.nowReport[$scope.reportConfig.nowReport.length-1].dur)){
            $scope.reportConfig.nowReport.push({
                content:'',
                dur:''
            });
        }else{
            alert('前一项填的有问题');
        }

    };

    $scope.deleteItem = function (n) {
        $scope.reportConfig.nowReport.splice(n,1);
    };

    $scope.confirm = function () {
        if($scope.reportConfig.nowReport[$scope.reportConfig.nowReport.length-1].content && $scope.reportConfig.nowReport[$scope.reportConfig.nowReport.length-1].dur > 0 && !isNaN($scope.reportConfig.nowReport[$scope.reportConfig.nowReport.length-1].dur)){
            var str = '';
            for(var i = 0;i<$scope.reportConfig.nowReport.length;i++){
                str += $scope.reportConfig.nowReport[i].content+'zhuanyongfengexian'+$scope.reportConfig.nowReport[i].dur+'zhuanyongxiaofenge'
            }
            $scope.reportConfig.isConfirming = true;
            $http({
                url:$scope.reportConfig.isChange ? 'report/changeNow': 'report/addNow',
                data:{
                    str:str,
                    date:$scope.reportConfig.myAddDate
                },
                method:'post'
            }).success(function (data) {
                $scope.reportConfig.isConfirming = false;
                if(data.success && data.msg == '添加成功'){
                    alert(data.msg);
                    $scope.reportConfig.hasConfirm = true;
                }else{
                    alert(data.msg);
                }
            });
        }else{
            alert('最后一项没填完');
        }
    };

    $scope.checkNow = function () {
        $http({
            url:'report/checkNow',
            params:{
                time:new Date().getTime(),
                date:$scope.reportConfig.myAddDate
            }
        }).success(function (data) {
            if(data.success){
                var arr = data.str.split('zhuanyongxiaofenge');
                arr.length--;
                $scope.reportConfig.nowReport = [];
                for(var i =0;i<arr.length;i++){
                    $scope.reportConfig.nowReport.push({
                        content:arr[i].split('zhuanyongfengexian')[0],
                        dur: arr[i].split('zhuanyongfengexian')[1]-0
                    });
                }
                $scope.reportConfig.hasConfirm = true;
            }else {
                $scope.reportConfig.nowReport = [{
                    content:'',
                    dur:''
                }];
                $scope.reportConfig.hasConfirm = false;
            }
        });
    };

    $scope.queryMyReport = function () {

        $scope.reportConfig.myDateReport = [];
        var date = $scope.reportConfig.myReportDate;
        $http({
            url:'report/queryMyReport',
            params:{
                date:date,
                time:new Date().getTime()
            }
        }).success(function (data) {
            if(data.success){
                var arr = data.str.split('zhuanyongxiaofenge');
                arr.length--;
                for(var i =0;i<arr.length;i++){
                    $scope.reportConfig.myDateReport.push({
                        content:arr[i].split('zhuanyongfengexian')[0],
                        dur: arr[i].split('zhuanyongfengexian')[1]-0
                    });
                }
            }else{
                alert(data.msg);
            }
        });
    };

    $scope.queryAddReport = function () {
        $http({
            url:'report/checkNow',
            params:{
                date: new Date($scope.reportConfig.myAddDate).toLocaleDateString(),
                time:new Date().getTime()
            }
        }).success(function (data) {
            if(data.success){
                var arr = data.str.split('zhuanyongxiaofenge');
                arr.length--;
                $scope.reportConfig.nowReport = [];
                for(var i =0;i<arr.length;i++){
                    $scope.reportConfig.nowReport.push({
                        content:arr[i].split('zhuanyongfengexian')[0],
                        dur: arr[i].split('zhuanyongfengexian')[1]-0
                    });
                }
                $scope.reportConfig.isChange = true;
                $scope.reportConfig.hasConfirm = true;
            }else{
                $scope.reportConfig.nowReport = [{
                    content:'',
                    dur:''
                }];
                $scope.reportConfig.isChange = false;
                $scope.reportConfig.hasConfirm = false;
            }
        });
    };

    $scope.getUsers = function () {
        for(var i in $scope.partC){
            $scope.reportConfig.partTree[i] = [];
        }
        $http({
            url:'report/getUsers',
            params:{
                time:new Date().getTime()
            }
        }).success(function (data) {
            if(data.success){
                $scope.reportConfig.users = data.user;
                for(var i in data.user){
                    var j = data.user[i].part-0;
                    $scope.reportConfig.partTree[j].push(data.user[i]);
                }
            }
        });
    };

    $scope.queryAllReport = function () {
        if($scope.reportConfig.partQuery){
            if(!$scope.reportConfig.queryPerName){
                alert('选择一个名字啊');
                return;
            }
        }
        $http({
            url: !$scope.reportConfig.partQuery ? 'report/partQuery': 'report/persQuery',
            params:{
                time:new Date().getTime(),
                username:$scope.reportConfig.queryPerUsername,
                date:$scope.reportConfig.queryPerDate
            }
        }).success(function (data) {
            if(data.success){
                var arr = [];
                for(var i in data.report){
                    var _username = data.report[i].user_name;
                    data.report[i].name = findItsName(_username);
                    data.report[i].date = new Date(data.report[i].date).toLocaleDateString();
                    var _content = data.report[i].report.split('zhuanyongxiaofenge');
                    _content.length--;
                    var _content2 = [];
                    for(var j =0;j<_content.length;j++){
                        _content2.push({
                            content:_content[j].split('zhuanyongfengexian')[0],
                            dur: _content[j].split('zhuanyongfengexian')[1]-0
                        });
                    }
                    data.report[i].report = _content2;
                }
                $scope.reportConfig.queryReportC = data.report;
            }
        });
    };

    function findItsName(username) {
         for(var i in $scope.reportConfig.users){
             if($scope.reportConfig.users[i].username == username){
                 return $scope.reportConfig.users[i].name;
             }
         }
    }


    $scope.fatchDate(0);

}]);