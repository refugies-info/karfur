# Changelog

## [2.3.0](https://github.com/refugies-info/karfur/compare/mongo-v2.2.1...mongo-v2.3.0) (2026-03-23)


### Features

* flatten Dispositif schema maps and add robust translation handling to `getContentById` workflow. ([c5fb597](https://github.com/refugies-info/karfur/commit/c5fb59797cacab4e290b88e5594049424e15d06d))
* introduce `I18nCodeZodSchema` and apply it to `Dispositif` translations and `Langue` i18nCode fields. ([e77dfcf](https://github.com/refugies-info/karfur/commit/e77dfcfe00c688f8c21501eaca66de539e345e76))
* migrate Traductions model to mono-repo structure ([a548294](https://github.com/refugies-info/karfur/commit/a548294751e729924e3d12004ba35de506bd6f2b))
* **migration:** migrate AdminOptions, Error, and CloudinaryImage models ([41ad116](https://github.com/refugies-info/karfur/commit/41ad116f642aaf8f041c45daed45b4691be0eac4))
* **migration:** migrate Indicator, MailEvent, and Notification models ([1484ce7](https://github.com/refugies-info/karfur/commit/1484ce75f104085f7577df83dfbb6cfce1be68c2))
* **migration:** migrate Log, Snapshot, and Widget models ([8aa5622](https://github.com/refugies-info/karfur/commit/8aa56229213d2263973a32e5c62281af3d3df1c8))
* **migration:** migrate Need model to @refugies-info/mongo ([0bded05](https://github.com/refugies-info/karfur/commit/0bded0522bf9f69483d41617955f6b9699465c93))
* **migration:** migrate Structure model to @refugies-info/mongo ([7699218](https://github.com/refugies-info/karfur/commit/7699218ac4142ba7e4aa4f74ba43f2293e6943c7))
* **migration:** migrate Structure to @refugies-info/mongo ([c30f6e0](https://github.com/refugies-info/karfur/commit/c30f6e073f90de19babf78dff5734ca24981d2ab))
* **mongo,server,client:** add speedgoose write-through MongoDB cache ([5b0e0e2](https://github.com/refugies-info/karfur/commit/5b0e0e239a521520c722446a85d123f53e9700cd))
* **mongo:** init package and migrate Langue model ([463359a](https://github.com/refugies-info/karfur/commit/463359a841cbafda585a56e9aec9b1e71ea767c6))
* **mongo:** migrate Theme model ([c678f89](https://github.com/refugies-info/karfur/commit/c678f89f19e4612e46b60d1fc8e1415688aa3fd4))


### Bug Fixes

* **mongo:** add HMR-safe model exports to prevent OverwriteModelError ([d59b393](https://github.com/refugies-info/karfur/commit/d59b3933c2ce783b2676cda1e595b31dcf7be8f3))
* **mongo:** fix type annotation in Dispositif model export ([515c5ff](https://github.com/refugies-info/karfur/commit/515c5fffc679374f2fc7fd8c817e6702189a867d))
* **mongo:** restore theme translated labels in runtime responses ([5e7d86a](https://github.com/refugies-info/karfur/commit/5e7d86a98d8efce705cd79eeff1bee75d19800a9))
* **server:** resolve dual-mongoose instance causing test failures ([00253fc](https://github.com/refugies-info/karfur/commit/00253fc6b9014755ef9aeb7cc4aba86f71b691d6))
* **server:** resolve Zod/Mongoose validation issues via type patching ([d80356b](https://github.com/refugies-info/karfur/commit/d80356b26a74e756a7e82198ea473346bea86fea))
