const serverLogger = require('../../util/ServerLogger.js');
const logger = serverLogger.createLogger('PgConnections.js');
const systemConfig = require('../../config/SystemConfig')
let initOptions  = {};
if(systemConfig.pgConfig.initOptions.native){
    initOptions = {query(e) {
        logger.debug(e.query);
    }}
}
const pgp = require('pg-promise')(initOptions);

const cn = systemConfig.pgConfig.connectOptions;

const pgDb = pgp(cn);

module.exports = pgDb;