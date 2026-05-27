# Changelog

## [2.8.0](https://github.com/refugies-info/karfur/compare/karfur-v2.7.1...karfur-v2.8.0) (2026-05-27)


### Features

* add GitLeaks pre-commit hook for secret scanning ([6a53e86](https://github.com/refugies-info/karfur/commit/6a53e8619be8fd2f92cb2033fdbecb4083ba00f9))
* add GitLeaks pre-commit hook for secret scanning ([e32393b](https://github.com/refugies-info/karfur/commit/e32393b9f2ca1d960d9ef663f60a5a8a84b552fa))
* add migration to remove null participants and apply code format… ([bf8fa70](https://github.com/refugies-info/karfur/commit/bf8fa704955d012f2681d8dc12a21c3243864472))
* add migration to remove null participants and apply code formatting to dispositif repository ([0146d03](https://github.com/refugies-info/karfur/commit/0146d0380df24e474492d4f891ca99899868779b))


### Bug Fixes

* add French locale to number formatting and prevent crash on null user languages ([e320dd3](https://github.com/refugies-info/karfur/commit/e320dd38260bceebecb99c0a78b67a0ef5810795))
* add French locale to number formatting and prevent crash on null… ([d52d9fe](https://github.com/refugies-info/karfur/commit/d52d9fe4d76f4c30a64d445bf97fd91905bba311))
* add lodash to pnpm.overrides for security ([df9deef](https://github.com/refugies-info/karfur/commit/df9deef9f79238623a5a8f884f86e6541524eb30))
* add lodash to pnpm.overrides for security ([66ea473](https://github.com/refugies-info/karfur/commit/66ea473762d33068e46913f7077a178a441074ec))
* add optional chaining to date timestamps and safely handle toRev… ([a98b2cd](https://github.com/refugies-info/karfur/commit/a98b2cdc5be79cbbe803b2fa760b1d0acf33f261))
* add optional chaining to date timestamps and safely handle toReviewCache in translation export ([aa85fbf](https://github.com/refugies-info/karfur/commit/aa85fbf68bc66b31b874c11afe612cf29a78eafa))
* add set -e and remove invalid --staged flag ([2fe6c93](https://github.com/refugies-info/karfur/commit/2fe6c939caf0ab6aff7b392930bd380d95737c07))
* **client:** correct mission page typo ([aef25d4](https://github.com/refugies-info/karfur/commit/aef25d43fe30603e95bccf3e32e5aa094826245d))
* **client:** correct mission page typo ([68100b8](https://github.com/refugies-info/karfur/commit/68100b87da5fd288f76827eb1c59b679278520b0))
* **client:** include administrationName in translation reconstruction for démarches ([82121e5](https://github.com/refugies-info/karfur/commit/82121e58a0df3174b67d92f0041fc74b4a7cbc3a))
* **client:** include administrationName in translation reconstruction for démarches ([0c4f7c8](https://github.com/refugies-info/karfur/commit/0c4f7c8e2a7bb10d8aeadaeb0cdb8c472fee842e))
* correct lodash version reference in pnpm-workspace.yaml comment ([9874b75](https://github.com/refugies-info/karfur/commit/9874b7562342414aeca25183c5b6a64a0a89e34c))
* **migration:** use per-collection counter for log messages ([a5ac041](https://github.com/refugies-info/karfur/commit/a5ac041669c1af38346f28377b22ca0b4562e0f2))
* prevent crashes in deleteLineBreaks by handling undefined inputs and add corresponding unit tests ([6eae2a7](https://github.com/refugies-info/karfur/commit/6eae2a71746bd1987ec1de2f737c7ea8300eaabd))
* prevent crashes in deleteLineBreaks by handling undefined inputs… ([d98b033](https://github.com/refugies-info/karfur/commit/d98b033b8b7076ff87da560334e02945334a401b))
* prevent Tailwind v4 conflict by excluding --content variable fro… ([123238a](https://github.com/refugies-info/karfur/commit/123238a259db305d54bc75539673783ab0f8f080))
* prevent Tailwind v4 conflict by excluding --content variable from generated tokens and updating MetaDataItem style ([861df12](https://github.com/refugies-info/karfur/commit/861df125a15596b2948bfeb7dca371b5ef7ca677))
* remove picomatch overrides to preserve peer dependency declarations ([ea452a6](https://github.com/refugies-info/karfur/commit/ea452a663009cf57d7bf1f3de7a5ffd75ff14f85))
* resolve 10 Dependabot security vulnerabilities ([781f8a6](https://github.com/refugies-info/karfur/commit/781f8a643daccc63195e4c94eb9246a2cde27589))
* resolve 4 Dependabot security vulnerabilities ([bc33ba0](https://github.com/refugies-info/karfur/commit/bc33ba0bc280ffadfe5105c64259a9dc5339bc58))
* resolve 4 Dependabot security vulnerabilities ([49e779a](https://github.com/refugies-info/karfur/commit/49e779a231c686affc65f0f0cb1210fd0569d4c6))
* **security:** resolve 10 Dependabot security vulnerabilities ([3b793d0](https://github.com/refugies-info/karfur/commit/3b793d041e4f9b004ed63bc2ff6f6a443f326766))
* **server:** add MongoDB Performance Advisor indexes for logs, indicators, dispositifs ([9e316ae](https://github.com/refugies-info/karfur/commit/9e316ae5d6bd013dc0fafe05deb59e739d44cb1f))
* **server:** add MongoDB Performance Advisor indexes for logs, indicators, dispositifs ([5b08d1f](https://github.com/refugies-info/karfur/commit/5b08d1f47f27d1a809d0e7bb5ed0d2b6afaea8eb))
* **server:** cache translation statistics counter and add error handling ([f2d64eb](https://github.com/refugies-info/karfur/commit/f2d64eb191869336a9767b3c0c2aa7251a673345))
* **server:** cache translation statistics counter and add error handling ([8744461](https://github.com/refugies-info/karfur/commit/87444613b4354fd520dfd3a2ccf41788ceac66ab))
* **server:** centralize Mongoose Map handling to fix autosave 500 error ([e700c12](https://github.com/refugies-info/karfur/commit/e700c1207e0229761318c23c3a76b90844766e79))
* **server:** centralize Mongoose Map handling to fix autosave 500 error ([3cebfce](https://github.com/refugies-info/karfur/commit/3cebfce54f7042e3ca6e309b72fe1a0bf956cda7))
* **server:** clean invalid suggestions from dispositifs_draft collection ([bacbdd6](https://github.com/refugies-info/karfur/commit/bacbdd6dbc05f916fabc45848760360d5f06a89a))
* **server:** clean invalid suggestions from dispositifs_draft collection ([b7ffdf5](https://github.com/refugies-info/karfur/commit/b7ffdf5768eb16a30cf68c2ce96ad328092b5eb4))
* **server:** handle NamespaceNotFound (code 26) in rollback migration ([ef2b963](https://github.com/refugies-info/karfur/commit/ef2b9639f7e18bb0f63902c435aa430cfd46f7e9))
* **server:** harden null participants autosave safeguards ([776b494](https://github.com/refugies-info/karfur/commit/776b494325d372fa0acc80816ca722f42490d2fe))
* **server:** improve Mongoose Map detection and prevent in-place mutations ([d8a1cfd](https://github.com/refugies-info/karfur/commit/d8a1cfd958f8e625d03fa905f75c233f3dd1f651))
* **server:** prevent validation errors from invalid suggestions ([bf29442](https://github.com/refugies-info/karfur/commit/bf29442f0d7bf7ef8caa05f459a40e436f810ebe))
* **server:** prevent validation errors from invalid suggestions ([77d9dad](https://github.com/refugies-info/karfur/commit/77d9dad63038c387f47d5ac312c2da46b66fe869))
* **server:** reduce May 22 production 500 regressions ([d676286](https://github.com/refugies-info/karfur/commit/d67628618ad80dc83dcba28c0c759bf807070c37))
* **server:** reduce May 22 production 500 regressions ([85e288d](https://github.com/refugies-info/karfur/commit/85e288d286502cfd22468debd6cbfb5db7367449))
* **server:** restore typing for centralized map helpers ([814dab0](https://github.com/refugies-info/karfur/commit/814dab060f753c6fe6808940955099346a3a7918))
* **server:** use typed status extraction for errors ([b3ee573](https://github.com/refugies-info/karfur/commit/b3ee5731adc65cf006ed64e8acbd20d228267c35))
* update accessibility compliance status to partially compliant in DSFR footer ([f9cae9a](https://github.com/refugies-info/karfur/commit/f9cae9a435237f379d64efc71d68d19021b55ac0))
* update AFND contact email in Marne department ([b2fc49d](https://github.com/refugies-info/karfur/commit/b2fc49db1e2e3f6305f812ed9dc8056f7741e848))
* update AFND contact email in Marne department ([69ed15c](https://github.com/refugies-info/karfur/commit/69ed15cb107814d34a980b9a37853b3d85332a5e))
* update deleteLineBreaks to return an empty string instead of undefined when input is missing ([90dad2a](https://github.com/refugies-info/karfur/commit/90dad2a7671f7d77611cad57f7d6e47660ed9c3e))
* **workspace:** patch critical security vulnerabilities in next, axios, vite ([d5da4f7](https://github.com/refugies-info/karfur/commit/d5da4f70ee9d6f106b1a3dcfbda4c29302626595))
* **workspace:** patch critical security vulnerabilities in next, axios, vite ([735a04b](https://github.com/refugies-info/karfur/commit/735a04b840e62a091d0463cd5ade0fc9d02f2ff1))


### Performance Improvements

* **server:** optimize nbActiveTranslators from O(L×U×S) to O(U×S+L) ([37cce7d](https://github.com/refugies-info/karfur/commit/37cce7d90d49af09920a84fec7109629918b7734))

## [2.7.1](https://github.com/refugies-info/karfur/compare/karfur-v2.7.0...karfur-v2.7.1) (2026-03-31)


### Bug Fixes

* **migrations:** use codeName instead of magic number for IndexNotFound ([f6cffe0](https://github.com/refugies-info/karfur/commit/f6cffe07f03a2b8f2fdbd2233f575e9038f45bfb))
* **migrations:** use codeName instead of magic number for IndexNotFound ([e14ddd9](https://github.com/refugies-info/karfur/commit/e14ddd90dcc7b3ce7ea45ebd4f0ac959cb02f962))
* **server:** address PR review feedback on appuser settings updates ([e8a661a](https://github.com/refugies-info/karfur/commit/e8a661aef7c0bd12846bd3c396c362a2463849e0))
* **server:** normalize current user id in translation review workflow ([fb26fff](https://github.com/refugies-info/karfur/commit/fb26fff93b37a4b6d484736bdaba2eb14eb1af4a))
* **server:** prevent appuser notification settings map cast errors ([1823c00](https://github.com/refugies-info/karfur/commit/1823c000678582134a257de585492e51a5372a67))
* **server:** prevent appuser notification settings map cast errors ([6f73f70](https://github.com/refugies-info/karfur/commit/6f73f701c23b57ffd643450c5e1e4484d506a03f))
* **workspace:** avoid unnecessary mobile release builds on lockfile-only noise ([661b714](https://github.com/refugies-info/karfur/commit/661b714a134317f1ee05713006393c8e797bb67c))
* **workspace:** avoid unnecessary mobile release builds on lockfile-only noise ([8634788](https://github.com/refugies-info/karfur/commit/8634788ffd0d1d37096cb7101387782a21e752e1))
* **workspace:** prevent translation page 500 on missing author ids ([ff2b7b9](https://github.com/refugies-info/karfur/commit/ff2b7b9b88526065f3f9a20f9d9dc4157e419840))
* **workspace:** prevent translation page crash on missing author ids ([a9f11d4](https://github.com/refugies-info/karfur/commit/a9f11d48ecb7adf8d1fabb7ba3e14c6a597e97c7))

## [2.7.0](https://github.com/refugies-info/karfur/compare/karfur-v2.6.0...karfur-v2.7.0) (2026-03-30)


### Features

* **migrations:** add MongoDB Performance Advisor recommended indexes ([3de686b](https://github.com/refugies-info/karfur/commit/3de686b5d9324f2d8d26a48ba4692f887594afe2))
* **migrations:** add MongoDB Performance Advisor recommended indexes ([07507e8](https://github.com/refugies-info/karfur/commit/07507e8e6069b9b3b8a5549250ee13480b42dac2))


### Bug Fixes

* **deps:** resolve Dependabot security alerts for path-to-regexp and @smithy/config-resolver ([c84e758](https://github.com/refugies-info/karfur/commit/c84e7580d1d65f2fbea8025d1adb08e33d4536e4))
* **deps:** resolve Dependabot security alerts for path-to-regexp and @smithy/config-resolver ([f286c7d](https://github.com/refugies-info/karfur/commit/f286c7d62a0e686381648714949cdb3d2323d43a))
* **deps:** scope @smithy/config-resolver override to vulnerable versions only ([a3927f9](https://github.com/refugies-info/karfur/commit/a3927f953408ba15c114a3293e06a19f966f3f4b))
* **migrations:** use IndexNotFound error code in down() instead of swallowing all errors ([003bee9](https://github.com/refugies-info/karfur/commit/003bee989532b54bd0ebc3e8c6d4aa3854062604))
* **ui:** add titleClassName prop to Modal for flexible title sizing ([53eb162](https://github.com/refugies-info/karfur/commit/53eb162037190c3ec6ec55caa25a84f23be3e181))

## [2.6.0](https://github.com/refugies-info/karfur/compare/karfur-v2.5.7...karfur-v2.6.0) (2026-03-30)


### Features

* **mobile:** upgrade to Expo SDK 54 ([ae128bc](https://github.com/refugies-info/karfur/commit/ae128bca1843152891c6138afe61e27fab26c079))
* **mobile:** upgrade to Expo SDK 54 ([747b3aa](https://github.com/refugies-info/karfur/commit/747b3aac24aac1ec57522f439c2dd8b700b18737))
* **skill:** add investigating-server-errors skill for 5xx error debugging ([1d851c7](https://github.com/refugies-info/karfur/commit/1d851c73f641fd445cbd4d5a382bd7760b0836ed))
* **skill:** add investigating-server-errors skill for 5xx error debugging ([bb5c500](https://github.com/refugies-info/karfur/commit/bb5c50082e9735f9ce85befb7a529bccd8fef907))


### Bug Fixes

* **client:** upgrade React to 19.1.0 and update snapshots ([12957d7](https://github.com/refugies-info/karfur/commit/12957d7ab718fb36a734f19aa86543a2bf3bbf25))
* **server:** translation avancement 0% and publish failure due to Mongoose Maps ([a1ce40d](https://github.com/refugies-info/karfur/commit/a1ce40d035fc9c277980771ef5bbce9694216b83))
* **server:** translation avancement 0% and publish failure due to Mongoose Maps ([3443265](https://github.com/refugies-info/karfur/commit/3443265a8ffafb1f4d587ab4b6624a007b74930d))
* **workspace:** narrow brace-expansion override to ^2.0.3 ([86f9522](https://github.com/refugies-info/karfur/commit/86f9522a5ee67f26eb759bf9594a68fc85e1a2a0))
* **workspace:** narrow brace-expansion override to ^2.0.3 ([4f785a2](https://github.com/refugies-info/karfur/commit/4f785a2894ad8eb6d3ced50220cc9a859f83d618))

## [2.5.7](https://github.com/refugies-info/karfur/compare/karfur-v2.5.6...karfur-v2.5.7) (2026-03-27)


### Bug Fixes

* **mobile:** use fs.readFileSync for package.json to avoid brace_expansion error ([5c967fa](https://github.com/refugies-info/karfur/commit/5c967fa599f9ef2c632be1cc10157457bedfd75f))
* **mobile:** use fs.readFileSync for package.json to avoid brace_expansion error ([5150b28](https://github.com/refugies-info/karfur/commit/5150b28261cc6ad42d7fcd6bed1aa295bc3099ea))

## [2.5.6](https://github.com/refugies-info/karfur/compare/karfur-v2.5.5...karfur-v2.5.6) (2026-03-27)


### Bug Fixes

* **client:** improve type inference in facetPipelines ([088ba2b](https://github.com/refugies-info/karfur/commit/088ba2b1ac0374da23e66b8c80e0f0e682a851ac))
* **client:** improve type safety in search counts aggregation ([4f703ae](https://github.com/refugies-info/karfur/commit/4f703ae13fb5b7ee972e8931761df40ae6041a5e))
* **client:** improve type safety in search counts aggregation ([e0dfb99](https://github.com/refugies-info/karfur/commit/e0dfb99c65fcd9ea70abab16597928379e331540))
* **mobile:** convert app.config.js to pure CommonJS ([15c190d](https://github.com/refugies-info/karfur/commit/15c190dbe7932a99f0eeef6be519b07deef05794))
* **mobile:** convert app.config.js to pure CommonJS ([a285743](https://github.com/refugies-info/karfur/commit/a285743f69d83866d5095a5ef107384abb1ff79d))

## [2.5.5](https://github.com/refugies-info/karfur/compare/karfur-v2.5.4...karfur-v2.5.5) (2026-03-27)


### Bug Fixes

* **ci:** skip EAS fingerprint computation to workaround brace_expansion bug ([221d8c8](https://github.com/refugies-info/karfur/commit/221d8c8b39466b7b7dfa0700e1d710ba62d9ffd3))
* **ci:** skip EAS fingerprint computation to workaround brace_expansion bug ([f4455c8](https://github.com/refugies-info/karfur/commit/f4455c84077e9d28eff4f6ab5d5e6fc2f3c5b472))

## [2.5.4](https://github.com/refugies-info/karfur/compare/karfur-v2.5.3...karfur-v2.5.4) (2026-03-27)


### Bug Fixes

* **client:** filter online resources by metadatas.location instead of typeContenu ([9b49020](https://github.com/refugies-info/karfur/commit/9b490200a209e0772ba4e1940396065f04775dc4))
* **client:** filter online resources by metadatas.location instead of typeContenu ([5d2765e](https://github.com/refugies-info/karfur/commit/5d2765e368c21395c2283f22cc428de87a443442))
* **client:** update live chat availability from 2 to 4 days per week ([28c8a15](https://github.com/refugies-info/karfur/commit/28c8a1544aee0b1a638e4834f34b40aca1c01e55))
* **client:** update live chat availability from 2 to 4 days per week ([d476169](https://github.com/refugies-info/karfur/commit/d4761699d73afd5a55c1f2684ed94012588485f5))
* **client:** use separate query for online count calculation ([d64014b](https://github.com/refugies-info/karfur/commit/d64014be253e92738bb04245bfd1afe000350f8d))
* **letta:** address review comments on settings.json and skill ([434dbb0](https://github.com/refugies-info/karfur/commit/434dbb0573baac6695329f9fc993419736aaed50))
* **workspace:** address Dependabot security alerts for handlebars, node-forge, brace-expansion ([44f0f67](https://github.com/refugies-info/karfur/commit/44f0f67dd8453ded48360319053ab1b69fc9943c))
* **workspace:** address Dependabot security alerts for handlebars, node-forge, brace-expansion ([150869a](https://github.com/refugies-info/karfur/commit/150869a3c6bee7aef74d457ac0a69f4a8dafbd6d))

## [2.5.3](https://github.com/refugies-info/karfur/compare/karfur-v2.5.2...karfur-v2.5.3) (2026-03-26)


### Bug Fixes

* **server:** increase container memory to 4G and Node heap to 3584MB ([72a8e97](https://github.com/refugies-info/karfur/commit/72a8e976836a095eadab8df6b4624ca507039d3c))
* **server:** increase Node.js heap size to prevent OOM crashes ([7196ee6](https://github.com/refugies-info/karfur/commit/7196ee66fd4fe64460b9f7cd2e14cd6058f2af58))

## [2.5.2](https://github.com/refugies-info/karfur/compare/karfur-v2.5.1...karfur-v2.5.2) (2026-03-26)


### Bug Fixes

* **migration:** preserve existing sessions array data during migration ([3ab70a2](https://github.com/refugies-info/karfur/commit/3ab70a24539c507dd3264758d6b82f8308e807fa))
* **migration:** preserve existing sessions array data during migration ([496e49a](https://github.com/refugies-info/karfur/commit/496e49acf0d48ff51efaecdccf07291b4915550a))

## [2.5.1](https://github.com/refugies-info/karfur/compare/karfur-v2.5.0...karfur-v2.5.1) (2026-03-26)


### Bug Fixes

* Update sessions format for Zod schema compatibility in dispositifs and dispositifs_draft collections. ([dfebda2](https://github.com/refugies-info/karfur/commit/dfebda21cdc64e064ba1eb45eebade7b7fb69f1b))

## [2.5.0](https://github.com/refugies-info/karfur/compare/karfur-v2.4.1...karfur-v2.5.0) (2026-03-26)


### Features

* make Dispositif `needs` property optional and update client-side access with optional chaining. ([31d190c](https://github.com/refugies-info/karfur/commit/31d190c5b85a1f545861eca4ddcec55f02286909))


### Bug Fixes

* **client:** serialize sitemap locale requests to reduce backend overload ([c60c56a](https://github.com/refugies-info/karfur/commit/c60c56a2be9813ffbf784955ae167905314b6d32))
* **client:** serialize sitemap locale requests to reduce backend overload ([aace330](https://github.com/refugies-info/karfur/commit/aace330850a93c5d49bddb259fd56ba671adfbf9))
* **mobile:** update redux state before persisting favorites ([cc1445e](https://github.com/refugies-info/karfur/commit/cc1445eeb7d56e9b2e5ec7449f74e38fadaaba4a))
* **mobile:** update redux state before persisting favorites ([9ed9a22](https://github.com/refugies-info/karfur/commit/9ed9a22a9d455d908b7ce180ef826630b02a833b))
* safely access `dispositif.needs` length with optional chaining to prevent potential errors. ([c3544ac](https://github.com/refugies-info/karfur/commit/c3544aca5e91dbf65476276d01903683380bb3e0))
* Safely access dispositif suggestions and merci arrays by default… ([90c2ae0](https://github.com/refugies-info/karfur/commit/90c2ae06f8fc28411209da519daa9a3b29972b3d))
* Safely access dispositif suggestions and merci arrays by defaulting to an empty array. ([5088e32](https://github.com/refugies-info/karfur/commit/5088e32d317203a15b3c891e84054958aee458f6))
* **server:** handle missing draft arrays in structure dispositifs ([5b841f1](https://github.com/refugies-info/karfur/commit/5b841f1232be3d2ba9088f5e9563d5df93555d84))

## [2.4.1](https://github.com/refugies-info/karfur/compare/karfur-v2.4.0...karfur-v2.4.1) (2026-03-25)


### Bug Fixes

* **server:** ensure release-please can parse PR [#3617](https://github.com/refugies-info/karfur/issues/3617) ([#3618](https://github.com/refugies-info/karfur/issues/3618)) ([a0c8bfa](https://github.com/refugies-info/karfur/commit/a0c8bfa17a7241ded2b64f88c6692c78eb3f1d86))

## [2.4.0](https://github.com/refugies-info/karfur/compare/karfur-v2.3.2...karfur-v2.4.0) (2026-03-24)


### Features

* Add `locale: false` to permanent redirects to prevent locale-based routing. ([0847a3e](https://github.com/refugies-info/karfur/commit/0847a3e15f88e6ea8bf6b0c750a3e44897016a83))
* Add `NEXT_PUBLIC_DISABLE_SEARCH_COUNTS` to `cloudbuild.env` and reformat Docker push arguments. ([a7103e7](https://github.com/refugies-info/karfur/commit/a7103e7ab7f6da17d905efbafce6b6cf7b467528))
* Add `NEXT_PUBLIC_DISABLE_SEARCH_COUNTS` to `cloudbuild.env` and… ([4d21cd2](https://github.com/refugies-info/karfur/commit/4d21cd2a3055a339878f29d4fb18720b167e05c3))
* add `PoiSchema` and integrate it into `ArticleSchema` and `Arti… ([1b961b0](https://github.com/refugies-info/karfur/commit/1b961b06acdc55cfc3f74a4a6d9515156b75a9eb))
* add `PoiSchema` and integrate it into `ArticleSchema` and `ArticleUpdateSchema` for map points of interest. ([e372468](https://github.com/refugies-info/karfur/commit/e3724687f764c97c21d44db238dc0d389b4b4525))
* Add `sessions` field to Dispositif schema and relax SessionSche… ([632e664](https://github.com/refugies-info/karfur/commit/632e66408f7b96058dbc7ebcf12a38a84aaff722))
* Add `sessions` field to Dispositif schema and relax SessionSchema date validation to accept date-only strings. ([9c53bfc](https://github.com/refugies-info/karfur/commit/9c53bfce58f27a7f63f23e7491da3f3800ae4a1e))
* add accessibility properties to MapViewContainer ([eecd1c4](https://github.com/refugies-info/karfur/commit/eecd1c44d69ee1986d5b3f88c1cecb74d3f8911b))
* Add architectural migration guide and plans for Redux and App Router adoption. ([d14bbec](https://github.com/refugies-info/karfur/commit/d14bbec189dd983e486b7a92aaca9479b4745890))
* add aria-hidden attribute to ImageCustomFigure span ([d2c114f](https://github.com/refugies-info/karfur/commit/d2c114fdfc23659d890b2068a6a163de540124cf))
* add aria-label to impact booklet download card for improved accessibility. ([ba45f72](https://github.com/refugies-info/karfur/commit/ba45f72b6784930377598760bc505ff0e58cc3bb))
* add department selection dropdown to Agir page and update UI layout and accessibility. ([4b53cb3](https://github.com/refugies-info/karfur/commit/4b53cb3805dfcf3b60abdc46bbfe3f7663e34ef4))
* Add DepartmentSelect component to the agir page and improve MapFrance accessibility. ([5aeb4b2](https://github.com/refugies-info/karfur/commit/5aeb4b283063e093cd51ba24a5d13beabd5a5f6c))
* add detailed testing strategy to Redux migration plan and estimated project timeline ([1ceb064](https://github.com/refugies-info/karfur/commit/1ceb064bec4b43e6b969d30a91d5fe3ec72f6bb1))
* add Expo plugin to disable strict linting for Android builds ([10c2153](https://github.com/refugies-info/karfur/commit/10c2153c11866b3dc549dd3b6cf4238036eb909f))
* add Expo plugin to disable strict linting for Android builds ([9e2d656](https://github.com/refugies-info/karfur/commit/9e2d6563332a2ae7f66cfe6ad3ecc07468115160))
* add Gradle daemon, parallel, caching, and configure-on-demand properties to app configuration. ([649bddc](https://github.com/refugies-info/karfur/commit/649bddce9b0a38c52cc556d81601af79c03b9329))
* add MailEvent to typegoose exports ([c76338f](https://github.com/refugies-info/karfur/commit/c76338f292f31297a38e81401d8feaee17f20334))
* Add new webhook API endpoint for handling dispositif creation, updates, and translations, and update DispositifOrigin schema error handling. ([a366cd2](https://github.com/refugies-info/karfur/commit/a366cd29037d6b45a12660139e295738b557a037))
* Add ObjectId validation to webhook schemas, refactor webhook Mongoose model for non-strict handling, and remove the main dispositif webhook API route. ([a41d0a1](https://github.com/refugies-info/karfur/commit/a41d0a11e47f4dee5774582b2852fdb62aa430c1))
* Add remark plugin to restore markdown hierarchy for container directives in `Section.tsx`. ([4f6730d](https://github.com/refugies-info/karfur/commit/4f6730dcdfcd968f53ebf9f29ccbaf35e12e2270))
* add sessions metadata to the Dispositif schema. ([37c0145](https://github.com/refugies-info/karfur/commit/37c01457d1e80c00e946ed84cae036ac16c6fc0e))
* add Storybook stories for the RIAccordion component and initialize the DSFR React library in Storybook. ([5444c30](https://github.com/refugies-info/karfur/commit/5444c30d6d2f0672e197c0dbf3fef84161a725e2))
* Add support for custom markdown directives to render React components like accordions and callouts. ([020d34d](https://github.com/refugies-info/karfur/commit/020d34d6c2dbf7c1563ddf2e4ae47b8b4f0bb888))
* add support for patch, minor, major arguments to bump_app_version ([6881ffd](https://github.com/refugies-info/karfur/commit/6881ffd2eab28b293131f723871104b095d6ec21))
* add support for rendering nested directives to HTML ([70867df](https://github.com/refugies-info/karfur/commit/70867df293f93563f384e1fd238ffbd24bc7c388))
* Add tracking event for accordion expansion when opened in view mode. ([c906b32](https://github.com/refugies-info/karfur/commit/c906b32a891cf0b92d5a53fd413b41fd61224af9))
* Add utility functions for flexible dispositif translation retrieval and language availability, and improve content type guards for content and markdown. ([8d615a3](https://github.com/refugies-info/karfur/commit/8d615a30d945ae9de69f0208987598b9f583696b))
* allow dispositif sponsors to be string IDs or objects and updat… ([4713791](https://github.com/refugies-info/karfur/commit/47137912933cffd5c6b1d5c55ee7a8f4820c4284))
* allow dispositif sponsors to be string IDs or objects and update form handling accordingly ([6411c7c](https://github.com/refugies-info/karfur/commit/6411c7cd90e519481ed6dfd0e6431f6033ec1727))
* better user feedback on preview mode ([f0f257d](https://github.com/refugies-info/karfur/commit/f0f257d9d0cdfc2a7b234df864e7898635ea4e0b))
* **ci:** add release pipeline to sequence backend → frontend deployments ([fb90d5f](https://github.com/refugies-info/karfur/commit/fb90d5f26c819016b006bc4fab686bd2c2908100))
* **client:** add training sessions display for RCO dispositifs ([5729031](https://github.com/refugies-info/karfur/commit/5729031636a3e4fd44a4cbeb348e487649f2b445))
* **client:** add webhook endpoints for themes and needs reference data ([115fe9f](https://github.com/refugies-info/karfur/commit/115fe9f9711d3d5275c9d2a5b9ac4c2d855dc003))
* **client:** add webhook endpoints for themes and needs reference data ([10329bc](https://github.com/refugies-info/karfur/commit/10329bc66830b2ba19d91341fa9d6dd33e8742ba))
* **client:** allow admins to change structure logos from the details modal ([b7d2b3d](https://github.com/refugies-info/karfur/commit/b7d2b3d26027f938dec38233a101ca169af2c1c5))
* **client:** replace client-side filtering with server-side paginated search ([033f8b9](https://github.com/refugies-info/karfur/commit/033f8b96567373ee67fb921c40edd47febd24d89))
* Conditionally display search counts based on `DISABLE_SEARCH_COUNTS` environment variable ([9f13873](https://github.com/refugies-info/karfur/commit/9f13873476d8f657ac47c30b7971a42abe126c23))
* conditionally render search result counts based on environment … ([7a5e959](https://github.com/refugies-info/karfur/commit/7a5e9595c82e02555a1d6588540b3ba997f55bcc))
* conditionally render search result counts based on environment variable and reformat component props for readability. ([4510358](https://github.com/refugies-info/karfur/commit/4510358f9dc8edb9272d03213c112fef54f266b7))
* display dispositif origin through new SourceCard component and … ([d17bb79](https://github.com/refugies-info/karfur/commit/d17bb79f4632702ff962c2b1ac944294654484cb))
* display dispositif origin through new SourceCard component and integrate RCO source details. ([6d741c8](https://github.com/refugies-info/karfur/commit/6d741c849987d123ac2fef7b70e8b6988cba7cce))
* Display loading and error states for themes in the selection modal and refactor theme button styled-component props. ([01e6497](https://github.com/refugies-info/karfur/commit/01e6497083126fc6477d5da4e06f15d4116d5da9))
* Enable autoIncrement for internal staging builds ([e0f45a2](https://github.com/refugies-info/karfur/commit/e0f45a2e2ae956e40e9c61da208654c7b3f9682f))
* Enhance department autocomplete with fuzzy search using new string utilities and improve removable item alignment. ([b7a9aa2](https://github.com/refugies-info/karfur/commit/b7a9aa2278e5b8a3e1b519867f793bcea4f264a9))
* Enhance department input UX with improved autocomplete visibility, input focus, and search clearing. ([1021428](https://github.com/refugies-info/karfur/commit/10214287649e65211c5c7178773bcdbb0fb97e9a))
* Enhance ModalSponsors to load sponsor details from dispositif when sponsor is an ID. ([66e62a1](https://github.com/refugies-info/karfur/commit/66e62a1f60638e4d01271a67cfe72e8646cbdf45))
* enhance webhook documentation with `sponsors`, detailed `metadatas`, and a new field values reference section. ([4cc09d6](https://github.com/refugies-info/karfur/commit/4cc09d69837ffa19b22c1975ce8f4372801a9fbc))
* Filter dispositifs by origin "RI" and safely calculate `nbMerci… ([a7b3093](https://github.com/refugies-info/karfur/commit/a7b3093a5a26bdc215d4dd2b2cc18cb77fa7d95b))
* Filter dispositifs by origin "RI" and safely calculate `nbMercis` in `getAllDispositifs` workflow. ([f1e4dfa](https://github.com/refugies-info/karfur/commit/f1e4dfa357dfae73be73f1e0f36d7fd78d0fb156))
* Filter user contributions by `DispositifOrigin.RI` on the clien… ([30a2f1f](https://github.com/refugies-info/karfur/commit/30a2f1f6cb5d809a1552b2424f6d1689a18b9de1))
* Filter user contributions by `DispositifOrigin.RI` on the client and ensure the `origin` field is fetched with improved null-safety on the server. ([dfd8bf5](https://github.com/refugies-info/karfur/commit/dfd8bf5ea842cccddea14cead43f5fc68e42407a))
* flatten Dispositif schema maps and add robust translation handling to `getContentById` workflow. ([c5fb597](https://github.com/refugies-info/karfur/commit/c5fb59797cacab4e290b88e5594049424e15d06d))
* handle update in webhook ([4a7bd8b](https://github.com/refugies-info/karfur/commit/4a7bd8bd8cce1c4db7f128bc7ddf2b0a1958be5b))
* handle update in webhook ([34a8ecb](https://github.com/refugies-info/karfur/commit/34a8ecbb4ca724c5bc326202c1db9843d571602e))
* Implement a `hasLoaded` flag in the themes state to prevent re-fetching and update the theme loading logic in the Layout component. ([cbda755](https://github.com/refugies-info/karfur/commit/cbda75546c284b9aa88acb37526e37281fdd9151))
* Implement direct theme ID and metadata handling for webhook pay… ([6219e31](https://github.com/refugies-info/karfur/commit/6219e3172801e5447734f40a5f3ac4ad84ee0268))
* Implement direct theme ID and metadata handling for webhook payloads, and update preview title fallbacks. ([0fc5fd5](https://github.com/refugies-info/karfur/commit/0fc5fd5f613acf3cebe0af53a58b9fa981567bc3))
* Implement display of training sessions for RCO dispositifs, including schema updates, a new UI component, and related documentation updates. ([48e17db](https://github.com/refugies-info/karfur/commit/48e17db915bbde087782e38a151bd4d0069fe6e8))
* implement dispositif webhook ([a8b0025](https://github.com/refugies-info/karfur/commit/a8b0025075bb40e4281e8cc23d862592ae1cd4f7))
* implement dispositif webhook ([0f7f7d7](https://github.com/refugies-info/karfur/commit/0f7f7d7a055bd5d2e5107bafca6df19462162925))
* implement slash command bump_app_version ([069e0c4](https://github.com/refugies-info/karfur/commit/069e0c482fac6ecaf7af47b54bc1e8985383e948))
* implement slash command bump-app-version and bump version to 2.2.1 ([78c69e7](https://github.com/refugies-info/karfur/commit/78c69e74efccd933b87d29f43271af9dfb630a96))
* implement translation support for dispositif preview content and prevent layout's language auto-redirect. ([deaadb5](https://github.com/refugies-info/karfur/commit/deaadb516bceb8265581ccea762c505a34a043c0))
* improve AccordionAnimated accessibility by hiding decorative elements and collapsed content. ([264f029](https://github.com/refugies-info/karfur/commit/264f0298290215664b28827c0d9eb4d882edb7d6))
* improve department input UX by adding ref forwarding, autocomplete control, and better prediction handling. ([8d874cc](https://github.com/refugies-info/karfur/commit/8d874cc9e9f8651083c5e5e68d9f0ffdf88cec3f))
* improve theme name lookup with French collation for better matching. ([f101545](https://github.com/refugies-info/karfur/commit/f101545c48fd5d8a7f4913a95f3f5e4fb6aecad2))
* Improve webhook Dispositif creation by defining a more explicit schema, setting default origin, populating French translations, and adding case-insensitive theme name matching. ([0e70031](https://github.com/refugies-info/karfur/commit/0e700312cac58cb2b0ba004577124e96b349827d))
* introduce `I18nCodeZodSchema` and apply it to `Dispositif` translations and `Langue` i18nCode fields. ([e77dfcf](https://github.com/refugies-info/karfur/commit/e77dfcfe00c688f8c21501eaca66de539e345e76))
* Introduce RIAccordion component with custom styling and step number support, replacing direct DSFR Accordion usage in client and markdown directives. ([21fb9ac](https://github.com/refugies-info/karfur/commit/21fb9ac093596474f05a87a9c85f53234034a8ec))
* Introduce shared markdown utilities package to correctly parse and render markdown directives in client and mobile applications. ([61753c4](https://github.com/refugies-info/karfur/commit/61753c4f31794dbd2425f602cced51b69231057b))
* migrate to Biome ([3650328](https://github.com/refugies-info/karfur/commit/3650328a12505636bc36b16af5438c92517bc093))
* migrate Traductions model to mono-repo structure ([a548294](https://github.com/refugies-info/karfur/commit/a548294751e729924e3d12004ba35de506bd6f2b))
* **migration:** migrate AdminOptions, Error, and CloudinaryImage models ([41ad116](https://github.com/refugies-info/karfur/commit/41ad116f642aaf8f041c45daed45b4691be0eac4))
* **migration:** migrate Indicator, MailEvent, and Notification models ([1484ce7](https://github.com/refugies-info/karfur/commit/1484ce75f104085f7577df83dfbb6cfce1be68c2))
* **migration:** migrate Log, Snapshot, and Widget models ([8aa5622](https://github.com/refugies-info/karfur/commit/8aa56229213d2263973a32e5c62281af3d3df1c8))
* **migration:** migrate Need model to @refugies-info/mongo ([0bded05](https://github.com/refugies-info/karfur/commit/0bded0522bf9f69483d41617955f6b9699465c93))
* **migration:** migrate Structure model to @refugies-info/mongo ([7699218](https://github.com/refugies-info/karfur/commit/7699218ac4142ba7e4aa4f74ba43f2293e6943c7))
* **migration:** migrate Structure to @refugies-info/mongo ([c30f6e0](https://github.com/refugies-info/karfur/commit/c30f6e073f90de19babf78dff5734ca24981d2ab))
* mode preview cleanup and optimisations ([b5c5d6b](https://github.com/refugies-info/karfur/commit/b5c5d6bf7eee2aa99094c7544fa185675ffadf6d))
* **mongo,server,client:** add speedgoose write-through MongoDB cache ([5b0e0e2](https://github.com/refugies-info/karfur/commit/5b0e0e239a521520c722446a85d123f53e9700cd))
* **mongo:** init package and migrate Langue model ([463359a](https://github.com/refugies-info/karfur/commit/463359a841cbafda585a56e9aec9b1e71ea767c6))
* **mongo:** migrate Theme model ([c678f89](https://github.com/refugies-info/karfur/commit/c678f89f19e4612e46b60d1fc8e1415688aa3fd4))
* preview route ([c2f1a5c](https://github.com/refugies-info/karfur/commit/c2f1a5c8bff2d3cecbca6b4580400d166140c3cf))
* **rco:** enable markdown rendering for RCO documents ([1156826](https://github.com/refugies-info/karfur/commit/1156826f6ed4e46a9aba93dab9fd71bb9945062b))
* **rco:** enable markdown rendering for RCO documents ([84b1026](https://github.com/refugies-info/karfur/commit/84b1026198f860b8418f3f36faf2f9a34d20baad))
* Refactor dispositif sessions to a `SessionsMetadata` object, in… ([cc27a93](https://github.com/refugies-info/karfur/commit/cc27a93a4fc9d1c9dd1841cceccb0ec0d6c27eca))
* Refactor dispositif sessions to a `SessionsMetadata` object, introducing `modalitesEntreesSorties` and encapsulating session items. ([8e87df1](https://github.com/refugies-info/karfur/commit/8e87df14b79c53dc213d6db80d8f22bc46e3e496))
* Refactor dispositif webhook into dedicated create, update, translation, and archive endpoints with new schemas, utilities, tests, and documentation. ([d3d58f0](https://github.com/refugies-info/karfur/commit/d3d58f0f549ca32726d3504462222e303d226d27))
* Refine lintOptions check with regex and improve formatting in app.config.js. ([30ab3d2](https://github.com/refugies-info/karfur/commit/30ab3d238558ec9aabad4dc30e66dca051f61dbf))
* Remove "Voir dans l'annuaire" button from UserStructureDetails. ([366dbba](https://github.com/refugies-info/karfur/commit/366dbba56beac051c9e39715c99d8b31f910dab8))
* remove annuaire feature and associated pages and components ([5acddfe](https://github.com/refugies-info/karfur/commit/5acddfe89ca78f814ffe065f7bb80837ad7c0bd0))
* remove custom hierarchical ordered list styling and grid layout for list items ([e086f19](https://github.com/refugies-info/karfur/commit/e086f19d13899845a83907c6529bfd927d9d7ca9))
* Restrict translation keys in webhook schemas to activated languages. ([b12a0f1](https://github.com/refugies-info/karfur/commit/b12a0f1ba78ddbefe1e29fb56a37ce9becd9d59f))
* **server,client:** add speedgoose caching to high-traffic query paths ([b2eb211](https://github.com/refugies-info/karfur/commit/b2eb211962a3864477783067b17aace2f0e49df7))
* **server:** add debug logging and regression tests for RI-1154 ([e02ff60](https://github.com/refugies-info/karfur/commit/e02ff608c3399093507c22aefed56539d78aefe3))
* **server:** add mail restriction for réseau MENS structure (R-1108) ([f0cad64](https://github.com/refugies-info/karfur/commit/f0cad6454604d00f46f7f329e04c0851732c88b2))
* **server:** migrate brevo connector to @getbrevo/brevo v5 SDK ([bc05590](https://github.com/refugies-info/karfur/commit/bc05590b913fedc62c8084ef11e1d9e1ac02caec))
* set all themes without filtering by active status ([834c116](https://github.com/refugies-info/karfur/commit/834c1161db8d7473ec035b2e03d011660b548ef9))
* Temporarily disable DispositifOrigin.RI filter in allDispositif… ([535783b](https://github.com/refugies-info/karfur/commit/535783b14cf8d2b78cf0c3c2d3a2f8252a1b8511))
* Temporarily disable DispositifOrigin.RI filter in allDispositifs saga. ([b366f23](https://github.com/refugies-info/karfur/commit/b366f233d222bae28caf9a0e0e38b8530d2f1c05))
* **types:** add exclusive DispositifContent validation for structured vs markdown content ([6ec357b](https://github.com/refugies-info/karfur/commit/6ec357b4763adb19e3c6e48cba789e2b3876162d))
* update Expo app version to 2.2.0 ([ebb24bb](https://github.com/refugies-info/karfur/commit/ebb24bb659d7e135773040e9a091ac4569f59f86))
* update user legend content and improve image accessibility with semantic HTML. ([a12874c](https://github.com/refugies-info/karfur/commit/a12874ccc016cf619f34d304805a075ccd25937f))
* Update UserStructure snapshot to reflect navigation link change from specific structure ID to general search page. ([0bf9ee0](https://github.com/refugies-info/karfur/commit/0bf9ee0eaf542037497df51ec8d23188126006b2))
* Upgrade `react-native-reanimated` and `react-native-reanimated-carousel`, implementing custom animations for TagsCarousel and updating Android Gradle plugin. ([ef5e6de](https://github.com/refugies-info/karfur/commit/ef5e6de5ad164f2e47d24017cf08785c2659ab9b))
* **workspace:** unify production branches into single production branch ([c149d58](https://github.com/refugies-info/karfur/commit/c149d587edfc6265dc9cd3d59ad063d5175b1a40))
* **workspace:** unify staging branches into single staging branch ([63634f0](https://github.com/refugies-info/karfur/commit/63634f01a56c9e8d889c71a3d6b933f67b650364))


### Bug Fixes

* add missing format task to turbo and root package.json ([1920c5d](https://github.com/refugies-info/karfur/commit/1920c5d2dd1117b9cb13758524e5a88d61b536e0))
* add missing format task to turbo and root package.json ([33d8a05](https://github.com/refugies-info/karfur/commit/33d8a056479eec27a50be409f593f335ccfaa340))
* add optional chaining to `getMainSponsor()` to safely access sponsor picture. ([291c47d](https://github.com/refugies-info/karfur/commit/291c47d312d645b6f422e24ad10c64dab59cb36d))
* address PR review comments (deduplication & formatting) ([d5f066f](https://github.com/refugies-info/karfur/commit/d5f066f723f856e18e0237d945c8b1639c296a7a))
* Adjust Accordion component to correctly manage its expanded state. ([3699acb](https://github.com/refugies-info/karfur/commit/3699acb5e99ece350720061aed6fc626cd9e609c))
* Adjust Navbar path matching to ignore query parameters and impro… ([4443c08](https://github.com/refugies-info/karfur/commit/4443c08ce01d870a92db33e11035d5ee38fbe487))
* Adjust Navbar path matching to ignore query parameters and improve code formatting. ([5e193c4](https://github.com/refugies-info/karfur/commit/5e193c428b7e761d7bcb450db44442cdbaa4f05a))
* **api:** replace never type with undefined to resolve tsoa error ([03f150e](https://github.com/refugies-info/karfur/commit/03f150ef7d69d2adbe0fe66ca9346b5b7fa3a5dd))
* **api:** strictly exclude conflicting fields when markdown is present ([22ecee5](https://github.com/refugies-info/karfur/commit/22ecee58c89f16bf1717316c8df054b2d261d344))
* **biome:** remove cssModules config not supported by CI ([d94c17a](https://github.com/refugies-info/karfur/commit/d94c17a7fa8cb8c345868c210ef3d4350441e98f))
* **biome:** remove deprecated useAriaPropsSupportedByRole rule ([ea647b7](https://github.com/refugies-info/karfur/commit/ea647b7112532022bb7ff77db2c7fa0fee41ffcd))
* **biome:** remove invalid assist configuration ([169ae25](https://github.com/refugies-info/karfur/commit/169ae25a3b5341f76815254ff3f4b1681ba42d7b))
* **biome:** revert biome.json to origin/dev content ([467e214](https://github.com/refugies-info/karfur/commit/467e214341d1d6a643c28c706d7f8bfaaea020b5))
* **ci:** correct workflow filename extension in path filter (.yml → .yaml) ([69b4574](https://github.com/refugies-info/karfur/commit/69b45748e679d4f26e4f044baf01fdcabc2af7f1))
* **ci:** replace dorny/paths-filter with tj-actions/changed-files, add mobile to release pipeline ([c9d9e76](https://github.com/refugies-info/karfur/commit/c9d9e76c300301d58417638836840d2db62b3f34))
* **ci:** use push trigger for migrate workflows to satisfy env protection rules ([8fe6642](https://github.com/refugies-info/karfur/commit/8fe664285ab3f9b5640212f881b9b1dc8c858b56))
* **client:** add missing @refugies-info/markdown-utils dependency ([2613e77](https://github.com/refugies-info/karfur/commit/2613e7734ef2ee14247d0568f71b75c7187df504))
* **client:** add runtime fallback models and cache-safe query execution ([a27b2f5](https://github.com/refugies-info/karfur/commit/a27b2f579ea8a8290280235d7dada9bb9fec8e3c))
* **client:** add z-index to department tooltip so it renders above stickybar ([47fa2d9](https://github.com/refugies-info/karfur/commit/47fa2d917c24d8fa9a48da3a955221ff9f37c5e1))
* **client:** address PR review — types, a11y, noResults, deps ([33af06b](https://github.com/refugies-info/karfur/commit/33af06b28ce639bd95aba700253056fff66a7169))
* **client:** correct Mongo $in usage in location sort aggregation ([81f7482](https://github.com/refugies-info/karfur/commit/81f7482803aa72979c1880ebb7e33f190f295372))
* **client:** correct sort field names in search aggregation ([3b4613f](https://github.com/refugies-info/karfur/commit/3b4613fd784bc5ed18cef92d195609f3b8cdb148))
* **client:** harden theme/need ObjectId parsing in search filters ([e99da62](https://github.com/refugies-info/karfur/commit/e99da62fd534d75b045c1240961b727f71ea6ed6))
* **client:** increase structure summary character limit to 200 ([bdb7119](https://github.com/refugies-info/karfur/commit/bdb7119995077c0fce76e8de3c21b7af10197ad3))
* **client:** increase structure summary character limit to 200 ([f6c69df](https://github.com/refugies-info/karfur/commit/f6c69df7cad4e70e2c05e3e00f068b4dcb23358e))
* **client:** pin NEXT_PUBLIC_DISABLE_SEARCH_COUNTS in snapshot test ([dd19d22](https://github.com/refugies-info/karfur/commit/dd19d224ad72df0cd9aa98eb6e6a9003bc34119f))
* **client:** prevent infinite fetchThemes loop ([8d2d201](https://github.com/refugies-info/karfur/commit/8d2d201c24d0e24d89ab85857987a11fe4c9a892))
* **client:** prevent InvalidCharacterError when parsing RCO markdown … ([bc8fc4f](https://github.com/refugies-info/karfur/commit/bc8fc4f007447042734cf346c74b746cd37cb7ce))
* **client:** prevent InvalidCharacterError when parsing RCO markdown with time notations ([e240c02](https://github.com/refugies-info/karfur/commit/e240c023cab32a380df3158acaa31fc6c9c234fd))
* **client:** prevent recherche build crash from eager mongo schema loading ([d9e5101](https://github.com/refugies-info/karfur/commit/d9e510198fe971c01903f62a2c2712f579c925c4))
* **client:** replace `any` with inferred types in webhook handlers ([5873add](https://github.com/refugies-info/karfur/commit/5873adda11cd9e47f735857e6e7093213fd86368))
* **client:** resolve translations from MongoDB documents for search results ([f22689f](https://github.com/refugies-info/karfur/commit/f22689f18b9928ef676f7cba845134a724f68a69))
* **client:** resolve type errors with react-markdown and union types ([71757e9](https://github.com/refugies-info/karfur/commit/71757e90f0465206bc0c986c298b38c295ee496f))
* **client:** restore language tooltip labels in admin users table ([99f09a0](https://github.com/refugies-info/karfur/commit/99f09a0a0a649fb8003a8b265142286e4b6a75aa))
* **client:** update help center link in sitemap ([9321105](https://github.com/refugies-info/karfur/commit/9321105b50e0002fb08b49c6892996f62e3e604b))
* **client:** update installer l'application and help center links in sitemap ([bb24d7d](https://github.com/refugies-info/karfur/commit/bb24d7d370920dba644fcb38d2cff7e1b728253e))
* **client:** update installer l'application link in sitemap ([24ed955](https://github.com/refugies-info/karfur/commit/24ed9553efe0cec8885ef368ee98ba6f1b749345))
* **client:** upgrade next to 15.5.7 and lodash to ^4.17.21 ([4691694](https://github.com/refugies-info/karfur/commit/4691694a1d45fa6bd02869a6b7467fee04338b4f))
* **client:** upgrade next to 15.5.7 and lodash to ^4.17.21 ([9fe4e50](https://github.com/refugies-info/karfur/commit/9fe4e50f2fee86ba86ed20d8fc0a7689b7810b6c))
* **client:** use any param type for cache wrappers (speedgoose augments Aggregate) ([42caf6d](https://github.com/refugies-info/karfur/commit/42caf6d51832ac68c5537e109ea422fe172361da))
* **client:** use timing-safe comparison for webhook secret validation ([d2599aa](https://github.com/refugies-info/karfur/commit/d2599aa20d0c1b050710606dfe7052fdeaec4de8))
* conditionally call getDispositifMainSponsor only if mainSponsor exists on the dispositif object. ([56c5ac2](https://github.com/refugies-info/karfur/commit/56c5ac2341e319cd9a998506a0ba490b6962a17b))
* Correctly track accordion open event in view mode ([7718e81](https://github.com/refugies-info/karfur/commit/7718e812dd3078fb51e0270ff46cae8847d07815))
* **deps:** add overrides for HIGH/MEDIUM dependabot security alerts ([59023ea](https://github.com/refugies-info/karfur/commit/59023ea8dec8f26d427dc57954f5aed8284d55d7))
* **deps:** address Dependabot security alerts (next, flatted, fast-xml-parser) ([a8d0a62](https://github.com/refugies-info/karfur/commit/a8d0a62b0c461283f599416978dc1b7a966d8a5e))
* **deps:** bump next from 15.5.9 to 15.5.10 with lockfile ([9165308](https://github.com/refugies-info/karfur/commit/9165308d0a3a5a01abd52b73da2f97f987bc1751))
* **deps:** bump next from 15.5.9 to 15.5.10 with lockfile ([4d1e220](https://github.com/refugies-info/karfur/commit/4d1e2207a03c1f422dca70e78781cee026d503de))
* **deps:** patch critical/high severity vulnerabilities from Dependabot ([e2158da](https://github.com/refugies-info/karfur/commit/e2158da84da83a29656571f05004d8566d8b0c88))
* **deps:** update Next.js to 15.5.14 in storybook ([e78fe00](https://github.com/refugies-info/karfur/commit/e78fe00d8b4646ab8422a7295a3221b51a881671))
* downgrade Storybook and related addon versions to 10.1.8 ([ca42f6b](https://github.com/refugies-info/karfur/commit/ca42f6b8f849ba2bcc431d8ab6b02705fde2e162))
* editmode empty blocks visibility ([1682cbb](https://github.com/refugies-info/karfur/commit/1682cbb5da75c82d53ecd55d56b6fe371edf83c6))
* Ensure `p.roles` is an array before filtering and mapping in `getContentById` workflow. ([39abaab](https://github.com/refugies-info/karfur/commit/39abaab5f2a2759110d9ae89012e5faaf0cf4753))
* Extract client IP from the last entry in x-forwarded-for header and reformat code for readability. ([683b000](https://github.com/refugies-info/karfur/commit/683b00004a5aa7a5416ecbede995638932becbad))
* filter out invalid sponsors and log a warning when structure is not found ([bd72d85](https://github.com/refugies-info/karfur/commit/bd72d85c0dac1f71c58919e50d0e50a5cee7810d))
* handle cross-origin preview ([336dd27](https://github.com/refugies-info/karfur/commit/336dd279042dd99fea0dfc4938f815ec54401ee4))
* improve team card accessibility by adding `aria-hidden` ([368cf9f](https://github.com/refugies-info/karfur/commit/368cf9f1d87467314c825942ddeea9540743647f))
* missing WEBHOOK_SECRET env var ([616c69d](https://github.com/refugies-info/karfur/commit/616c69d9866b3f3288bb0b7640e1f56ba2fd93c5))
* **mobile:** add explicit height to TextInput ([ef2b083](https://github.com/refugies-info/karfur/commit/ef2b083d4471a7db419d272c967a55195fd3e743))
* **mobile:** add explicit height to TextInput for visibility ([988f8a4](https://github.com/refugies-info/karfur/commit/988f8a49b7db5005370f9aa768f545291f07f48c))
* **mobile:** add text color to search input ([4adec76](https://github.com/refugies-info/karfur/commit/4adec76c60b9e39ecbc7066a1a7ca346d029e343))
* **mobile:** disable New Architecture for react-native-maps compatibility ([e6f4541](https://github.com/refugies-info/karfur/commit/e6f45415a98d5b596243c91a14bda1c43c3dfb33))
* **mobile:** pin typescript and expo versions for compatibility ([6bf164b](https://github.com/refugies-info/karfur/commit/6bf164b11cc54cea1517121e8efeb7de014c224f))
* **mobile:** replace type assertion with type guard ([4a651f4](https://github.com/refugies-info/karfur/commit/4a651f41ea70f5f78631f1552d578d96d9d0f233))
* **mobile:** Resolve "Loss of precision" crash in Explorer Carousel ([8d53eb2](https://github.com/refugies-info/karfur/commit/8d53eb21bbcfdc76778d819cf4270b7142435492))
* **mobile:** restore user-facing version field to fix iOS submission ([e297585](https://github.com/refugies-info/karfur/commit/e2975857ae20bb47b85a59d513f815f6b66a050b))
* **mobile:** set text color via style prop for RN compatibility ([9fddb00](https://github.com/refugies-info/karfur/commit/9fddb001252d9acbe2d9574e6b36eb1e494b4f9e))
* **mobile:** skip version check in development builds ([868f7d9](https://github.com/refugies-info/karfur/commit/868f7d9d72c20a62d4dac400cd110ac761fd3924))
* **mobile:** use inline style prop for TextInput ([4380baf](https://github.com/refugies-info/karfur/commit/4380baf89bb3cf35bdd45a4d7eb3caaca8c6f403))
* **mobile:** use isDevelopmentBuild() to skip OfflinePage in dev builds ([4512daf](https://github.com/refugies-info/karfur/commit/4512dafb3c22b4b4fc33b9af8ec073f54a99ffac))
* mock remark-directive and unist-util-visit to resolve ESM errors in Jest setup ([affd9d2](https://github.com/refugies-info/karfur/commit/affd9d24b865cf348d958574fd894afe59742e37))
* **mongo:** add HMR-safe model exports to prevent OverwriteModelError ([d59b393](https://github.com/refugies-info/karfur/commit/d59b3933c2ce783b2676cda1e595b31dcf7be8f3))
* **mongo:** fix type annotation in Dispositif model export ([515c5ff](https://github.com/refugies-info/karfur/commit/515c5fffc679374f2fc7fd8c817e6702189a867d))
* **mongo:** restore theme translated labels in runtime responses ([5e7d86a](https://github.com/refugies-info/karfur/commit/5e7d86a98d8efce705cd79eeff1bee75d19800a9))
* pass to Twilio if brevo fails (not just code error) ([3842643](https://github.com/refugies-info/karfur/commit/384264335c80aa8c2a8dc435cff66fb92207cb16))
* Prioritize explicit `fr` translation during merging and improve error message extraction in the webhook. ([bf755b8](https://github.com/refugies-info/karfur/commit/bf755b85610102f27bc357a07ca3d8212e2fa825))
* Refine RTL sorting logic in TagsCarousel and update Firebase and gesture handler dependencies. ([292cba4](https://github.com/refugies-info/karfur/commit/292cba481123c8ef734a9851ad481fdbb6256111))
* regenerate pnpm-lock.yaml to resolve ERR_PNPM_BROKEN_LOCKFILE ([f609a23](https://github.com/refugies-info/karfur/commit/f609a2338703b67933aa96b557231b5f6444c174))
* remove unused [@ts-expect-error](https://github.com/ts-expect-error) in client tests ([c3b34a2](https://github.com/refugies-info/karfur/commit/c3b34a2a0c366290150d117d7db3165613d61c6d))
* reset ordered list markers to resolve DSFR styling issues ([812904a](https://github.com/refugies-info/karfur/commit/812904a66b5ec74d471d231606bcfd89145f6d1a))
* resolve 404 errors on content fetch ([dce0e92](https://github.com/refugies-info/karfur/commit/dce0e921b6fdc864b914686c6c81bdb4a4c2bccf))
* resolve build and type errors in server, mobile, and client ([d345098](https://github.com/refugies-info/karfur/commit/d345098033ccafa4f09393699a1957fdd4422a88))
* resolve duplicate lockfile entries after merge from dev ([fe777ec](https://github.com/refugies-info/karfur/commit/fe777ece69ec9ea35c4149b169401b5d9c5b6e10))
* safely access `dispositif.participants` array to prevent errors. ([1b245b4](https://github.com/refugies-info/karfur/commit/1b245b4d266719497d9c727b4d77998184c09a37))
* scope list marker reset to `.prose` elements ([d656ef2](https://github.com/refugies-info/karfur/commit/d656ef2a61d0367c7cdace009dc70cef6dcb6fef))
* **server:** add default port 8080 for local development ([75223e4](https://github.com/refugies-info/karfur/commit/75223e471c0b6e7779c6b0ea3de96f54e1a0e12f))
* **server:** add explicit return annotations for dispositif repository queries ([c4b6f28](https://github.com/refugies-info/karfur/commit/c4b6f28c0cd8ef02758c6167eaabfc2ce6ef7261))
* **server:** avoid /user/all crash when user has no structures ([bd8347d](https://github.com/refugies-info/karfur/commit/bd8347dc1815c229a921d099500b2876b77f3c1a))
* **server:** await DB/cache initialization before accepting requests ([62ab8b8](https://github.com/refugies-info/karfur/commit/62ab8b86638a0e454623fe0543bce060f897bdf6))
* **server:** correct veto logic in consentsToEmail ([aef0413](https://github.com/refugies-info/karfur/commit/aef04139d37f857e4d68f04921d02d0318e5f9c8))
* **server:** disable publishedFiche emails for réseau Mens structure ([cce61d0](https://github.com/refugies-info/karfur/commit/cce61d025703b86fa50f2440ad6b984189b9e4cf))
* **server:** downgrade @types/express to v4 to match express ^4.22.1 ([3e319f6](https://github.com/refugies-info/karfur/commit/3e319f6d3a9e8504a002143a394cbb5df0cf4d19))
* **server:** fix check:types failures after merge ([db4f06a](https://github.com/refugies-info/karfur/commit/db4f06a1d0e2ba0f777700a7f3bdf2a484f78de5))
* **server:** handle missing merci array in getAllDispositifs ([9d45b96](https://github.com/refugies-info/karfur/commit/9d45b96ed20ae81f3d658491dceed8e105c1d0cd))
* **server:** only apply structure prefs when structureId is provided ([f935107](https://github.com/refugies-info/karfur/commit/f935107f6b271283ffdcac9fbbe9436006bb1ffc))
* **server:** remove all `as any` casts from structure and user workflows ([5472c42](https://github.com/refugies-info/karfur/commit/5472c429d3a293c59e11d66697909ce3a22c3676))
* **server:** remove membership check for structure-level email prefs (RI-1154) ([#3610](https://github.com/refugies-info/karfur/issues/3610)) ([275dbdf](https://github.com/refugies-info/karfur/commit/275dbdf52617719cac93fab131f6d4427f3b7f6b))
* **server:** resolve dual-mongoose instance causing test failures ([00253fc](https://github.com/refugies-info/karfur/commit/00253fc6b9014755ef9aeb7cc4aba86f71b691d6))
* **server:** resolve type assignment error in content retrieval workflow ([19810a6](https://github.com/refugies-info/karfur/commit/19810a62394fa73a107a5d85f118622997b0f17b))
* **server:** resolve Zod/Mongoose validation issues via type patching ([d80356b](https://github.com/refugies-info/karfur/commit/d80356b26a74e756a7e82198ea473346bea86fea))
* **server:** set ficheArchived to false for réseau Mens in mail prefs ([94dbbec](https://github.com/refugies-info/karfur/commit/94dbbec162bf67d82691645afa6b603090b9eb47))
* **server:** split mail PREFS into user-level and structure-level ([6e88a22](https://github.com/refugies-info/karfur/commit/6e88a22ac7d2f65ff7de79193cd27b7285436995))
* **server:** update deleteUser test for new sendAccountDeletedMailService signature ([53cd052](https://github.com/refugies-info/karfur/commit/53cd052eba3d5b77282af4a243079612df9e49ff))
* **server:** use error code instead of message for Brevo duplicate contact check ([5976c9b](https://github.com/refugies-info/karfur/commit/5976c9b9e11c9ec46438737403e2d71fce1c53ee))
* **server:** verify membership before applying structure-level prefs ([3c42a33](https://github.com/refugies-info/karfur/commit/3c42a3388926885e241f9c622843a4c7db942b2c))
* sms 500 error ([26dd427](https://github.com/refugies-info/karfur/commit/26dd427baae434f2cff44e100809c313b7a5ff13))
* strengthen minimum app version regex validation ([4e906e4](https://github.com/refugies-info/karfur/commit/4e906e4683cc94538af5cbfa33cb5b0d1e19f35f))
* themes selection bug ([d41b0ba](https://github.com/refugies-info/karfur/commit/d41b0ba69d2896bd7d27f6fcb1ccbda856be043c))
* themes selection bug ([8a39444](https://github.com/refugies-info/karfur/commit/8a394442f8cc2f2ed0ba525ff206326dec412492))
* **tooling:** update knip.json to include server controllers and workflows ([f441d99](https://github.com/refugies-info/karfur/commit/f441d99d118e44c30f0f6472461734b13d5406ac))
* **ui:** add role='img' to breadcrumb icon to satisfy a11y rules ([b9ea233](https://github.com/refugies-info/karfur/commit/b9ea2339e5d23605b3b874640deaeecf4ac4597b))
* Update contact details for Habitat et Humanisme in Aveyron. ([a85c1c1](https://github.com/refugies-info/karfur/commit/a85c1c12a5ad81447ccbe86f9224846dceabd843))
* Update contact details for Habitat et Humanisme in Aveyron. ([56c0d1b](https://github.com/refugies-info/karfur/commit/56c0d1b180cab4c3641c5fd5053bb8b5eb374bee))
* Update external links for the "Work Together" cards. ([f484545](https://github.com/refugies-info/karfur/commit/f484545445c7caf684d4f0cdc35e3ad9ea278373))
* Update external links for the "Work Together" cards. ([c8c8c41](https://github.com/refugies-info/karfur/commit/c8c8c41e5d87da6cdc3e142b9c2b3bd212c04c3d))
* Update search count environment variable to `NEXT_PUBLIC` and refine aria label spacing for filter options. ([7617588](https://github.com/refugies-info/karfur/commit/7617588e1e676b754d8e4dabb663e19e454fbc5e))
* **workspace:** bump undici override to ^7.21.0 to satisfy jsdom 28 requirement ([5c688bb](https://github.com/refugies-info/karfur/commit/5c688bbc8f2333ee060e9aada77b63091ab3368d))
* **workspace:** prevent NaN age conversion crashes in search ([08a7dad](https://github.com/refugies-info/karfur/commit/08a7dad7f628d20f6809e32fb53fed38db17ead9))
* **workspace:** remove node_modules from .worktreeinclude ([6008c42](https://github.com/refugies-info/karfur/commit/6008c42bdcef137d3d4c0c3f52f81d8be2c551fa))
* **workspace:** replace --fill with -b '' in pr:stg and pr:prod scripts ([e389823](https://github.com/refugies-info/karfur/commit/e389823cd3bd00992d61283c9c4d75616aaca93c))
* **workspace:** use --fill for pr:stg and pr:prod to auto-populate PR body with commits ([082af12](https://github.com/refugies-info/karfur/commit/082af1240603030d39c0afa68038799889da51b3))


### Performance Improvements

* memoize `handleExpandedChange` function with `useCallback` ([12a7066](https://github.com/refugies-info/karfur/commit/12a7066d1b0512d1c7bba1926f555ce5799ed4c4))
* **server:** fix /traduction/statistics causing cascading 503 errors ([d9f6a65](https://github.com/refugies-info/karfur/commit/d9f6a65b4e1f736a6199007fbe556f1c62a1edbc))
* **server:** replace live nbWordsTranslated scan with stored counter ([5bd24ff](https://github.com/refugies-info/karfur/commit/5bd24ff54942b9bb7a44ba3bb6d8105e7798c3bb))
