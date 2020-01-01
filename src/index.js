const Koa = require('koa')

const app = new Koa()

app.use(async(ctx, next) => { //async적용
    console.log(ctx.url);
    console.log(1);
    if (ctx.query.authorized !== '1') { ///?authorized=1로 접근할 떄만 hello world출력
        ctx.status = 401; //Koa 에서는 401은 페이지에 Unauthorized를 출력함
        return;
    }
    await next() //await 적용 ?authorized=1로 접근 성공 이후 콘솔로그에 END출력.
    console.log('END')
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