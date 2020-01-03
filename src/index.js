require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

const {PORT, MONGO_URI} = process.env;

import api from './api';

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(e => {
        console.error(e);
    });

const app = new Koa()
const router = new Router();

//라우터 설정
router.use('/api', api.routes()) //api 라우트 적용

//라우터 적용 전에 bodyParser 적용
app.use(bodyParser())

//app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods())

const port = PORT||4000; //PORT가 규정되 있으면 규정된 PORT로 없으면 4000으로.
app.listen(4000,() => {
    console.log('Listening to %d', port)
})

//http://192.168.100.4:4000/api/posts
//=> {"method":"GET","path":"/api/posts","params":{}}
