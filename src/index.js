const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
    console.log(ctx.url);
    console.log(1);
    if (ctx.query.authorized !== '1') { ///?authorized=1로 접근할 떄만 hello world출력
        ctx.status = 401; //Koa 에서는 401은 페이지에 Unauthorized를 출력함
        return;
    }
    next();
})

app.use((ctx, next) => {
    console.log(2);
    next();
});

app.use(ctx => {
    ctx.body = 'hello world';
})

app.listen(4000,() => {
    console.log('Listening to port 4000')
})