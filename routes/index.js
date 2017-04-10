var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  var sign = req.session.sign;
  if(sign){
      var connection = mysql.createConnection(config.mySql);
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
                  isLogin:true,
                  userName:sign.split('-')[1]
              };
              res.render('index', viewParams);
              return;
          }else{
              var viewParams = {
                  isLogin:false,
                  userName:''
              };
              res.render('index', viewParams);
              return;
          }
      });
      connection.end();
  }else {
      var viewParams = {
          isLogin:false,
          userName:''
      };
      res.render('index', viewParams);
  }
});

module.exports = router;
