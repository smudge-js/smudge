- x.upgrade npm packages
- x.clean up webpack/build/configs/npm scripts
- x.clean up linter/formatter configs
- x.document build scripts and linter/formatter tools
- publish images to npm
- clean out old sketches/files
- make the build smaller 353/1130
  - replace gl-matrix 174/219
  - replace lodash with native or try es-lodash 25/27
  - lazy load float 16 27/28

* break up p5.js into files https://www.typescriptlang.org/docs/handbook/namespaces.html

depcruise --exclude "anode_modules" --output-type dot src | dot -T svg > dependencygraph.svg
