const dotenv = require("dotenv");
/**
 * Init environment config
 */
module.exports.loadConfig = function () {
  const env = `${process.env.ENV}.env`;
  const envConfig = dotenv.config({ path: env }).parsed;
  for (const key in envConfig) {
    const value = process.env[key];
    if (!value) {
      console.error("Environment config invalid");
      throw new Error(`Environment variable '${key}' not load`);
    }
  }
};
