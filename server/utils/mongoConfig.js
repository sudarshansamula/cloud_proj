const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

module.exports = { MongoDB_URI: process.env.MongoDB_URI };
