
const moment = require('moment/moment.js');
const userDAO = require('../models/UserDAO')
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('User.js');

const queryUser = (req,res,next)=>{
    let query = req.query;

    userDAO.queryUser(query).then((rows)=>{
        return rows;
    }).then(rows=>{
        userDAO.queryUserCount(query).then(count=>{
            res.send(200,{success : true,rows,count});
            return next();
        }).catch(e=>{
            res.send(500,{err:e.message});
            logger.error("error",e.stack);
        })
    }).catch(e=>{
        res.send(500,{err:e.message});
        logger.error("error",e.stack);
    })


}

const addUser = (req,res,next)=>{
    let params = req.body;
    userDAO.addUser(params).then((rows)=>{
        console.log(rows);
        res.send(200,{success : true,rows});
        return next();
    }).catch((e)=>{
        res.send(500,{err:e.message});
        logger.error("error",e.stack);
    });
}

const updateUser = (req,res,next)=>{
    let params = req.body;
    params = {...req.params};
    userDAO.updateUser(params).then((rows)=>{
        console.log(rows);
        res.send(200,{success : true,rows});
        return next();
    }).catch((e)=>{
        res.send(500,{err:e.message});
        logger.error("error",e.stack);
    });
}

const updateUsers = (req,res,next)=>{
    let params = req.body;
    params = {...req.params};
    userDAO.queryUser(params).then((rows)=>{
        return rows;

    }).then(rows=>{
        (async()=>{
            let updatedRows=[]
            for(let i=0;i<rows.length;i++){
                if(rows[i].id>11){
                    const affectedRows = await  userDAO.updateUser({userId:rows[i].id});
                    updatedRows.push(affectedRows);

                }
            }
            res.send(200,{success : true,updatedRows});
            return next();
        })()
    }).catch((e)=>{
        res.send(500,{err:e.message});
        logger.error("error",e.stack);
    });

}

module.exports = {
    queryUser,addUser,updateUser,updateUsers
}