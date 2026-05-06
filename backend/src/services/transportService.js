import { Transport } from "../models/Transport.js";
import { DEFAULT_TRANSPORTS } from "../utils/constants.js";

export const ensureDefaultTransports = async () => {
  const existing = await Transport.find({
    normalizedName: {
      $in: DEFAULT_TRANSPORTS.map((name) => name.toLowerCase()),
    },
  }).select("normalizedName");

  const existingSet = new Set(existing.map((item) => item.normalizedName));
  const missing = DEFAULT_TRANSPORTS.filter((name) => !existingSet.has(name.toLowerCase()));

  if (missing.length > 0) {
    await Transport.insertMany(
      missing.map((name) => ({
        name,
        normalizedName: name.toLowerCase(),
      }))
    );
  }
};
