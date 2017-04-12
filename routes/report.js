/**
 * Created by Administrator on 2017/4/10.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');

/* GET users listing. */
router.get('/',function (req, res, next) {
    var username = req.session.sign && req.session.sign.split('-')[1];
    if(username){
        var connection = mysql.createConnection(config.mySql);
        var sql_query_name = config.addSql('user','user_name',username);
        connection.query(sql_query_name,function (err,rows, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
            }
            if(rows[0] && rows[0].name){
                res.render('report',{username:username,name:rows[0].name,level:rows[0].level,fname:rows[0].fname,part:rows[0].part});
            }else{
                res.render('report',{username:username,name:'',level:10,fname:'',part:''});
            }
            connection.end();
        });
    }else{
        res.render('index',{isLogin:false,userName:''});
    }
});

router.post('/addNow',function (req, res, next) {
    var username = req.session.sign && req.session.sign.split('-')[1];
    if(!username){
        res.json({
            success:false,
            msg:'用户未登录'
        });
        return;
    }
    var str = req.body.str;
    if(!str){
        res.json({
            success:false,
            msg:'参数有误'
        });
        return;
    }
    var date = req.body.date || new Date().toLocaleDateString();
    var connection = mysql.createConnection(config.mySql);
    var sql_query_report =  'SELECT * FROM report WHERE user_name ="'+ username +'" AND date = "'+ date +'"';
    connection.query(sql_query_report, function (err,rows, result) {
        if(err){
            console.log('查询信息失败',err);
        }
        if(rows && rows.length){
            console.log('查询成功,有数据');
            connection.end();
            res.json({
                success:false,
                msg:date+'已经填过了，请修改'
            });
        }else{
            var sql_add_report = 'INSERT INTO report(id,user_name,date,report) VALUES(0,?,?,?)';
            var sql_add_report_params = [username,date,str];
            connection.query(sql_add_report,sql_add_report_params, function (err,rows, result) {
                if(err){
                    console.log('添加信息失败',err);
                }
                console.log('-------INSERT----------');
                console.log('session 存储成功');
                console.log('#######################');
                res.json({
                    success:true,
                    msg:'添加成功'
                });
                connection.end();
            });
        }
    });

});

router.post('/changeNow',function (req, res, next) {
    var username = req.session.sign && req.session.sign.split('-')[1];
    if(!username){
        res.json({
            success:false,
            msg:'用户未登录'
        });
        return;
    }
    var str = req.body.str;
    if(!str){
        res.json({
            success:false,
            msg:'参数有误'
        });
        return;
    }
    var date = req.body.date || new Date().toLocaleDateString();
    var connection = mysql.createConnection(config.mySql);
    var sql_query_report =  'SELECT * FROM report WHERE user_name ="'+ username +'" AND date = "'+ date +'"';
    connection.query(sql_query_report, function (err,rows, result) {
        if(err){
            console.log('查询信息失败',err);
        }
        if(rows && rows.length){
            console.log('查询成功,有数据');
            var sql_update_report = 'UPDATE report SET report = ? WHERE user_name = ? AND date = ?';
            var sql_update_report_params = [str,username,date];
            connection.query(sql_update_report,sql_update_report_params, function (err,rows, result) {
                if(err){
                    console.log('修改信息失败',err);
                }
                console.log('-------INSERT----------');
                console.log('修改成功');
                console.log('#######################');
                res.json({
                    success:true,
                    msg:'添加成功'
                });
                connection.end();
            });
        }else{
            console.log('查询成功,没有数据');
            connection.end();
            res.json({
                success:false,
                msg:date+'还没填过，请先填写'
            });
        }
    });
});

