const dataModel = require("../models/dataModel.js");
const anomalyModel = require("../models/anomalyModel");
const locationModel = require("../models/locationModel");

exports.showAllData = async (req, res) => {
  try {
    res.json(await dataModel.find({}));
  } catch (e) {
    res.json(e);
  }
};

exports.getLatestData = async (req, res) => {
  try {
    const { location, attribute } = req.query;

    if (!location) {
      return res.status(400).json({
        error: "Missing required query parameter",
      });
    }

    const query = {
      location,
    };

    let latestData;
    if (attribute) {
      query[attribute] = { $exists: true };
      latestData = await dataModel
        .findOne(query, { [attribute]: 1, _id: 0 })
        .sort({ timestamp: -1 })
        .limit(1);
    } else {
      latestData = await dataModel
        .findOne(query, { _id: 0 })
        .sort({ timestamp: -1 })
        .limit(1);
    }

    if (!latestData) {
      return res.status(404).json({
        error:
          "No data found for the specified location" +
          (attribute ? ` and attribute: ${attribute}` : ""),
      });
    }

    res.json(latestData);
  } catch (e) {
    console.error("Error retrieving latest data:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getMaxDataInTimespan = async (req, res) => {
  try {
    const { location, attribute, timespan } = req.query;

    if (!location) {
      return res.status(400).json({
        error: "Missing required query parameter: location",
      });
    }

    let query = { location };

    if (timespan) {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 1);
      const startTime = new Date(
        currentTime.getTime() - timespan * (60 * 60 * 1000)
      );

      query = {
        ...query,
        timestamp: { $gte: startTime, $lt: currentTime.toISOString() },
      };
    }

    let maxData;
    if (attribute) {
      query[attribute] = { $exists: true };
      maxData = await dataModel
        .findOne(query, { [attribute]: 1, timestamp: 1, _id: 0 })
        .sort({ [attribute]: -1 })
        .limit(1);
    } else {
      maxData = await dataModel
        .findOne(query, { _id: 0 })
        .sort({ timestamp: -1 })
        .limit(1);
    }

    if (!maxData) {
      return res.status(404).json({
        error: "No data found for the specified location and timespan",
      });
    }

    res.json(maxData);
  } catch (e) {
    console.error("Error retrieving maximum data:", e.message);
    console.error("Stack trace:", e.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAvgDataInTimespan = async (req, res) => {
  try {
    const { location, attribute, timespan } = req.query;
    if (!location) {
      return res.status(400).json({
        error: "Missing required query parameter: location",
      });
    }

    let query = { location };

    let startTime, currentTime;
    if (timespan) {
      currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 1);
      startTime = new Date(currentTime.getTime() - timespan * (60 * 60 * 1000));

      query = {
        ...query,
        timestamp: { $gte: startTime, $lt: currentTime },
      };
    }

    let averageData;
    if (attribute) {
      query[attribute] = { $exists: true };
      const result = await dataModel.aggregate([
        { $match: query },
        { $group: { _id: null, average: { $avg: `$${attribute}` } } },
      ]);

      averageData = result.length > 0 ? result[0].average : null;
    } else {
      const allAttributesAvg = await dataModel.aggregate([
        { $match: query },
        {
          $project: {
            _id: 0,
            avgValues: {
              $objectToArray: "$$ROOT",
            },
          },
        },
        {
          $unwind: "$avgValues",
        },
        {
          $match: {
            "avgValues.k": { $ne: "_id" },
          },
        },
        {
          $group: {
            _id: "$avgValues.k",
            average: { $avg: "$avgValues.v" },
          },
        },
      ]);

      averageData = allAttributesAvg.reduce((acc, { _id, average }) => {
        acc[_id] = average;
        return acc;
      }, {});
    }

    if (averageData === null) {
      return res.status(404).json({
        error: "No data found for the specified location and timespan",
      });
    }

    const response = {
      average: averageData,
      timespan: timespan
        ? {
            startTime: startTime.toISOString(),
            endTime: currentTime.toISOString(),
          }
        : null,
    };

    res.json(response);
  } catch (e) {
    console.error("Error retrieving average data:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getMinDataInTimespan = async (req, res) => {
  try {
    const { location, attribute, timespan } = req.query;
    if (!location) {
      return res.status(400).json({
        error: "Missing required query parameter: location",
      });
    }

    let query = { location };

    if (timespan) {
      const currentTime = new Date();
      currentTime.setHours(currentTime.getHours() + 1);
      const startTime = new Date(
        currentTime.getTime() - timespan * (60 * 60 * 1000)
      );

      query = {
        ...query,
        timestamp: { $gte: startTime, $lt: currentTime },
      };
    }

    let minData;
    if (attribute) {
      query[attribute] = { $exists: true };
      minData = await dataModel
        .findOne(query, { [attribute]: 1, timestamp: 1, _id: 0 })
        .sort({ [attribute]: 1 })
        .limit(1);
    } else {
      minData = await dataModel
        .findOne(query, { _id: 0 })
        .sort({ timestamp: 1 })
        .limit(1);
    }

    if (!minData) {
      return res.status(404).json({
        error: "No data found for the specified location and timespan",
      });
    }

    res.json(minData);
  } catch (e) {
    console.error("Error retrieving minimum data:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.createData = async (req, res) => {
  try {
    const data = new dataModel(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (e) {
    console.error("Error creating data:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await dataModel.distinct("location");
    res.status(200).json({ locations });
  } catch (e) {
    console.error("Error retrieving locations:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getDataInTimespan = async (req, res) => {
  try {
    const { location, hours } = req.query;

    if (!location) {
      return res.status(400).json({
        error: "Missing required query parameter: location",
      });
    }

    let query = { location };

    if (isNaN(hours)) {
      freq = 10;
    } else {
      freq = 1;
    }

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    const startTime = new Date(currentTime.getTime() - hours * 60 * 60 * 1000);

    query = {
      ...query,
      timestamp: { $gte: startTime, $lt: currentTime },
    };

    const data = await dataModel.aggregate([
      { $match: query },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" },
            minute: { $floor: { $divide: [{ $minute: "$timestamp" }, freq] } },
          },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $project: { _id: 0, sensorId: 0 } },
    ]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: "No data found for the specified location and timespan",
      });
    }

    res.json(data);
  } catch (e) {
    console.error("Error retrieving data in timespan:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getAnomalies = async (req, res) => {
  try {
    const { location, attribute } = req.query;
    const query = {};

    if (location) {
      query.location = location;
    }

    if (attribute) {
      query.attribute = attribute;
    }

    const anomalies = await anomalyModel.find(query);

    if (!anomalies || anomalies.length === 0) {
      return res.status(404).json({
        error: "No anomalies found",
      });
    }

    res.json(anomalies);
  } catch (e) {
    console.error("Error retrieving anomalies:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getAllCoordinates = async (req, res) => {
  try {
    const locations = await locationModel.find({});
    res.json(locations);;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
