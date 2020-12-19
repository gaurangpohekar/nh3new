const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
const URI = process.env.mongo_url;
const connectDB = async () => {
  await mongoose.connect(
    URI,
    { useUnifiedTopology: true },
    { useNewUrlParser: true },
    { useUnifiedTopology: true },
    { useFindAndModify: false },
    { useCreateIndex: true }
  );
  console.log("connected");
};
connectDB();
app.use(cors());
var sensorDataSchema = mongoose.Schema(
  {
    nh3_1: String,
    nh3_2: String,
    nh3_3: String,
    nh3_4: String,
    nh3_5: String,
    nh3_6: String,
    dateTime: String,
  },
  { collection: "test" }
);
const sensor = mongoose.model("test", sensorDataSchema);

app.get("/all", function (req, res) {
  console.log("sent");
  sensor.find({}, function (err, sendata) {
    if (err) {
      console.log(err);
    } else {
      res.json(sendata);
    }
  });
});

app.get("/id", function (req, res) {
  sensor.distinct("mac", function (err, sendata) {
    if (err) {
      console.log(err);
    } else {
      res.json(sendata);
    }
  });
});

app.post("/getone", function (req, res) {
  const id = req.body.id;
  console.log(id);
  sensor.find({ mac: id }, function (err, sendata) {
    if (err) {
      console.log(err);
    } else {
      res.json(sendata);
    }
  });
});
app.post("/daydata",async (req,res)=>{
  const date=req.body.date
  console.log(date);
  const data = await sensor.find({
    "dateTime": { $regex: `.*${date}.*` },})

    console.log(data);
    res.json(data)

})

app.post("/putdata", function (req, res) {
  const nh3_1 = req.body.nh3_1;
  const nh3_2 = req.body.nh3_2;
  const nh3_3 = req.body.nh3_3;
  const nh3_4 = req.body.nh3_4;
  const nh3_5 = req.body.nh3_5;
  const nh3_6 = req.body.nh3_6;
  const data = req.body;
 if(data.dateTime===""){
    res.send("not sent")
  }else{
    sensor.create(data);
    res.send("sent");
  }
});

app.listen(process.env.PORT || 9000);
