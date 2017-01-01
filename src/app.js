import Koa from 'koa'
let app = new Koa()

app.use(async ctx => {
  ctx.body = 'Hello ' + await getData()
})

app.listen(2017)

async function getData () {
  return new Promise(resolve => {
    setTimeout(() => {
      let data = 'world'
      console.info(data)
      resolve(data)
    }, 1000)
  })
}
