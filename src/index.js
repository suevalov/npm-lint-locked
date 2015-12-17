import fs from 'fs';
import _ from 'lodash';
import chalk from 'chalk';

import { getDepsGroup } from './packageUtils';

export default function lintLocked(filePath, appender = global.console) {

  const json = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
  appender.log(json);

  const violations = [];
  const warnings = [];

  [ 'production', 'development', 'optional' ].forEach((groupName) => {

    const deps = _.pairs(getDepsGroup(groupName));

    deps.forEach((pair) => {

      const [ name, version ] = pair;

      if (version && version.indexOf('file:') === 0) {
        warnings.push(`Your npm file has local dependency to ${version}. Don't commit it.`);
      } else if (version && (version.indexOf('git:') === 0 || version.indexOf('git@') === 0)) {
        warnings.push(`Your npm file has git dependency to ${version}. Don\'t commit it.`);
      } else {
        if (!version || _.isNaN(parseInt(version.charAt(0), 10))) {
          violations.push(`Package ${name} should have fixed version. Current version is {version}`);
        }
      }

    });

  });

  if (warnings.length) {
    appender.log(chalk.yellow(`Found ${warnings.length} warnings!`));
    warnings.forEach((message) => appender.log(chalk.yellow(message)));
  }

  if (violations.length) {
    appender.log(chalk.red(`Found ${violations.length} non-fixed dependencies!`));
    violations.forEach((message) => appender.log(chalk.red(message)));
    throw new Error(`You have ${violations.length} errors. Fix your package.json to proceed.`);
  } else {
    appender.log(chalk.green('Package.json is valid. Well done!'));
  }

}
