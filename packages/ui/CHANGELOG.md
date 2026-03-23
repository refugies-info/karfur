# Changelog

## [2.3.0](https://github.com/refugies-info/karfur/compare/ui-v2.2.1...ui-v2.3.0) (2026-03-23)


### Features

* Add map control translation keys and internationalize map control messages. ([78fe295](https://github.com/refugies-info/karfur/commit/78fe29502e479fae68ac9df7624c068087f79608))
* internationalize map's accessibility label and remove marker click event propagation. ([205c7ef](https://github.com/refugies-info/karfur/commit/205c7ef816a719fe97b5f48ffd53c97a41896fef))
* Introduce RIAccordion component with custom styling and step number support, replacing direct DSFR Accordion usage in client and markdown directives. ([21fb9ac](https://github.com/refugies-info/karfur/commit/21fb9ac093596474f05a87a9c85f53234034a8ec))
* **map:** improve accessibility of map controls, markers, and popups with ARIA attributes and keyboard navigation. ([9d615ea](https://github.com/refugies-info/karfur/commit/9d615ea844c266d0d2fc00c7df6b461a1c8bb939))
* migrate to Biome ([3650328](https://github.com/refugies-info/karfur/commit/3650328a12505636bc36b16af5438c92517bc093))
* **migration:** migrate Structure to @refugies-info/mongo ([c30f6e0](https://github.com/refugies-info/karfur/commit/c30f6e073f90de19babf78dff5734ca24981d2ab))
* remove custom hierarchical ordered list styling and grid layout for list items ([e086f19](https://github.com/refugies-info/karfur/commit/e086f19d13899845a83907c6529bfd927d9d7ca9))


### Bug Fixes

* Add cleanup for map zoom event listener to prevent memory leaks. ([01ec6c5](https://github.com/refugies-info/karfur/commit/01ec6c5facb3ff48d4de276e66cec29c990bc85a))
* reset ordered list markers to resolve DSFR styling issues ([812904a](https://github.com/refugies-info/karfur/commit/812904a66b5ec74d471d231606bcfd89145f6d1a))
* scope list marker reset to `.prose` elements ([d656ef2](https://github.com/refugies-info/karfur/commit/d656ef2a61d0367c7cdace009dc70cef6dcb6fef))
* **ui:** add role='img' to breadcrumb icon to satisfy a11y rules ([b9ea233](https://github.com/refugies-info/karfur/commit/b9ea2339e5d23605b3b874640deaeecf4ac4597b))
* **ui:** remove duplicate code in VoteLayoutStandard component ([bb4e1c3](https://github.com/refugies-info/karfur/commit/bb4e1c3493aaded194792344bfe9bfe4c2e8ee75))
* **ui:** remove unused vote dependency from VoteLayout useEffect hooks ([5be7aa3](https://github.com/refugies-info/karfur/commit/5be7aa31a022c7d77d62e6ce396a72da36211ae1))
