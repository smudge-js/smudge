# Smudge JS

Library for creating computational graphics with physically based materials.

Smudge JS is an experimental library for creating procedurally generated images that use physically based material propoperties like albedo, metallic, smoothness, and height. Smudge JS can export texture sets for use with Unity's standard shader or other physically based rendering pipelines.

Inspired by p5, Substance Designer, and Unity.

## Scripts

`npm run build` Builds the smudge-p5 api.

`npm run watch` Builds the smudge-p5 api amd rebuilds on file changes.

`npm run serve` Builds the smudge-p5 api and serves index.html on [http://localhost:8080/]

`npm run blog` Builds and runs the project blog on [http://127.0.0.1:4000/pbr5/]

`npm run doc` Builds the docs with typedoc.

`npm run np` Publishes to npm

## Tools

This project is set up to use prettier + tslint for code formatting + liniting.

You should run the Prettier extension when working on this code to make sure it is formatted correctly.

You probably want to enable format on save in your settings file.

```
"editor.formatOnSave": true
```
