import express from "express";
import Badge from "../../../models/Badge.js";

const router = express.Router();

router.get("/api/get-selected-badges", async (req, res) => {
  const { storeId } = req.query;

  try {
    const badgeDoc = await Badge.findOne({ storeId });

    if (badgeDoc) {
      res.status(200).json({ success: true, selectedBadges: badgeDoc.selectedBadges });
    } else {
      res.status(404).json({ success: false, message: "No badges found for this store" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch badges", error });
  }
});

export default router;
