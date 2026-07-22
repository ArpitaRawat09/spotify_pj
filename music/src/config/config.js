import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const _config = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/spotify-music",
  JWT_SECRET: process.env.JWT_SECRET,
};

export default Object.freeze(_config);
