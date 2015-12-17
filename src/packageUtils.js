
import _ from 'lodash';
import semver from 'semver';

export const DEPS_GROUPS = [
  { name: 'production', field: 'dependencies' },
  { name: 'development', field: 'devDependencies' },
  { name: 'optional', field: 'optionalDependencies' }
];

export const Violations = {
  INVALID: 'INVALID',
  LOCAL_DEPENDENCY: 'LOCAL_DEPENDENCY',
  GIT_DEPENDENCY: 'GIT_DEPENDENCY'
};

export function findModuleDepsGroup(moduleName, packageJson) {
  for (const group of _.pluck(DEPS_GROUPS, 'field')) {
    const modules = packageJson[group];
    if (modules && modules[moduleName]) {
      return modules;
    }
  }
  return null;
}

export function getModuleVersion(moduleName, packageJson) {
  const depsGroup = findModuleDepsGroup(moduleName, packageJson);
  return depsGroup ? depsGroup[moduleName] : null;
}

export function isValidVersion(moduleName, version) {

  const returnError = (type) => {
    return {
      moduleName,
      version,
      type
    };
  };

  if (version && version.indexOf('file:') === 0) {
    return returnError(Violations.LOCAL_DEPENDENCY);
  }

  if (version && version.indexOf('git') === 0) {
    return returnError(Violations.GIT_DEPENDENCY);
  }

  if (semver.clean(version.trim()) === null) {
    return returnError(Violations.INVALID);
  }

  return true;

}
