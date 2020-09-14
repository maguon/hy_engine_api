const pgDb = require('../db/connections/PgConnection');

class UserDAO  {
    static async queryUser(params) {
        let query = "select * from type_test where id is not null ";
        let filterObj = {};
        if(params.id){
            query += " and id = ${id} ";
            filterObj.id = params.id;
        }
        if(params.start){
            query += " offset ${start} ";
            filterObj.start = params.start;
        }
        if(params.size){
            query += " limit ${size} ";
            filterObj.size = params.size;
        }
        return await pgDb.any(query,filterObj);
    }
    static async queryUserCount(params) {
        let query = "select count(id) from type_test where id is not null ";
        let filterObj = {};
        return await pgDb.one(query,filterObj);
    }
    static async addUser(params) {
        const query = 'INSERT INTO type_test (m_point) VALUES (${point}::point) RETURNING id ';
        let valueObj = {};
        valueObj.point = params.point;
        return await pgDb.one(query,valueObj);
    }

    static async updateUser(params){
        const query = 'update type_test set m_point= ${point}::point ,created_on=${createdOn} where id =${id} and created_on>${createdOn} RETURNING * ';
        let valueObj = {};
        valueObj.point = "(34.21,120.33)";
        valueObj.createdOn = new Date();
        valueObj.id =params.userId ;
        return await pgDb.one(query,valueObj);
    }
}


module.exports = UserDAO;