/* eslint-disable no-console */

import _ from 'lodash';
import chalk from 'chalk';

import { isValidVersion, Violations } from './packageUtils';

module.exports = function lintLocked(packageJson = {}) {

  console.log(`Analizing ${packageJson.name} package...`);

  const violations = [];
  const warnings = [];

  [ 'devDependencies', 'dependencies', 'optionalDependencies' ].forEach((groupName) => {

    const deps = _.pairs(packageJson[groupName]);

    deps.forEach((pair) => {

      const [ name, version ] = pair;

      const isValid = isValidVersion(name, version);

      if (isValid !== true) {
        switch (isValid.type) {
          case Violations.LOCAL_DEPENDENCY:
            warnings.push(`Your npm file has local dependency: ${name}: ${version}.`);
            break;
          case Violations.GIT_DEPENDENCY:
            warnings.push(`Your npm file has git dependency to ${name}: ${version}.`);
            break;
          default:
            violations.push(`"${name}": "${version}"`);
        }
      }

    });

  });

  if (warnings.length) {
    console.log(chalk.yellow(`Found ${warnings.length} warnings!`));
    warnings.forEach((message) => console.log(chalk.yellow(message)));
    console.log(chalk.yellow(`Don't commit it.`));
  }

  if (violations.length) {
    console.log(chalk.red(`Found ${violations.length} non-fixed dependencies!`));
    violations.forEach((message) => console.log(chalk.red(message)));
    console.error(`You have ${violations.length} errors. Fix your package.json to proceed.`);
    process.exit();
  }

  if (violations.length === 0 && warnings.length === 0) {
    console.log(chalk.green('Package.json is valid. Well done!'));
  }

};
