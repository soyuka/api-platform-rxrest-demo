import ts from 'rollup-plugin-typescript'
import nodeResolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

const plugins = [
  ts(),
  babel({exclude: 'node_modules/**'})
];

const prod = process.env.NODE_ENV === 'production' || ~process.argv.indexOf('--prod')
const full = prod || ~process.argv.indexOf('--full')

if (prod) {
  plugins.push(uglify())
}

plugins.push(
  nodeResolve({
    main: true,
    jsnext: false,
    browser: true,
    module: false
  }),
  cjs({
    include: 'node_modules/**'
  })
)

export default {
  entry: 'src/index.ts',
  format: 'umd',
  plugins: plugins,
  dest: `build/app.bundle${prod ? '.min' : ''}.js`,
  sourceMap: true
}
