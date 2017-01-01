import Koa from 'koa'
import path from 'path'
import {getConfig, colors, runBash, logger} from './util'

export default class App {
  constructor () {
    this.app = new Koa()
    this.config = getConfig()
    logger.info('raty info', JSON.stringify(this.config, null, 2))
  }

  build (watch = '') {
    let baseDir = this.config.path.baseDir
    let src = path.resolve(baseDir, this.config.path.src)
    let dist = path.resolve(baseDir, this.config.path.dist)

    let babel = path.resolve(__dirname, '../node_modules/.bin/babel')
    let es2015 = path.resolve(__dirname, '../node_modules/babel-preset-es2015')
    let stage3 = path.resolve(__dirname, '../node_modules/babel-preset-stage-3')
    let transformRuntime = path.resolve(__dirname, '../node_modules/babel-plugin-transform-runtime')
    runBash(`
      rm -rf ${dist} && cp -r ${src} ${dist} &&
      ${babel} --presets ${es2015},${stage3} --plugins ${transformRuntime} ${src} --out-dir ${dist} --source-maps inline ${watch}
    `)
  }

  async start () {
    if (this.config.env === 'development') {
      this.build('--watch')
    }

    this.app.use(async ctx => {
      ctx.body = 'Hello world'
    })
    this.app.listen(this.config.port)
    console.log(`start success, please open ${colors.green(`http://${this.config.server}:${this.config.port}`)}`)
  }
}
