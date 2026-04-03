const express = require("express");
const router = express.Router();
const {
  getStates,
  getDistricts,
  getTaluks,
  getPincodes,
  searchPincodes,
  getPincodeDetail,
  getStats,
  getStateDistribution,
  getDeliveryDistribution,
  exportData,
} = require("../controllers/pincodeController");

// Filter endpoints
router.get("/states", getStates);
router.get("/states/:state/districts", getDistricts);
router.get("/states/:state/districts/:district/taluks", getTaluks);

// Data endpoints
router.get("/pincodes", getPincodes);
router.get("/search", searchPincodes);
router.get("/pincode/:pincode", getPincodeDetail);

// Stats endpoints
router.get("/stats", getStats);
router.get("/stats/state-distribution", getStateDistribution);
router.get("/stats/delivery-distribution", getDeliveryDistribution);

// Export endpoint
router.get("/export", exportData);

module.exports = router;
