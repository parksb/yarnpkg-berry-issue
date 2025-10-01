module.exports = {
  name: 'plugin-custom-protocol',
  factory: function(require) {
    const {structUtils} = require('@yarnpkg/core');

    return {
      default: {
        hooks: {
          reduceDependency(dependency, project) {
            if (!dependency.range.startsWith('custom-protocol:')) {
              return dependency;
            }

            const version = dependency.range.slice('custom-protocol:'.length);

            return structUtils.makeDescriptor(
              structUtils.makeIdent(dependency.scope, dependency.name),
              `npm:${version}` // Just custom-protocol maps to npm
            );
          }
        }
      }
    };
  }
};

// Other implementation using a custom resolver.
// module.exports = {
//   name: 'plugin-custom-protocol',
//   factory: function(require) {
//     const {structUtils} = require('@yarnpkg/core');
//
//     class TestProtocolResolver {
//       supportsDescriptor(descriptor, opts) {
//         return descriptor.range.startsWith('custom-protocol:');
//       }
//
//       supportsLocator(locator, opts) {
//         return locator.reference.startsWith('custom-protocol:');
//       }
//
//       shouldPersistResolution(locator, opts) {
//         return false;
//       }
//
//       bindDescriptor(descriptor, fromLocator, opts) {
//         return descriptor;
//       }
//
//       getResolutionDependencies(descriptor, opts) {
//         return {};
//       }
//
//       async getCandidates(descriptor, dependencies, opts) {
//         const version = descriptor.range.slice('custom-protocol:'.length);
//         const npmDescriptor = structUtils.makeDescriptor(
//           descriptor,
//           `npm:${version}`
//         );
//
//         return opts.resolver.getCandidates(npmDescriptor, dependencies, opts);
//       }
//
//       async getSatisfying(descriptor, dependencies, locators, opts) {
//         return opts.resolver.getSatisfying(descriptor, dependencies, locators, opts);
//       }
//
//       async resolve(locator, opts) {
//         return opts.resolver.resolve(locator, opts);
//       }
//     }
//
//     return {
//       resolvers: [TestProtocolResolver],
//     };
//   }
// };
