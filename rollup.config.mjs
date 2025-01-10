import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: 'src/index.ts',
    plugins: [
      esbuild({
        define: {
          PLATFORM_NODE: 'false',
          PLATFORM_NODE_JEST: 'false',
        },
      }),
    ],
    output: [
      {
        file: 'dist/default/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/default/esm/index.mjs',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [
      esbuild({
        define: {
          PLATFORM_NODE: 'true',
          PLATFORM_NODE_JEST: 'false',
        },
      }),
    ],
    output: [
      {
        file: 'dist/node/cjs/index.cjs',
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: 'dist/node/esm/index.mjs',
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      file: 'dist/types/index.d.ts',
      format: 'es',
    },
  },
];
