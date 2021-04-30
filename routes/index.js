var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

var myDb = async function () {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("wasilisha");
  return { db: db, client: client };
};

// insert function
function insert(dta, colctn) {
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("wasilisha");
      var myobj = dta;
      dbo.collection(colctn).insertOne(myobj, function (err, resp) {
        if (err) throw err;
        db.close();
      });
    }
  );
}

//end insert
router.post("/postproduct", async function (req, res, next) {
  insert(req.body, "products");
  res.send({ message: "success" });
});

//update product
router.post("/updateproduct", async function (req, res, next) {
  console.log(req.body);
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("wasilisha");
      var myquery = { _id: req.body._id };
      var newvalues = {
        $set: {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          cartegory: req.body.cartegory,
        },
      };
      dbo
        .collection("products")
        .updateOne(myquery, newvalues, function (err, resp) {
          if (err) throw err;
          res.send("success");
          db.close();
        });
    }
  );
});
//reg vendor
router.post("/vendorregister", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("vendors")
    .find({ phone: req.body.phone })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ message: "User exists" });
  } else {
    insert(req.body, "vendors");
    res.send({ message: "success" });
  }
});

//brief content
router.post("/briefContent", async function (req, res, next) {
  console.log(req.body);
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("products")
    .find({ phone: req.body.user })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ items: items });
  } else {
    res.send({ message: "no records" });
  }
});

//login vendor
router.post("/vendorlogin", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("vendors")
    .find({ phone: req.body.user, password: req.body.password })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ message: "success" });
  } else {
    res.send({ message: "User Does not exist" });
  }
});

router.get("/delete", async function (req, res, next) {
  var dbVitals = await myDb();
  var myquery = { _id: ObjectId("607fd470800e0c026454ed87") };
  const items = await dbVitals.db
    .collection("products")
    .deleteOne(myquery, function (err, obj) {
      if (err) {
        console.log(err);
      }
      if (obj) {
        console.log("1 document deleted");
      }
    });

  items;
  //dbVitals.client.close();
});

module.exports = router;
