import babel from 'rollup-plugin-babel';
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  entry: 'src/index.js',
  external: [
    'react',
    'react-dom',
    'fbjs/lib/warning',
    'fbjs/lib/crc32',
    'fbjs/lib/ExecutionEnvironment',
    'fbemitter'
    ],
  exports: 'named',
  globals: { react: 'React' },
  useStrict: false,
  sourceMap: true,
  plugins: [babel({
    exclude: 'node_modules/**'
  })],
  targets: [
    {dest: pkg.main, format: 'cjs'},
    {dest: pkg.module, format: 'es'},
    {dest: pkg['umd:main'], format: 'umd', moduleName: pkg.name}
  ]
}
