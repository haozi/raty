import Router from 'koa-router'
const router = Router()

export default function (instance) {
  router.get('/aaa', function (ctx, next) {
    console.log(11111111, ctx)
  })

  instance.app
    .use(router.routes())
    .use(router.allowedMethods())
}
