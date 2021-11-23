// import { terser } from 'rollup-plugin-terser';
import styles from 'rollup-plugin-styles';
// import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import resolveNode from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.min.js',
    format: 'iife',
    name: 'capi',
  },
  plugins: [
    json(),
    styles(),
    resolveNode({}),
    commonjs({}),
    // resolve(),
    // terser(),
  ],
};
