
import _ from 'lodash';

export const DEPS_GROUPS = [
  { name: 'production', field: 'dependencies' },
  { name: 'development', field: 'devDependencies' },
  { name: 'optional', field: 'optionalDependencies' }
];

export function getDepsGroup(groupName) {
  return _.find(DEPS_GROUPS, (group) => group.name === groupName) || null;
}

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
