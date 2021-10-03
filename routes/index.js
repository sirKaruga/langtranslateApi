var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;
var unirest = require("unirest");
//var url = "mongodb://localhost:27017/";
var url =
  "mongodb+srv://dennis:karuga@cluster0.0mtvw.mongodb.net/temporary?retryWrites=true&w=majority";
var myDb = async function () {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("temporary");
  return { db: db, client: client };
};

// insert function
function insert(dta, colctn) {
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("temporary");
      var myobj = dta;
      dbo.collection(colctn).insertOne(myobj, function (err, resp) {
        if (err) throw err;
        db.close();
      });
    }
  );
}
//end insert

//*************************************************************************************************************************************************** */
// var appointments = {// };
// router.get("/fix", async function (req, res, next) {
//   Object.entries(appointments).forEach((item) => {
//     if (typeof item[1] === "object") {
//       Object.entries(item[1]).forEach((item2) => {
//         //console.log("passwords." + item2[0] + " => " + item2[1]);

//         insert(
//           {
//             key: item[0] + "." + item2[0],
//             English: item2[1],
//             Kiswahili: "",
//             French: "",
//             Indonesia: "",
//           },
//           "register_form"
//         );
//       });
//     } else {
//       //console.log(item[0] + " => " + item[1]);
//       insert(
//         {
//           key: item[0],
//           English: item[1],
//           Kiswahili: "",
//           French: "",
//           Indonesia: "",
//         },
//         "register_form"
//       );
//     }
//   });

//   res.send({ message: "form register populated" });
// });
//*************************************************************************************************************************************************** */
//routes
router.post("/postproduct", async function (req, res, next) {
  insert(req.body, "items");
  res.send({ message: "success" });
});

///get vendor name
router.post("/record", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("items")
    .find({ key: req.body.key })
    .toArray();
  //get items
  const items2 = await dbVitals.db.collection("items").find().toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send(items2);
  } else {
    insert(
      {
        key: req.body.key,
        English: req.body.onEdit,
        Kiswahili: "",
        French: "",
        Indonesia: "",
      },
      "items"
    );
    res.send(items2);
  }
});

///get item

router.get("/record", async function (req, res, next) {
  var dbVitals = await myDb();
  //get items
  const items2 = await dbVitals.db.collection("items").find().toArray();
  dbVitals.client.close();
  res.send(items2.reverse());
});

///save reanslation
router.post("/save", async function (req, res, next) {
  if (req.body.language !== "English") {
    var dbVitals = await myDb();
    dbVitals.db
      .collection("items")
      .updateOne(
        { key: req.body.key },
        { $set: { [req.body.language]: req.body.onEdit } }
      );
    const items2 = await dbVitals.db.collection("items").find().toArray();
    dbVitals.client.close();
    res.send(items2.reverse());
  } else {
    res.send("Err, You not allowed to edit english for safety purposes");
  }
});

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router;
