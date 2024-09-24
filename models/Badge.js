import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: true,
  },
  selectedBadges: {
    type: [String], // Array of badge IDs or names
    required: true,
  },
});

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;
