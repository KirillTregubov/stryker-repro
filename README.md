# Stryker repro

## Reproduce

Run the Mocha test suite from `sample-repo`:

```sh
cd sample-repo
npm install
npm test
```

The test succeeds:

```text
1 passing (4ms)
```

Then run the programmatic Stryker tool:

```sh
# cd ..
cd tool
npm install
npm run start
```

Stryker crashes during the initial test run with:

```text
TypeError: Cannot read properties of undefined (reading 'beforeEach')
```

## Proposed fix

The relevant implementation is [`lib-wrapper.ts`](https://github.com/stryker-mutator/stryker-js/blob/master/packages/mocha-runner/src/lib-wrapper.ts). The Mocha runtime should be resolved from the target project's current working directory, rather than from the host tool's module location.

My patch removes the runtime `import Mocha from 'mocha'` while keeping the type import, then resolves the runtime Mocha instance from the target project:

```ts
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cwdRequire = createRequire(path.join(process.cwd(), "package.json"));
const mochaRoot = path.dirname(cwdRequire.resolve("mocha/package.json"));
const Mocha = cwdRequire("mocha");
```

The important behavior is: **resolve Mocha from the target project, not the host tool's location**.

Ideally, the target project directory should be passed as an explicit option so callers can configure it instead of relying on `process.cwd()`.

## Local validation

After patching the installed `@stryker-mutator/mocha-runner/dist/src/lib-wrapper.js` locally, `npm run start` completed successfully. Stryker ran the initial Mocha test and completed mutation testing with 3 mutants found, 2 killed, and 1 survived.
