import commander from 'commander'
import pkg from '../package.json'
import App from './index'
import {logger, runBash, getConfig} from './util'

process.on('SIGINT', () => {
  process.exit(100)
})

commander
  .version(pkg.version)
  .option(' start', 'run server')
  .option(' dev', 'run dev')
  .option(' build', 'run build')
  .option(' test')
  .parse(process.argv)

if (commander.dev) {
  let config = getConfig()
  runBash(`
    NODE_ENV=development devtool ${config.path.baseDir}/${config.path.entry}
  `).catch(e => {
    logger.error('devtool is not installed')
    logger.error('please run `sudo npm install devtool -g`')
  })
}

if (commander.build) {
  new App().build()
}

if (commander.start) {
  let config = getConfig()
  runBash(`
    NODE_ENV=production node ${config.path.baseDir}/${config.path.entry}
  `)
}

if( commander.test) {
  (new App())['_serialLocalMiddlewares'](__dirname)
}
