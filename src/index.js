const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router();

//라우터 설정
router.get('/', ctx => {
    ctx.body = '홈';
})

router.get('/about/:name?', ctx => {
    const {name} =ctx.params;
    ctx.body = name ? `${name}의 소개` : '소개';
})

router.get('/posts', ctx => {
    const {id} =ctx.query;
    ctx.body = id ? `포스트 #${id}` : '포스트 아이다가 없습니다';
})


//app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods())

app.listen(4000,() => {
    console.log('Listening to port 4000')
})

// http://192.168.0.4:4000/about/react
// http://192.168.0.4:4000/posts
// http://192.168.0.4:4000/posts?id=10

