const Router = require('koa-router');
const api = new Router();

api.get('/test', ctx => {
    ctx.body = 'test성공'
})

module.exports = api;