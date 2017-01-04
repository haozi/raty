import Path from 'path'
import fs from 'fs'
import {runBash, promisify} from './util'

export default class Base {
  build (watch = '') {
    let baseDir = this.config.path.baseDir
    let src = Path.resolve(baseDir, this.config.path.src)
    let dist = Path.resolve(baseDir, this.config.path.dist)

    let babel = Path.resolve(baseDir, 'node_modules/.bin/babel')
    let es2015 = Path.resolve(baseDir, 'node_modules/babel-preset-es2015')
    let stage3 = Path.resolve(baseDir, 'node_modules/babel-preset-stage-3')
    let transformRuntime = Path.resolve(baseDir, 'node_modules/babel-plugin-transform-runtime')
    runBash(`
      rm -rf ${dist} && cp -r ${src} ${dist} &&
      ${babel} --presets ${es2015},${stage3} --plugins ${transformRuntime} ${src} --out-dir ${dist} --source-maps inline ${watch}
    `)
  }

  ls(path, deep = false) {
    console.log(path);
    path = Path.resolve(path)
    console.log(path);
    return promisify(fs.readdir, fs)(path).then(d => d.map(p => {
      return Path.resolve(this.baseDir, p)
    }))
  }

  require(path) {
    const obj = require(path)
    return obj && obj.__esModule ? obj.default : obj
  }
}