router.get('/checkNow',function (req, res, next) {
    var username = req.session.sign && req.session.sign.split('-')[1];
    if(!username){
        res.json({
            success:false,
            msg:'用户未登录'
        });
        return;
    }
    var date = req.query.date || new Date().toLocaleDateString();
    var connection = mysql.createConnection(config.mySql);
    var sql_search_report =  'SELECT * FROM report WHERE user_name ="'+ username +'" AND date = "'+ date +'"';
    connection.query(sql_search_report, function (err,rows, result) {
        if(err){
            console.log('查询信息失败',err);
        }
        if(rows[0] && rows[0].report){
            console.log('查询成功,有数据');
            res.json({
                success:true,
                str:rows[0].report
            });
        }else{
            console.log('查询成功,没数据');
            res.json({
                success:false,
                msg:'没填写过'
            });
        }
        connection.end();
    });
});

router.get('/queryMyReport',function (req, res, next) {
    var username = req.session.sign && req.session.sign.split('-')[1];
    if(!username){
        res.json({
            success:false,
            msg:'用户未登录'
        });
        return;
    }
    var date = new Date(req.query.date).toLocaleDateString();
    if(!date){
        res.json({
            success:false,
            msg:'参数错误'
        });
        return;
    }
    var connection = mysql.createConnection(config.mySql);
    var sql_search_report =  'SELECT * FROM report WHERE user_name ="'+ username +'" AND date = "'+ date +'"';
    connection.query(sql_search_report, function (err,rows, result) {
        if(err){
            console.log('查询信息失败',err);
        }
        if(rows[0] && rows[0].report){
            console.log('查询成功,有数据');
            res.json({
                success:true,
                str:rows[0].report
            });
        }else{
            console.log('查询成功,没数据');
            res.json({
                success:false,
                msg:'没信息'
            });
        }
        connection.end();
    });
});

router.get('/getUsers',function (req,res,next){
    var username = req.session.sign && req.session.sign.split('-')[1];
    if(!username){
        res.json({
            success:false,
            msg:'用户未登录'
        });
        return;
    }
    var connection = mysql.createConnection(config.mySql);
    var sql_search_report =  'SELECT * FROM user';
    connection.query(sql_search_report, function (err,rows, result) {
        if(err){
            console.log('查询信息失败',err);
        }
        if(rows){
            console.log('查询成功,有数据');
            var users = [];
            for(var i in rows){
                users.push({
                    username:rows[i].user_name,
                    name:rows[i].name,
                    fname:rows[i].fname,
                    part:rows[i].part,
                    level:rows[i].level
                })
            }
            res.json({
                success:true,
                user:users
            });
        }
        connection.end();
    });
});

router.get('/partQuery',function (req,res,next){
    var username = req.session.sign && req.session.sign.split('-')[1];
    if(!username){
        res.json({
            success:false,
            msg:'用户未登录'
        });
        return;
    }
    var date = req.query.date;
    if(!date){
        res.json({
            success:false,
            msg:'参数错误'
        });
        return;
    }
    var connection = mysql.createConnection(config.mySql);
    var sql_search_report =  'SELECT * FROM report WHERE date = "'+date+'"';
    connection.query(sql_search_report, function (err,rows, result) {
        if(err){
            console.log('查询信息失败',err);
        }
        if(rows){
            console.log('查询成功,有数据');
            res.json({
                success:true,
                report:rows
            });
        }
        connection.end();
    });
});

router.get('/persQuery',function (req,res,next){
    var username = req.session.sign && req.session.sign.split('-')[1];
    if(!username){
        res.json({
            success:false,
            msg:'用户未登录'
        });
        return;
    }
    var qname = req.query.username;
    if(!qname){
        res.json({
            success:false,
            msg:'参数错误'
        });
        return;
    }
    var connection = mysql.createConnection(config.mySql);
    var sql_search_report =  'SELECT * FROM report WHERE user_name = "'+qname+'"';
    connection.query(sql_search_report, function (err,rows, result) {
        if(err){
            console.log('查询信息失败',err);
        }
        if(rows){
            console.log('查询成功,有数据');
            res.json({
                success:true,
                report:rows
            });
        }
        connection.end();
    });
});

module.exports = router;
