import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'
import strip from '@rollup/plugin-strip'
import svgr from '@svgr/rollup'

import pkg from './package.json'

const production = process.env.NODE_ENV === 'production'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    postcss({
      modules: true,
    }),
    url({ exclude: ['**/*.svg'] }),
    svgr(),
    resolve(),
    typescript(),
    production && strip({ include: '**/*.ts' }),
    commonjs(),
  ].filter(x => x),
}
