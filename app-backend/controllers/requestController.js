const requestModel = require("../models/requestModel.js");

exports.createRequest = async (req, res) => {
  console.log("Call to create request: ", req.body);
  try {
    const request = new requestModel({
      userId: req.userId,
      ...req.body,
    });
    await request.save();
    res.status(201).json(request);
  } catch (e) {
    console.error("Error creating request:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getRequests = async (req, res) => {
  console.log("Call to get requests");
  try {
    const requests = await requestModel.find({});
    res.json(requests);
  } catch (e) {
    console.error("Error retrieving requests:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const request = await requestModel
      .findById(req.params.id)
      .populate("userId");
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(404).json({ error: "Request not found" });
    }
    console.error("Error retrieving request by ID:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const request = await requestModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json(request);
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(404).json({ error: "Request not found" });
    }
    console.error("Error updating request:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await requestModel.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    res.json({ message: "Request deleted successfully" });
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(404).json({ error: "Request not found" });
    }
    console.error("Error deleting request:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getRequestsByUser = async (req, res) => {
  console.log("Call to get requests by user", req.query);
  const id = req.query.id;
  try {
    const requests = await requestModel.find({ userId: id });
    res.json(requests);
    console.log("Requests by user:", requests);
  } catch (e) {
    console.error("Error retrieving requests by user:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};
