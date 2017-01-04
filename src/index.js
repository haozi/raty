import Koa from 'koa'
// import path from 'path'
import Base from './Base'
import {getConfig, colors, logger} from './util'

export default class App extends Base{
  constructor () {
    super()
    this.app = new Koa()
    this.config = getConfig()
    this.baseDir = this.config.path.baseDir
    logger.info('raty info', JSON.stringify(this.config, null, 2))
  }

  async _serialLocalMiddlewares() {
    let middlewares = ['router', 'hello']
    middlewares.forEach(m => {
      m = this.require(`${__dirname}/middlewares/${m}.js`)
      let middleware = m(this)
      middleware && this.app.use(middleware)
    })
  }

  async start () {
    if (this.config.env === 'development') {
      this.build('--watch')
    }

    this._serialLocalMiddlewares()

    // this.app.use()
    this.app.listen(this.config.port)
    console.log(`start success, please open ${colors.green(`http://${this.config.server}:${this.config.port}`)}`)
  }
}
