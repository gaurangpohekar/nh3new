const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
const URI = process.env.mongo_url;
const connectDB = async () => {
  await mongoose.connect(
    URI,
    { useUnifiedTopology: true },
    { useNewUrlParser: true }
  );
  console.log("connected");
};
connectDB();
app.use(cors());

const airSchema = new mongoose.Schema(
  {
    date: { type: String },
    time: { type: String },
    CO: { type: String },
    PT08: [
      {
        S1: { type: String },
        S2: { type: String },
        S3: { type: String },
        S4: { type: String },
        S5: { type: String },
      },
    ],
    NHMC: { type: String },
    C6H6: { type: String },
    NOx: { type: String },
    NO2: { type: String },
    T: { type: String },
    RH: { type: String },
    AH: { type: String },
  },
  { collection: "AirQuality" }
);
const AirQuality = mongoose.model("AirQuality", airSchema);

app.get("/", function (req, res) {
  var queryparam = req.query;
  console.log(queryparam.limit);
  AirQuality.find({}, function (err, airqual) {
    if (err) {
      console.log(err);
    } else {
      res.json(airqual.splice(0, 2000));
    }
  });
});

app.listen(process.env.PORT || 9000);
