/* global describe, it */

import expect from 'expect';

import { isValidVersion, Violations } from '../src/packageUtils';

describe('packageUtils', () => {

  it('isValidVersion', () => {

    const moduleName = 'test-package';

    [
      ['1.2.3', true],
      [' 4.2.1 ', true],
      ['1.2.3-4', true],
      ['1.2.3-pre', true],
      ['=v1.3.5', true],
      ['v1.2.3', true],
      [' v1.3.1', true],
      ['\t1.25.1', true]
    ].forEach((tuple) => {
      const [ version, expectation ] = tuple;
      expect(isValidVersion(moduleName, version)).toEqual(expectation);
    });

    [
      ['>1.2.3', Violations.INVALID ],
      ['~1.2.3', Violations.INVALID ],
      ['<=1.2.3', Violations.INVALID ],
      ['1.2.x', Violations.INVALID ],
      ['<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0', Violations.INVALID ],
      ['*', Violations.INVALID ],
      ['2.x', Violations.INVALID ],
      ['latest', Violations.INVALID ],
      ['file:../test-package', Violations.LOCAL_DEPENDENCY ],
      ['file//../test-package', Violations.INVALID ],
      ['suevalov/npm-lint-locked', Violations.INVALID ],
      ['http://asdf.com/asdf.tar.gz', Violations.INVALID ],
      ['git://github.com/user/project.git', Violations.GIT_DEPENDENCY ],
      ['git+https://user@hostname/project/blah.git#ce12s1', Violations.GIT_DEPENDENCY],
      ['git+ssh://user@hostname/project.git', Violations.GIT_DEPENDENCY]
    ].forEach((tuple) => {
      const [ version, expectation ] = tuple;
      expect(isValidVersion(moduleName, version)).toEqual({
        moduleName,
        version,
        type: expectation
      });
    });

  });

});
