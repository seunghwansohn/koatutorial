import Post from '../../models/post'
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  return next();
};

export const write = async ctx => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required() 가 있으면 필수 항목
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required(), // 문자열로 이루어진 배열
  });

  // 검증 후, 검증 실패시 에러처리
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  const {title, body, tags} = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags
  });
  try {
    await post.save();
    //save는 mongoose의 메소드로서 데이터베이스에 내용을 저장하는 메소드
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e)
  }
}

export const list = async ctx => {
  const page = parseInt(ctx.query.page || '1', 10) //주소에서 인자를 쿼리스트링으로 받음
  if (page<1) {
    ctx.staus = 400;
    return;
  }
  try {
    const posts = await Post
    .find() //find는 mongoose의 메소드로서 특별히 실행을 위해서는 exec()도 붙여야됨
    .sort({ _id: -1}) //id를 기준으로 역순으로 정렬
    .limit(10) //조회수를 10개로 제한하고 id역순으로 정렬
    .skip((page -1)*10) //쿼리스트링으로 받은 페이지에 맞춰서 10개씩 보여줌. 10개넘어가면 자름.
    .exec();
    
    const postCount = await Post.countDocuments().exec();  //전체 포스트 숫자를 변수로 반환
    ctx.set('Last-Page', Math.ceil(postCount/10)) //10개씩 페이지를 나눴을 때 페이지수를 response 헤더에 Last-Page라는 키로 값을 줌.

    ctx.body = posts
      .map(post => post.toJSON())
      .map(post => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0,200)}...`,
      })) //모든 포스트들의 body 안의 내용이 200글자 넘어가면 그 이상 부분은 잘라서 ...으로 반환
  } catch (e) {
    ctx.throw(500, e)
  }
}

export const read = async ctx => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    //주소에서 인자로 전달받은 id에 해당되는 값만 찾는 mongoose의 메소드
    //주소에서 전달하는 인자는 1,2 식이 아니라 몽고디비에 저장된 아이디
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No Content (성공은 했지만 응답할 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
}

export const update = async ctx => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증 후, 검증 실패시 에러처리
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false 일 때에는 업데이트 되기 전의 데이터를 반환합니다.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
}


