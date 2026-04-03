const Pincode = require("../models/Pincode");
const { Parser } = require("json2csv");

// A. GET /api/states — Return distinct states
exports.getStates = async (req, res) => {
  try {
    const states = await Pincode.distinct("state");
    states.sort();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch states" });
  }
};

// B. GET /api/states/:state/districts — Return districts for a state
exports.getDistricts = async (req, res) => {
  try {
    const { state } = req.params;
    const districts = await Pincode.distinct("district", {
      state: state.toUpperCase(),
    });
    districts.sort();
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch districts" });
  }
};

// C. GET /api/states/:state/districts/:district/taluks — Return taluks
exports.getTaluks = async (req, res) => {
  try {
    const { state, district } = req.params;
    const taluks = await Pincode.distinct("taluk", {
      state: state.toUpperCase(),
      district: district.toUpperCase(),
    });
    taluks.sort();
    res.json(taluks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch taluks" });
  }
};

// D. GET /api/pincodes — Filtered + paginated list
exports.getPincodes = async (req, res) => {
  try {
    const { state, district, taluk, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (state) filter.state = state.toUpperCase();
    if (district) filter.district = district.toUpperCase();
    if (taluk) filter.taluk = taluk.toUpperCase();

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Pincode.find(filter)
        .skip(skip)
        .limit(limitNum)
        .select("-__v -createdAt -updatedAt")
        .lean(),
      Pincode.countDocuments(filter),
    ]);

    res.json({
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pincodes" });
  }
};

// E. GET /api/search?q= — Partial search
exports.searchPincodes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const regex = new RegExp(q.trim(), "i");
    const results = await Pincode.find({
      $or: [
        { pincode: regex },
        { officeName: regex },
        { district: regex },
      ],
    })
      .limit(30)
      .select("pincode officeName district state deliveryStatus")
      .lean();

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
};

// F. GET /api/pincode/:pincode — Full details of one PIN code
exports.getPincodeDetail = async (req, res) => {
  try {
    const { pincode } = req.params;
    const results = await Pincode.find({ pincode })
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "PIN code not found" });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pincode details" });
  }
};

// G. GET /api/stats — Overview stats
exports.getStats = async (req, res) => {
  try {
    const [totalPincodes, totalStates, deliveryOffices, nonDeliveryOffices] =
      await Promise.all([
        Pincode.countDocuments(),
        Pincode.distinct("state").then((s) => s.length),
        Pincode.countDocuments({ deliveryStatus: "DELIVERY" }),
        Pincode.countDocuments({ deliveryStatus: "NON-DELIVERY" }),
      ]);

    res.json({
      totalPincodes,
      totalStates,
      deliveryOffices,
      nonDeliveryOffices,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// H. GET /api/stats/state-distribution — Count per state
exports.getStateDistribution = async (req, res) => {
  try {
    const distribution = await Pincode.aggregate([
      { $group: { _id: "$state", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { state: "$_id", count: 1, _id: 0 } },
    ]);

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch state distribution" });
  }
};

// I. GET /api/stats/delivery-distribution — Delivery vs non-delivery
exports.getDeliveryDistribution = async (req, res) => {
  try {
    const distribution = await Pincode.aggregate([
      { $group: { _id: "$deliveryStatus", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);

    res.json(distribution);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch delivery distribution" });
  }
};

// J. GET /api/export — Export filtered data as CSV
exports.exportData = async (req, res) => {
  try {
    const { state, district, taluk } = req.query;
    const filter = {};

    if (state) filter.state = state.toUpperCase();
    if (district) filter.district = district.toUpperCase();
    if (taluk) filter.taluk = taluk.toUpperCase();

    const data = await Pincode.find(filter)
      .select("-__v -_id -createdAt -updatedAt")
      .lean();

    if (data.length === 0) {
      return res.status(404).json({ error: "No data found for export" });
    }

    const fields = [
      "pincode",
      "officeName",
      "district",
      "state",
      "taluk",
      "deliveryStatus",
      "branchType",
      "divisionName",
      "regionName",
      "circleName",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.header(
      "Content-Disposition",
      "attachment; filename=pincode_data.csv"
    );
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: "Export failed" });
  }
};
