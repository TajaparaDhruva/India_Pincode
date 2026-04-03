const mongoose = require("mongoose");

const pincodeSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      index: true,
    },
    officeName: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      index: true,
    },
    taluk: {
      type: String,
      default: "",
    },
    deliveryStatus: {
      type: String,
      default: "",
    },
    branchType: {
      type: String,
      default: "",
    },
    divisionName: {
      type: String,
      default: "",
    },
    regionName: {
      type: String,
      default: "",
    },
    circleName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Text index for search across multiple fields
pincodeSchema.index(
  { officeName: "text", district: "text", pincode: "text" },
  { name: "search_index" }
);

// Compound index for cascading filter queries
pincodeSchema.index({ state: 1, district: 1, taluk: 1 });

module.exports = mongoose.model("Pincode", pincodeSchema);
