# Jest-style diffs on Chai equalities

Chai’s assertions have a built-in `showDiff` flag, but do not produce the diff themselves; it’s up to the test runner to produce such output.

The very popular [Mocha](http://mochajs.org/) does that, but Jest doesn’t: its neat diffs are produced internally by its built-in matchers; it doesn’t rely on any sort of metadata to produce diff for third-party assertions.

When you start using Jest, if you still prefer Chai for your assertions, you quickly miss Jest’s neat JSON diffs, especially if you used to run tests with Mocha, which produced similar diffs on its own.

This Chai plugin tries to fix that, piggybacking on Jest’s `jest-diff` and `jest-matcher-utils` for maximum compatibility with Jest’s built-in expectation output.

It focuses on deep equality testing (through any variation of `.deep.equal` or `.eql`), where such diffs are most relevant.  Because Jest uses diffs even for its `===`-based `.toBe` expectation, it also provides it for shallow `equal` testing, just for consistency’s sake.

On the other hand, it currently doesn’t provide it for `.property` value testing, unlike Jest’s `.toHaveProperty` expectation.  This seemed to require too much duplication of code between Chai’s internal assertions and this plugin, as there are many edge cases.  We’ll see.

# Usage

```js
const chai = require('chai')
const chaiJestDiff = require('chai-jest-diff')

chai.use(chaiJestDiff())
```

# Options

The plugin factory accepts a boolean argument, `expand`, that mirrors Jest’s `expand` configuration setting, for full-length diffs (instead of close-context diffs).  I couldn’t figure out a way to get this information dynamically from Jest’s exposed API, so you’d have to pass that in manually if you need it.

# License

© 2017 Delicious Insights

This plugin is provided under the MIT license.  See [`LICENSE.md`](https://github.com/deliciousinsights/chai-jest-diff/blob/master/LICENSE.md) for details.
