/**
 * Created by Administrator on 2017/4/10.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');

/* GET users listing. */
router.get('/',function (req, res, next) {
    res.render('register');
});

router.get('/checkUsername',function (req, res, next) {
    if(req.query.username){
        var connection = mysql.createConnection(config.mySql);
        var sql_query_checkUsername = config.addSql('user','user_name',req.query.username);
        connection.query(sql_query_checkUsername,function (err,rows, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
            }
            if(rows[0]){
                console.log('---------------SELECT----------------');
                console.log('查询到了重复的用户名');
                res.json({
                    success:false,
                    msg:'用户已存在'
                });
            }else {
                res.json({
                    success:true,
                    msg:'用户名可以使用'
                });
            }
        });
        connection.end();
    }else{
        res.json({
            success:false,
            msg:'参数错误'
        });
    }
});

router.post('/register',function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var fname = req.body.fname;
    var part = req.body.part;
    if(username && password && name && fname && part){
        var connection = mysql.createConnection(config.mySql);
        var sql_query_checkUsername = 'SELECT * FROM user WHERE user_name = "'+ username +'"';
        connection.query(sql_query_checkUsername,function (err,rows, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
            }
            if(rows[0]){
                console.log('---------------SELECT----------------');
                console.log('查询到了重复的用户名');
                res.json({
                    success:false,
                    msg:'用户已存在'
                });
                connection.end();
            }else {
                var sql_add_user = 'INSERT INTO user(id,user_name,pass_word,name,fname,part) VALUES(0,?,?,?,?,?)';
                var sql_add_user_params = [username,password,name,fname,part];
                connection.query(sql_add_user,sql_add_user_params,function (err, result) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }
                    console.log('-------INSERT----------');
                    console.log('user信息 存储成功');
                    console.log('INSERT ID:',result);
                    console.log('#######################');
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
                    res.json({
                        success:true,
                        msg:'注册成功'
                    });
                });
            }
        });
    }
});

module.exports = router;
