import Router from 'koa-router'
import * as postsCtrl from './posts.ctrl'

const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', postsCtrl.write);
posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);
posts.delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove);
posts.patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);
//checkObjectId 메소드의 도입으로 500에러(서버내부오류에러)
//가 404에러 (Bad Request)에러로 나타나게 됨.

export default posts;
