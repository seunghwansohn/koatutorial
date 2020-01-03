import Post from '../../models/post'

export const write = async ctx => {
  // console.log(ctx.request.body)
  const {title, body, tags} = ctx.request.body;
  // console.log(title)
  const post = new Post({
    title,
    body,
    tags
  });
  // console.log(post)
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e)
  }
}

export const list = async ctx => {
  try {
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e)
  }
}

export const read = ctx => {}

export const remove = ctx => {}

export const update = ctx => {}


