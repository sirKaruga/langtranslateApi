var express = require("express");
var router = express.Router();
var ObjectId = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;
//var url = "mongodb://localhost:27017/";

var url =
  "mongodb+srv://dennis:karuga@cluster0.0mtvw.mongodb.net/wasilisha?retryWrites=true&w=majority";

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

////////////////////////
/////////////////////////
//routes
router.post("/postproduct", async function (req, res, next) {
  insert(req.body, "unfiltered");
  res.send({ message: "success" });
});

//tester
router.post("/tester", async function (req, res, next) {
  res.send({ message: "success" });
});

//receive order
router.post("/process_order", async function (req, res, next) {
  insert(req.body, "orders");
  res.send({ message: "success" });
});

//place_order
router.post("/place_order", async function (req, res, next) {
  insert(req.body, "orders");
  res.send({ message: "success" });
});

///fetch_orders
router.post("/fetch_orders", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db.collection("orders").find().toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ items });
  } else {
    res.send({ message: "no records" });
  }
});

///get vendor name
router.post("/get_vendor_name", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("vendors")
    .find({ phone: req.body.phone })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ items });
  } else {
    res.send({ message: "no records" });
  }
});

//get product by id
router.post("/getproduct_cart_products", async function (req, res, next) {
  var dbVitals = await myDb();
  var fullCart = [];
  req.body.products.forEach(async (element) => {
    const item = await dbVitals.db
      .collection("products")
      .findOne({ _id: ObjectId(element) });
    fullCart.push(item);
    //console.log(item);
  });
  // dbVitals.client.close();
  setTimeout(() => {
    res.send({ fullCart });
  }, 500);
});

//get product category
router.post("/getproduct_cat", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("products")
    .find({ cartegory: req.body.cartegory })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ items });
  } else {
    res.send({ message: "no records" });
  }
});

//get product by id
router.post("/getproduct_by_id", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("products")
    .find({ _id: ObjectId(req.body.location) })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ items });
  } else {
    res.send({ message: "no records" });
  }
});

//update product
router.post("/updateproduct", async function (req, res, next) {
  console.log(req.body._id);
  MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("wasilisha");
      var myquery = { _id: ObjectId(req.body._id) };
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

//customerregister
router.post("/customerregister", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("customers")
    .find({ phone: req.body.phone })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ message: "User exists" });
  } else {
    insert(req.body, "customers");
    res.send({ message: "success" });
  }
});

//brief content
router.post("/briefContent", async function (req, res, next) {
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

//unfiltered items
router.post("/all_unfiltered", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db.collection("unfiltered").find().toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ items: items });
  } else {
    res.send({ message: "no records" });
  }
});

//all products content
router.post("/all_products", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db.collection("products").find().toArray();
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

//find_vendor
router.post("/find_vendor", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("vendors")
    .find({ phone: req.body.user })
    .toArray();
  dbVitals.client.close();
  if (items.length > 0) {
    res.send({ items });
  } else {
    res.send({ message: "User Does not exist" });
  }
});

//find_customer
router.post("/find_customer", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("customers")
    .find({ phone: req.body.phone })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ items });
  } else {
    res.send({ message: "User Does not exist" });
  }
});

///search_item
router.post("/search_item", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("products")
    .find({ name: { $regex: req.body.searchV } })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ items });
  } else {
    res.send({ message: "No such product" });
  }
});
//customerlogin
router.post("/customerlogin", async function (req, res, next) {
  var dbVitals = await myDb();
  const items = await dbVitals.db
    .collection("customers")
    .find({ phone: req.body.user, password: req.body.password })
    .toArray();
  dbVitals.client.close();
  if (items.length >= 1) {
    res.send({ message: "success" });
  } else {
    res.send({ message: "User Does not exist" });
  }
});

//delete product
router.post("/delete_product", async function (req, res, next) {
  console.log(req.body.deleteID);
  var dbVitals = await myDb();
  var myquery = { _id: ObjectId(req.body.deleteID) };
  const items = await dbVitals.db
    .collection("products")
    .deleteOne(myquery, function (err, obj) {
      if (err) {
        console.log(err);
      }
      if (obj) {
        res.send({ message: "success" });
      }
    });

  items;
});

//reject unfiltered product
router.post("/delete_unfiltered", async function (req, res, next) {
  console.log(req.body.deleteID);
  var dbVitals = await myDb();
  var myquery = { _id: ObjectId(req.body.deleteID) };
  const items = await dbVitals.db
    .collection("unfiltered")
    .deleteOne(myquery, function (err, obj) {
      if (err) {
        console.log(err);
      }
      if (obj) {
        res.send({ message: "success" });
      }
    });

  items;
});

//approve unfiltered product
router.post("/approve_unfiltered", async function (req, res, next) {
  console.log(req.body.filterID);

  async function delP() {
    var dbVitals = await myDb();
    var myquery = { _id: ObjectId(req.body.deleteID) };
    const items = await dbVitals.db
      .collection("unfiltered")
      .deleteOne(myquery, function (err, obj) {
        if (err) {
          console.log(err);
        }
        if (obj) {
          console.log("delete success");
        }
      });
    items;
  }
  async function collector() {
    var dbVitals = await myDb();
    const items = await dbVitals.db
      .collection("unfiltered")
      .findOne({ _id: ObjectId(req.body.filterID) });
    dbVitals.client.close();
    insert(items, "products");
  }

  ////
  collector();
  delP();
  res.send({ message: "success" });
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
