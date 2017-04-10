/**
 * Created by Administrator on 2017/4/6.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET users listing. */
router.get('/',function (req, res, next) {
    var sign = req.session.sign;
    if(sign){
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '2087',
            database:'fhw'
        });
        var sql_query_session ='SELECT * FROM usersession WHERE session = "'+ sign.split('-')[0] +'"';
        connection.query(sql_query_session,function (err,rows, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            console.log('---------------SELECT----------------');
            console.log('查询session成功');
            if(rows[0] && rows[0].user_name == sign.split('-')[1]){
                var viewParams = {
                    isLogin:true
                };
                res.render('login', viewParams);
                return;
            }else{
                var viewParams = {
                    isLogin:false
                };
                res.render('login', viewParams);
                return;
            }
        });
        connection.end();
    }else {
        var viewParams = {
            isLogin:false
        };
        res.render('login', viewParams);
    }
});

router.post('/login', function(req, res, next) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '2087',
        database:'fhw'
    });
    connection.connect();
    var sql = "SELECT * FROM user WHERE user_name ='"+req.body.username+"'";
    var resJson;
    connection.query(sql, function(err, rows, fields) {
        if (err) throw err;
        if(rows[0] && rows[0].pass_word == req.body.password){
            req.session.sign = Math.ceil(10000000000000*Math.random())+'-'+req.body.username;
            var sql_add_session = 'INSERT INTO usersession(id,user_name,login_time,session) VALUES(0,?,?,?)';
            var sql_add_session_params = [req.body.username,new Date().getTime(),req.session.sign.split('-')[0]];
            connection.query(sql_add_session,sql_add_session_params,function (err, result) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }
                console.log('-------INSERT----------');
                console.log('session 存储成功');
                console.log('INSERT ID:',result);
                console.log('#######################');
                connection.end();
            });
            var resJson = {
                success:true,
                msg:'登录成功'
            };
            res.json(resJson);
        }else {
            var resJson = {
                success:false,
                msg:'用户名密码错误'
            };
            res.json(resJson);
        }
    });
});

router.get('/loginOut', function(req, res, next) {
    req.session.sign = null;
    var resJson = {
        success:true,
        msg:'退出成功'
    };
    res.json(resJson);
});

module.exports = router;