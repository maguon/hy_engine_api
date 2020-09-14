'use strict';
let serializer = require('serializer');
const serverLogger = require('./ServerLogger.js');
const logger = serverLogger.createLogger('OAuthUtil.js');
const systemConfig = require('../config/Stg_SystemConfig.js');
const httpUtil = require('./HttpUtil.js');

const options ={
    crypt_key: 'hl',
    sign_key: 'myxxjs'
};

const clientType = {
    temp : 'temp',
    user : 'user' ,
    admin : 'admin'
};

const clientId ="hl";

const headerTokenMeta = "auth-token";

//The expired time 30 days
const expiredTime = 30*24*60*60*1000;
serializer = serializer.createSecureSerializer(options.crypt_key, options.sign_key);



const createAccessToken=(clientType,userId,status)=>{
    let out ;
    out = {
        access_token: serializer.stringify([clientType,userId,+new Date,status ]),
        refresh_token: null
    };
    return out.access_token;
}

const parseAccessToken=(accessToken)=>{
    try{
        let data = serializer.parse(accessToken);
        let tokenInfo ={};
        tokenInfo.clientType = data[0];
        tokenInfo.userId = data[1];
        tokenInfo.grantDate = data[2];
        tokenInfo.status = data[3];
        return tokenInfo;
    }catch(e){
        logger.error(' parseNewAccessToken :'+ e.message);
        return null;
    }
}

const parseUserToke=(req)=>{
    let cookiesToken = req.headers[headerTokenMeta];
    if(cookiesToken == undefined){
        return null;
    }
    let tokenInfo = parseAccessToken(cookiesToken);
    if(tokenInfo == undefined){
        return null;
    }
    if(tokenInfo.clientType == undefined || tokenInfo.clientType != clientType.user){
        return null;
    }else if((tokenInfo.grantDate == undefined) || ((tokenInfo.grantDate + expiredTime)<(new Date().getTime()))){
        return null;
    }
    let resultObj = {};
    resultObj ={userId:tokenInfo.userId,userType:clientType.user,status:tokenInfo.status};
    return resultObj;
}

const parseAdminToken=(req)=>{
    let cookiesToken = req.headers[headerTokenMeta];
    if(cookiesToken == undefined){
        return null;
    }
    let tokenInfo = parseAccessToken(cookiesToken);
    if(tokenInfo == undefined){
        return null;
    }
    if(tokenInfo.clientType == undefined || tokenInfo.clientType != clientType.admin){
        return null;
    }else if((tokenInfo.grantDate == undefined) || ((tokenInfo.grantDate + expiredTime)<(new Date().getTime()))){
        return null;
    }
    let resultObj = {};
    resultObj ={userId:tokenInfo.userId,userType:clientType.admin,status:tokenInfo.status};
    return resultObj;
}

const getCookie=(cookie ,name)=>
{
    let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=cookie.match(reg))
        return (unescape(arr[2]));
    else
        return null;
}

const saveUserPhoneCode=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},params,(error,result)=>{
        callback(error,result)
    })
}

const getUserPhoneCode=(params,callback)=>{
    httpUtil.httpGet(systemConfig.hosts.auth,'/api/'+params.phone+"/signCode",{},{},(error,result)=>{
        callback(error,result)
    })
}

const sendCaptcha=(params,callback)=>{
    httpUtil.httpPost(systemConfig.hosts.mq,'/api/captcha',{},params,(error,result)=>{
        callback(error,result)
    })
}

const saveToken = (params,callback) =>{
    httpUtil.httpPost(systemConfig.hosts.auth,'/api/token',{},params,(error,result)=>{
        callback(error,result)
    })
}


const removeToken = (params,callback)=>{
    httpUtil.httpDelete(systemConfig.hosts.auth,'/api/token/'+params.accessToken,{},params,(error,result)=>{
        callback(error,result)
    })
}

const getToken = (params,callback) =>{
    httpUtil.httpGet(systemConfig.hosts.auth,'/api/token/'+params.accessToken,{},{},(error,result)=>{
        callback(error,result)
    })
}

module.exports = {
    createAccessToken,
    parseAccessToken,
    clientType,
    parseAdminToken,
    saveUserPhoneCode,
    sendCaptcha,
    getUserPhoneCode,
    saveToken,
    removeToken,
    getToken
};
