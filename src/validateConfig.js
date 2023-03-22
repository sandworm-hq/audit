const {UsageError} = require('./errors');

const SUPPORTED_SEVERITIES = ['critical', 'high', 'moderate', 'low'];

module.exports = ({
  appPath,
  dependencyGraph,
  licensePolicy,
  loadDataFrom,
  maxDepth,
  minDisplayedSeverity,
  onProgress,
  output,
  width,
}) => {
  if (!appPath) {
    throw new UsageError(
      'Application path is required - please provide the path to a directory containing your manifest and a lockfile.',
    );
  }
  if (
    dependencyGraph &&
    (!dependencyGraph.root || !dependencyGraph.all || !dependencyGraph.prodDependencies)
  ) {
    throw new UsageError(
      'Provided dependency graph is invalid - missing one or more required fields.',
    );
  }
  if (!SUPPORTED_SEVERITIES.includes(minDisplayedSeverity)) {
    throw new UsageError(
      `\`minDisplayedSeverity\` must be one of ${SUPPORTED_SEVERITIES.map((s) => `\`${s}\``).join(
        ', ',
      )}.`,
    );
  }
  if (!Number.isInteger(width)) {
    throw new UsageError('Width must be a valid integer.');
  }
  if (!Number.isInteger(maxDepth)) {
    throw new UsageError('Max depth must be a valid integer.');
  }
  if (!['registry', 'disk'].includes(loadDataFrom)) {
    throw new UsageError('`loadDataFrom` must be one of `registry`, `disk`.');
  }
  if (typeof onProgress !== 'function') {
    throw new UsageError('`onProgress` must be a function.');
  }
  if (licensePolicy) {
    if (typeof licensePolicy !== 'object') {
      throw new UsageError('License policy must be a valid object.');
    }
    Object.entries(licensePolicy).forEach(([severity, data]) => {
      if (!SUPPORTED_SEVERITIES.includes(severity)) {
        throw new UsageError(
          `License policy keys must be one of ${SUPPORTED_SEVERITIES.map((s) => `\`${s}\``).join(
            ', ',
          )}.`,
        );
      }
      if (!Array.isArray(data)) {
        throw new UsageError(`License policy values must be arrays of strings.`);
      }
    });
  }

  if (!Array.isArray(output)) {
    throw new UsageError('`output` must be an array.');
  } else {
    output.forEach((type) => {
      if (!['tree', 'treemap', 'csv'].includes(type)) {
        throw new UsageError('`output` elements must be one of "tree", "treemap", or "csv".');
      }
    });
  }
};
