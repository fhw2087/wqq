/**
 * Created by Administrator on 2017/4/6.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET users listing. */
router.get('/',function (req, res, nest) {
    if(req.app.locals.user == 'wqq'){
        res.render('index', { title: '首页',isLogin:req.app.locals.user == 'wqq'? true:false });
        return;
    }
    res.locals.msg = 'wqq';
    res.locals.title = 'wqq';
    res.render('login');
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
            var sql_query_sign = "SELECT * FROM user WHERE user_name ='"+req.session.sign && req.session.sign.split('-')[0]+"'";
            connection.query(sql_query_sign, function(err, rows, fields) {
                if (err) throw err;
                var sign = Math.ceil(Math.random()*1000000000000);
                req.session.sign = sign+'-'+req.body.username;
                if(rows[0] && rows[0].user_name ==req.session.sign.split('-')[1] ){
                    var userModSql = 'UPDATE userSession SET login_time = ?,session = ? WHERE user_name = ?';
                    var userModSql_data = [ new Date().getTime(),sign,req.body.username];
                    connection.query(userModSql,userModSql_data,function (err, result) {
                        if(err){
                            console.log('[UPDATE ERROR] - ',err.message);
                            connection.end();
                            return;
                        }
                        console.log('-------UPDATE----------');
                        console.log('UPDATE ID:',result);
                        console.log('#######################');
                    });
                }else{
                    var sql_session = 'INSERT INTO userSession(id,user_name,login_time,session) VALUES(0,?,?,?)';
                    var sql_data = [req.body.username, new Date().getTime(),sign];
                    connection.query(sql_session,sql_data,function (err, result) {
                        if(err){
                            console.log('[INSERT ERROR] - ',err.message);
                            connection.end();
                            return;
                        }
                        console.log('-------INSERT----------');
                        console.log('INSERT ID:',result);
                        console.log('#######################');
                    });
                }
            });
            resJson = {
                'success':true,
                'msg':'登录成功'
            };
            res.json(resJson);
        }else{
            resJson = {
                'success':false,
                'msg':'账号密码错误'
            };
            connection.end();
            res.json(resJson);
        }
    });
});

router.get('/loginOut', function(req, res, next) {
    // connection.connect();
    // var  userDelSql = 'DELETE FROM userSession WHERE user_name = "++"';
    // connection.query(userDelSql,function (err, result) {
    //     if(err){
    //         console.log('[DELETE ERROR] - ',err.message);
    //         return;
    //     }
    //
    //     console.log('-------------DELETE--------------');
    //     console.log('DELETE affectedRows',result.affectedRows);
    //     console.log('&&&&&&&&&&&&&&&&&');
    // });
    var resJson = {
        success:true,
        msg:'退出成功'
    };
    res.json(resJson);
});

module.exports = router;