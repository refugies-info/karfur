# Changelog

## [2.3.0](https://github.com/refugies-info/karfur/compare/api-types-v2.2.1...api-types-v2.3.0) (2026-03-23)


### Features

* Add utility functions for flexible dispositif translation retrieval and language availability, and improve content type guards for content and markdown. ([8d615a3](https://github.com/refugies-info/karfur/commit/8d615a30d945ae9de69f0208987598b9f583696b))
* allow dispositif sponsors to be string IDs or objects and updat… ([4713791](https://github.com/refugies-info/karfur/commit/47137912933cffd5c6b1d5c55ee7a8f4820c4284))
* allow dispositif sponsors to be string IDs or objects and update form handling accordingly ([6411c7c](https://github.com/refugies-info/karfur/commit/6411c7cd90e519481ed6dfd0e6431f6033ec1727))
* **client:** add training sessions display for RCO dispositifs ([5729031](https://github.com/refugies-info/karfur/commit/5729031636a3e4fd44a4cbeb348e487649f2b445))
* migrate to Biome ([3650328](https://github.com/refugies-info/karfur/commit/3650328a12505636bc36b16af5438c92517bc093))
* **migration:** migrate Structure to @refugies-info/mongo ([c30f6e0](https://github.com/refugies-info/karfur/commit/c30f6e073f90de19babf78dff5734ca24981d2ab))
* **rco:** enable markdown rendering for RCO documents ([1156826](https://github.com/refugies-info/karfur/commit/1156826f6ed4e46a9aba93dab9fd71bb9945062b))
* **rco:** enable markdown rendering for RCO documents ([84b1026](https://github.com/refugies-info/karfur/commit/84b1026198f860b8418f3f36faf2f9a34d20baad))
* Refactor dispositif sessions to a `SessionsMetadata` object, in… ([cc27a93](https://github.com/refugies-info/karfur/commit/cc27a93a4fc9d1c9dd1841cceccb0ec0d6c27eca))
* Refactor dispositif sessions to a `SessionsMetadata` object, introducing `modalitesEntreesSorties` and encapsulating session items. ([8e87df1](https://github.com/refugies-info/karfur/commit/8e87df14b79c53dc213d6db80d8f22bc46e3e496))
* **types:** add exclusive DispositifContent validation for structured vs markdown content ([6ec357b](https://github.com/refugies-info/karfur/commit/6ec357b4763adb19e3c6e48cba789e2b3876162d))


### Bug Fixes

* **api:** replace never type with undefined to resolve tsoa error ([03f150e](https://github.com/refugies-info/karfur/commit/03f150ef7d69d2adbe0fe66ca9346b5b7fa3a5dd))
* **api:** strictly exclude conflicting fields when markdown is present ([22ecee5](https://github.com/refugies-info/karfur/commit/22ecee58c89f16bf1717316c8df054b2d261d344))
