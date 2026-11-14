// Self-contained patch to ensure Rollup gracefully falls back to @rollup/wasm-node
// on Windows systems with WDAC application control policies.
import fs from 'fs';
import path from 'path';

const nativeJsPath = path.resolve('node_modules', 'rollup', 'dist', 'native.js');

if (fs.existsSync(nativeJsPath)) {
  let content = fs.readFileSync(nativeJsPath, 'utf8');
  if (!content.includes("@rollup/wasm-node/dist/native.js")) {
    const target = `const nativeModule = requireWithFriendlyError(
\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
);`;
    const replacement = `let nativeModule;
try {
\tnativeModule = requireWithFriendlyError(
\t\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
\t);
} catch (e) {
\ttry {
\t\tnativeModule = require('@rollup/wasm-node/dist/native.js');
\t} catch (wasmError) {
\t\tthrow e;
\t}
}`;
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(nativeJsPath, content, 'utf8');
      console.log('Successfully patched rollup for WASM fallback.');
    } else if (content.includes("require('@rollup/wasm-node');")) {
      content = content.replace("require('@rollup/wasm-node');", "require('@rollup/wasm-node/dist/native.js');");
      fs.writeFileSync(nativeJsPath, content, 'utf8');
      console.log('Updated rollup WASM fallback path.');
    }
  }
}
