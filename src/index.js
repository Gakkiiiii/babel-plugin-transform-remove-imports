
export default function () {
  return {
    name: "transform-remove-imports",
    visitor: {
      // https://babeljs.io/docs/en/babel-types#importdeclaration
      ImportDeclaration(path, state) {

        const { node } = path;
        const { source } = node;
        const { opts = {} } = state;

        if (opts.removeAll) {
          path.remove();
          return;
        }

        if (!opts.test) {
          console.warn("transform-remove-imports: \"test\" option should be specified");
          return;
        }

        /** @var {string} importName */
        const importName = (source && source.value ? source.value : undefined);
        const isMatch = testMatches(importName, opts.test);

        // https://github.com/uiwjs/babel-plugin-transform-remove-imports/issues/3
        if (opts.remove === 'effects') {
          if (node.specifiers && node.specifiers.length === 0 && importName && isMatch) {
            path.remove();
          }
          return;
        }

        if (importName && isMatch) {
          path.remove();
        }

      },
    }
  };
}


/**
 * Determines if the import matches the specified tests.
 *
 * @param {string} importName
 * @param {RegExp|RegExp[]|string|string[]} test
 * @returns {Boolean}
 */
function testMatches(importName, test) {

  // Normalizing tests
  const tests = Array.isArray(test) ? test : [test];

  // Finding out if at least one test matches
  return tests.some(regex => {
    if (typeof regex === "string") {
      regex = new RegExp(regex);
    }
    return regex.test(importName || '');
  });

}
