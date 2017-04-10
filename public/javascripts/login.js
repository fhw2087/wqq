/**
 * Created by Administrator on 2017/4/6.
 */
$(function () {
   $('#login').on('click',function () {
        $.ajax({
           url:'login/login',
            method:'post',
            data:{
                username:$('#username').val(),
                password:$('#password').val(),
                time: new Date().getTime()
            },
            success:function (data) {
                if(data.msg == '登录成功'){
                    $('p').html(data.msg);
                    setTimeout(function () {
                        window.location.href = '/';
                    },1000);
                }else{
                    $('p').html(data.msg);
                }
            }
        });  
   });
});