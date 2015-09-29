var ctx = require.context('.', true, /.+\.test\.jsx?$/);
require.context('.', true, /.+\.test\.jsx?$/).keys().forEach(ctx);
module.exports = ctx;