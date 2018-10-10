module.exports = {
  /**
   * Determines if error returned from webpack contains *only* linter errors.
   * @param stats The webpack stats object passed to the callback after running.
   * @returns {boolean}
   */
  isLintOnlyErrors(stats) {
    if (stats.compilation.errors && stats.compilation.errors.length > 0) {
      return [
        'syntax error', // ES
        'parsing error', // ES
        'unexpected token', // Riot
        'error compiling template', // Vue
      ].every(errorString =>
        !stats.compilation.errors[0].message.toLowerCase().includes(errorString.toLowerCase())
      );
    }
    return false;
  },
};
