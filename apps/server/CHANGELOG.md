# Changelog

## [2.3.1](https://github.com/refugies-info/karfur/compare/server-v2.3.0...server-v2.3.1) (2026-03-23)


### Performance Improvements

* **server:** fix /traduction/statistics causing cascading 503 errors ([d9f6a65](https://github.com/refugies-info/karfur/commit/d9f6a65b4e1f736a6199007fbe556f1c62a1edbc))

## [2.3.0](https://github.com/refugies-info/karfur/compare/server-v2.2.1...server-v2.3.0) (2026-03-23)


### Features

* add MailEvent to typegoose exports ([c76338f](https://github.com/refugies-info/karfur/commit/c76338f292f31297a38e81401d8feaee17f20334))
* Add utility functions for flexible dispositif translation retrieval and language availability, and improve content type guards for content and markdown. ([8d615a3](https://github.com/refugies-info/karfur/commit/8d615a30d945ae9de69f0208987598b9f583696b))
* allow dispositif sponsors to be string IDs or objects and updat… ([4713791](https://github.com/refugies-info/karfur/commit/47137912933cffd5c6b1d5c55ee7a8f4820c4284))
* allow dispositif sponsors to be string IDs or objects and update form handling accordingly ([6411c7c](https://github.com/refugies-info/karfur/commit/6411c7cd90e519481ed6dfd0e6431f6033ec1727))
* **client:** add training sessions display for RCO dispositifs ([5729031](https://github.com/refugies-info/karfur/commit/5729031636a3e4fd44a4cbeb348e487649f2b445))
* Filter dispositifs by origin "RI" and safely calculate `nbMerci… ([a7b3093](https://github.com/refugies-info/karfur/commit/a7b3093a5a26bdc215d4dd2b2cc18cb77fa7d95b))
* Filter dispositifs by origin "RI" and safely calculate `nbMercis` in `getAllDispositifs` workflow. ([f1e4dfa](https://github.com/refugies-info/karfur/commit/f1e4dfa357dfae73be73f1e0f36d7fd78d0fb156))
* Filter user contributions by `DispositifOrigin.RI` on the clien… ([30a2f1f](https://github.com/refugies-info/karfur/commit/30a2f1f6cb5d809a1552b2424f6d1689a18b9de1))
* Filter user contributions by `DispositifOrigin.RI` on the client and ensure the `origin` field is fetched with improved null-safety on the server. ([dfd8bf5](https://github.com/refugies-info/karfur/commit/dfd8bf5ea842cccddea14cead43f5fc68e42407a))
* flatten Dispositif schema maps and add robust translation handling to `getContentById` workflow. ([c5fb597](https://github.com/refugies-info/karfur/commit/c5fb59797cacab4e290b88e5594049424e15d06d))
* implement dispositif webhook ([a8b0025](https://github.com/refugies-info/karfur/commit/a8b0025075bb40e4281e8cc23d862592ae1cd4f7))
* implement dispositif webhook ([0f7f7d7](https://github.com/refugies-info/karfur/commit/0f7f7d7a055bd5d2e5107bafca6df19462162925))
* Introduce shared markdown utilities package to correctly parse and render markdown directives in client and mobile applications. ([61753c4](https://github.com/refugies-info/karfur/commit/61753c4f31794dbd2425f602cced51b69231057b))
* migrate to Biome ([3650328](https://github.com/refugies-info/karfur/commit/3650328a12505636bc36b16af5438c92517bc093))
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
* **rco:** enable markdown rendering for RCO documents ([1156826](https://github.com/refugies-info/karfur/commit/1156826f6ed4e46a9aba93dab9fd71bb9945062b))
* **rco:** enable markdown rendering for RCO documents ([84b1026](https://github.com/refugies-info/karfur/commit/84b1026198f860b8418f3f36faf2f9a34d20baad))
* Refactor dispositif sessions to a `SessionsMetadata` object, in… ([cc27a93](https://github.com/refugies-info/karfur/commit/cc27a93a4fc9d1c9dd1841cceccb0ec0d6c27eca))
* Refactor dispositif sessions to a `SessionsMetadata` object, introducing `modalitesEntreesSorties` and encapsulating session items. ([8e87df1](https://github.com/refugies-info/karfur/commit/8e87df14b79c53dc213d6db80d8f22bc46e3e496))
* **server,client:** add speedgoose caching to high-traffic query paths ([b2eb211](https://github.com/refugies-info/karfur/commit/b2eb211962a3864477783067b17aace2f0e49df7))
* **server:** add mail restriction for réseau MENS structure (R-1108) ([f0cad64](https://github.com/refugies-info/karfur/commit/f0cad6454604d00f46f7f329e04c0851732c88b2))
* **server:** migrate brevo connector to @getbrevo/brevo v5 SDK ([bc05590](https://github.com/refugies-info/karfur/commit/bc05590b913fedc62c8084ef11e1d9e1ac02caec))
* **types:** add exclusive DispositifContent validation for structured vs markdown content ([6ec357b](https://github.com/refugies-info/karfur/commit/6ec357b4763adb19e3c6e48cba789e2b3876162d))


### Bug Fixes

* add optional chaining to `getMainSponsor()` to safely access sponsor picture. ([291c47d](https://github.com/refugies-info/karfur/commit/291c47d312d645b6f422e24ad10c64dab59cb36d))
* conditionally call getDispositifMainSponsor only if mainSponsor exists on the dispositif object. ([56c5ac2](https://github.com/refugies-info/karfur/commit/56c5ac2341e319cd9a998506a0ba490b6962a17b))
* Ensure `p.roles` is an array before filtering and mapping in `getContentById` workflow. ([39abaab](https://github.com/refugies-info/karfur/commit/39abaab5f2a2759110d9ae89012e5faaf0cf4753))
* **mongo:** add HMR-safe model exports to prevent OverwriteModelError ([d59b393](https://github.com/refugies-info/karfur/commit/d59b3933c2ce783b2676cda1e595b31dcf7be8f3))
* **mongo:** fix type annotation in Dispositif model export ([515c5ff](https://github.com/refugies-info/karfur/commit/515c5fffc679374f2fc7fd8c817e6702189a867d))
* pass to Twilio if brevo fails (not just code error) ([3842643](https://github.com/refugies-info/karfur/commit/384264335c80aa8c2a8dc435cff66fb92207cb16))
* resolve 404 errors on content fetch ([dce0e92](https://github.com/refugies-info/karfur/commit/dce0e921b6fdc864b914686c6c81bdb4a4c2bccf))
* resolve build and type errors in server, mobile, and client ([d345098](https://github.com/refugies-info/karfur/commit/d345098033ccafa4f09393699a1957fdd4422a88))
* safely access `dispositif.participants` array to prevent errors. ([1b245b4](https://github.com/refugies-info/karfur/commit/1b245b4d266719497d9c727b4d77998184c09a37))
* **server:** add explicit return annotations for dispositif repository queries ([c4b6f28](https://github.com/refugies-info/karfur/commit/c4b6f28c0cd8ef02758c6167eaabfc2ce6ef7261))
* **server:** avoid /user/all crash when user has no structures ([bd8347d](https://github.com/refugies-info/karfur/commit/bd8347dc1815c229a921d099500b2876b77f3c1a))
* **server:** correct veto logic in consentsToEmail ([aef0413](https://github.com/refugies-info/karfur/commit/aef04139d37f857e4d68f04921d02d0318e5f9c8))
* **server:** disable publishedFiche emails for réseau Mens structure ([cce61d0](https://github.com/refugies-info/karfur/commit/cce61d025703b86fa50f2440ad6b984189b9e4cf))
* **server:** downgrade @types/express to v4 to match express ^4.22.1 ([3e319f6](https://github.com/refugies-info/karfur/commit/3e319f6d3a9e8504a002143a394cbb5df0cf4d19))
* **server:** fix check:types failures after merge ([db4f06a](https://github.com/refugies-info/karfur/commit/db4f06a1d0e2ba0f777700a7f3bdf2a484f78de5))
* **server:** handle missing merci array in getAllDispositifs ([9d45b96](https://github.com/refugies-info/karfur/commit/9d45b96ed20ae81f3d658491dceed8e105c1d0cd))
* **server:** only apply structure prefs when structureId is provided ([f935107](https://github.com/refugies-info/karfur/commit/f935107f6b271283ffdcac9fbbe9436006bb1ffc))
* **server:** remove all `as any` casts from structure and user workflows ([5472c42](https://github.com/refugies-info/karfur/commit/5472c429d3a293c59e11d66697909ce3a22c3676))
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
