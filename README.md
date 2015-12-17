npm-lint-locked
=========================

Simple linter for package versions in your package.json file. It's better to keep them locked, without version range.

Of course, having concrete versions in your package.json file doesn't give you 100% sure, because a dependency with a specific version itself can depend on another packages with a version range.

But anyway, it's better to keep your package.json sane without versions range.

Use [npm-lockdown](https://github.com/mozilla/npm-lockdown) in you want to have concrete subdependencies.

## Features

* Gives error message if any dependency in non-fixed.
* Gives a warning message in case if you have local dependency or git dependency.

## Installation

```bash
npm install npm-lint-locked --save-dev
```

## Usage

Run npm-lint-locked in the root directory of your Node.js project (it must contain package.json that you want to lint):

```bash
cd ~/my-projects/my-node-project
npm-lint-locked
```

Use it in `npm scripts`:

```json
...,
"scripts": {
  ...
  "lint": "./node_modules/.bin/npm-lint-locked",
  "prebuild": "npm run lint"
}
```

or in your task runner, passing package.json explicitly:

```js

var gulp = require('gulp');
var npmLintLocked = require('npm-lint-locked');

gulp.task('lintDependencies', function() {
  npmLintLocked(require('../package.json'));
});

```

## License

[MIT](LICENSE)
