import path from 'path'
import childProcess from 'child_process'
import merge from 'lodash.merge'
import colors from 'colors/safe'

import defaultConfig from './config'
import resetConfig from './config.rest'

let cache
export function getConfig () {
  let config, userConfigPath
  if (!cache) {
    const pwd = process.cwd()
    let userConfig
    [userConfigPath = defaultConfig.base.path.config] = process.argv.slice(3)
    userConfigPath = path.resolve(pwd, userConfigPath)
    try {
      userConfig = require(userConfigPath)
    } catch (e) {
      logger.error('raty error', e)
      userConfig = {}
    }

    cache = merge({}, defaultConfig, userConfig, resetConfig)
  }

  config = merge({}, cache.base, cache[process.env.NODE_ENV])

  if (!config.path.baseDir) {
    config.path.baseDir = path.dirname(userConfigPath, '.')
  }
  config.env = process.env.NODE_ENV || config.env
  return config
}

export function runBash (bash, options, callback) {
  return new Promise((resolve, reject) => {
    const p = childProcess.exec(bash, options, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
    p.stderr.pipe(process.stderr)
    p.stdout.pipe(process.stdout)
  })
}

export function sleep (delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

let logger = {}
Object.keys(console).forEach(key => {
  logger[key] = console[key]
  if (typeof window === 'undefined') {
    switch (key) {
      case 'log':
        logger[key] = function (type, ...msgs) {
          return console.log.apply(console, [colors.bgBlue(type)].concat(msgs.map(s => colors.grey(s))))
        }
        break
      case 'info':
        logger[key] = function (type, ...msgs) {
          return console.log.apply(console, [`[${type}]`].concat(msgs.map(s => colors.cyan(s))))
        }
        break
      case 'error':
        logger[key] = function (...msgs) {
          return console.log.apply(console, msgs.map(s => colors.red(s)))
        }
        break
      case 'warn':
        logger[key] = function (...msgs) {
          return console.log.apply(console, msgs.map(s => colors.yellow(s)))
        }
        break
      default:

    }
  }
})

export {colors, logger}
