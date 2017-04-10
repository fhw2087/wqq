/**
 * Created by Administrator on 2017/4/10.
 */
var config = {
    mySql:{
        host: 'localhost',
        user: 'root',
        password: '2087',
        database:'fhw'
    }
};
config.addSql = function (table,key,value) {
    return 'SELECT * FROM '+ table +' WHERE '+ key +' = "'+ value +'"';
};
module.exports = config;