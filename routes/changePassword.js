/**
 * Created by Administrator on 2017/4/10.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');

/* GET users listing. */
router.get('/',function (req, res, next) {
    res.render('changePassword',{'userName':req.query.username || ''});
});

router.post('/changePassword',function (req, res, next) {
    if(req.body.username && req.body.password && req.body.passwordnew){
        var connection = mysql.createConnection(config.mySql);
        var sql_query_checkUsername = config.addSql('user','user_name',req.body.username);
        connection.query(sql_query_checkUsername,function (err,rows, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
            }
            console.log('---------------SELECT----------------');
            if(rows[0]){
                if(rows[0].pass_word == req.body.password){
                    console.log('开始修改密码');
                    var sql_update_password =  'UPDATE user SET pass_word = ? WHERE user_name = ?';
                    var sql_update_password_params = [req.body.passwordnew,req.body.username];
                    connection.query(sql_update_password,sql_update_password_params,function (err,rows,result) {
                        if(err){
                            console.log('修改失败');
                        }
                        console.log('修改成功');
                        req.session.sign = null;
                        res.json({
                            success:true,
                            msg:'修改成功'
                        });
                    });
                    connection.end();
                }else{
                    console.log('密码不正确');
                    res.json({
                        success:false,
                        msg:'密码不正确'
                    });
                    connection.end();
                }

            }else{
                console.log('用户不存在');
                res.json({
                    success:false,
                    msg:'用户不存在'
                });
                connection.end();
            }
        });
    }else{
        res.json({
            success:false,
            msg:'参数错误'
        });
    }
});

module.exports = router;
