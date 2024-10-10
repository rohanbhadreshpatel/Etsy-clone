const express = require("express");
const app = express();
const cors = require("cors");

const connection = require("./connectionPooling");
const mysql = require("mysql");
const dbdata = require("./config.json");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const path = require("path");
const fs = require("fs");
const multer = require("multer");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    secret: "cmpe273-etsy-clone",
    resave: false,
    saveUninitialized: true,
    activeDuration: 60 * 60 * 1000,
    duration: 5 * 60 * 1000,
    // cookie: {
    //     expires: 60 * 60 * 24 * 1000
    // }
  })
);

app.use(
  cors({
    origin: dbdata.frontEnd,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const bcrypt = require("bcrypt");
const { timeStamp } = require("console");
const saltRounds = 10;

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(8000, () => {
  console.log("NodeJS server running!");
});

app.use(cors({ origin: dbdata.frontEnd, credentials: true }));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

connection.getConnection((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("pool created");
  }
});

app.post("/login", function (req, res) {
  console.log("Inside login POST");
  console.log("Request Body: ", req.body);

  //Query

  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      //Login validation query
      var sql =
        "SELECT * from login_credentials WHERE Email = " +
        mysql.escape(req.body.email) +
        ";";
      conn.query(sql, function (err, result) {
        console.log("Result obj: " + result[0]);
        console.log("Email == " + req.body.email);
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });
          console.log("Error " + err);
          res.end("Invalid Credentials!1");
          console.log("Invalid Credentials1!");
        } else {
          console.log("Result body: " + result);
          if (result.length == 0) {
            console.log("Result Length = 0");
          } else if (
            !bcrypt.compareSync(req.body.password, result[0].Password)
          ) {
            res.writeHead(201, {
              "Content-type": "text/plain",
            });
            console.log("Invalid Credentials2!");
            res.end("Invalid Credentials2!");
          } else {
            console.log(result);
            console.log("Cookie Message:" + result[0].Name);
            req.session.user = result;
            res.cookie("cookie", result[0].ProfileId, {
              maxAge: 360000,
              httpOnly: false,
              path: "/",
            });
            res.cookie("ProfileDetails", JSON.stringify(result[0]), {
              maxAge: 360000,
              httpOnly: false,
              path: "/",
            });

            // res.cookie('Accounttype', result[0].Accounttype, {
            //     maxAge: 360000,
            //     httpOnly: false,
            //     path: '/'
            // });
            console.log("Session after login: ", req.session.user);
            console.log("Session: " + JSON.stringify(req.session.user));
            res.writeHead(200, {
              "Content-type": "text/plain",
            });
            console.log("Login successful!");
            res.end("Login successful!");
          }
        }
      });
    }
    conn.release();
  });
});

app.post("/signup", function (req, res) {
  console.log("Inside signup POST");
  console.log("Request Body: ", req.body);

  // const Email = mysql.escape(req.body.Email);
  // const Name = mysql.escape(req.body.Name);
  // const Password = mysql.escape(req.body.Password);

  //Query

  connection.getConnection(function (err, conn) {
    if (err) {
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      console.log("Error in creating connection!");
      res.end("Error in creating connection!");
    } else {
      const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
      var sql =
        "INSERT INTO login_credentials (Email, Password, Name) VALUES (" +
        mysql.escape(req.body.email) +
        ", " +
        mysql.escape(hashedPassword) +
        ", " +
        mysql.escape(req.body.name) +
        ");";

      conn.query(sql, function (err, result) {
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });
          res.end("ERROR");
          console.log("Error: " + err);
        } else {
          res.writeHead(200, {
            "Content-type": "text/plain",
          });
          console.log("Added the user successfully: " + req.body.email);
        }
      });
    }
    conn.release();
  });
});

app.get("/home", function (req, res) {
  if (req.session.user) {
    res.send({
      loggedIn: true,
      user_details: req.session.user,
    });
  } else {
    res.send({
      loggedIn: false,
    });
  }
  // console.log(
  //   "Session message: " +
  //     req.session.user +
  //     " IS UNDEFINED: " +
  //     (req.session.user == undefined)
  // );
});

app.get("/getProducts", function (req, res) {
  console.log("Getting images for Home page");
  connection.getConnection(function (err, conn) {
    if (err) {
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      console.log("Error in creating connection!");
      res.end("Error in creating connection!");
      console.log("Error");
    } else {
      var sql = "SELECT * from products;";
      conn.query(sql, function (err, result) {
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });
          res.end("ERROR");
          console.log("Error: " + err);
        } else {
          res.writeHead(200, {
            "Content-type": "text/plain",
          });
          // console.log(result);
          for (const [key, item] of Object.entries(result)) {
            var file = item.ImageName;
            var filetype = file.split(".").pop();
            console.log(file);
            var filelocation = path.join(
              __dirname + "/../public/uploads",
              file
            );
            // console.log("TESTTT: " + filelocation);
            var img = fs.readFileSync(filelocation);
            var base64img = new Buffer(img).toString("base64");
            item.ItemImage = "data:image/" + filetype + ";base64," + base64img;
          }
          res.end(JSON.stringify(result));
        }
      });
    }
    conn.release();
  });
});

app.get("/productDetails", function (req, res) {
  console.log("Inside item  GET");
  console.log("Request Body ItemId: " + req.query.ItemId);
  const ItemId = req.query.ItemId;
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      //Login validation query

      var sql = "SELECT * from products WHERE ItemId = " + mysql.escape(ItemId);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error in retrieving single item data");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error in retrieving single item data");
        } else {
          // console.log(result[0].password);
          //   console.log("Items Data: ", result);
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          for (const [key, item] of Object.entries(result)) {
            var file = item.ImageName;
            var filetype = file.split(".").pop();
            console.log(file);
            var filelocation = path.join(
              __dirname + "/../public/uploads",
              file
            );
            // console.log("TESTTT: " + filelocation);
            var img = fs.readFileSync(filelocation);
            var base64img = new Buffer(img).toString("base64");
            item.ItemImage = "data:image/" + filetype + ";base64," + base64img;
          }
          // result[0].ItemId = ItemId;
          //   console.log(result);
          console.log("ROOOOOOOO: " + JSON.stringify(result));
          res.end(JSON.stringify(result));
        }
      });
    }
    conn.release();
  });
});

app.get("/profile", function (req, res) {
  console.log("Inside profile GET");
  console.log("Request Body: " + JSON.stringify(req.query.ProfileId));
  connection.getConnection(function (err, conn) {
    if (err) {
      // res.writeHead(400, {
      //   "Content-type": "text/plain",
      // });
      console.log("Error in creating connection!");
      res.end("Error in creating connection!");
      console.log("Error");
    } else {
      var Id = JSON.stringify(req.query.ProfileId);
      var sql = "SELECT * from login_credentials WHERE ProfileId = " + Id + ";";
      conn.query(sql, function (err, result) {
        if (err) {
          // res.writeHead(400, {
          //   "Content-Type": "text/plain",
          // });
          res.end("ERROR");
          console.log("Error: " + err);
        } else {
          // res.writeHead(200, {
          //   "Content-type": "text/plain",
          // });
          // console.log(
          //   "USER DETAILS: " + JSON.stringify(result[0].ProfileImage)
          // );
          res.end(JSON.stringify(result));
        }
      });
    }
    conn.release();
  });
});

app.post("/profile", function (req, res) {
  console.log("Inside profile POST");
  console.log("Profile Id: " + JSON.stringify(req.body.ProfileId));
  console.log("Request Body: " + JSON.stringify(req.body));

  connection.getConnection(function (err, conn) {
    if (err) {
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      console.log("Error in creating connection!");
      res.end("Error in creating connection!");
      console.log("Error");
    } else {
      var sql =
        "UPDATE login_credentials SET Email = '" +
        req.body.Email +
        "', Name = '" +
        req.body.Name +
        "', DOB = '" +
        req.body.DOB +
        "', About = '" +
        req.body.About +
        "', Country = '" +
        req.body.Country +
        "', City = '" +
        req.body.City +
        "', Address = '" +
        req.body.Address +
        "', Gender = '" +
        req.body.Gender +
        "', ProfileImage = '" +
        req.body.ProfileImage +
        "', Phonenumber = '" +
        req.body.Phonenumber +
        "' WHERE ProfileId = " +
        req.body.ProfileId +
        ";";

      conn.query(sql, function (err, result) {
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });
          res.end("ERROR");
          console.log("Error in Profile POST: " + err);
        } else {
          res.writeHead(200, {
            "Content-type": "text/plain",
          });
          console.log(
            "Updated the details successfully for profile id: " +
            req.body.ProfileId
          );
        }
      });
    }
    conn.release();
  });
});

app.post("/purchase", function (req, res) {
  console.log("Inside purchase POST");
  // console.log(
  //   "Request body: " +
  //     JSON.stringify("TEST: " + JSON.stringify(req.body[0].length))
  // );
  res.send("Success");
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      var OrderId = uuidv4();
      var records = [];
      var datetime = new Date();
      // var ProfileId = 2;
      for (var i = 0; i < req.body[0].length; i++) {
        records.push([
          req.body[0][0].ProfileId,
          OrderId,
          req.body[0][i].ItemId,
          req.body[0][i].ItemName,
          req.body[0][i].ImageName,
          req.body[0][i].ShopId,
          req.body[0][i].quantity,
          req.body[0][i].Price,
          datetime.toISOString().slice(0, 10),
        ]);
        console.log(records);
      }
      var sql =
        "INSERT INTO orderdetails (ProfileId, OrderId, ItemId, ItemName, ImageName, ShopName, Quantity, Price, PurchaseDate) VALUES ?";
      conn.query(sql, [records], function (err, result) {
        if (err) {
          // res.writeHead(400, {
          //   "Content-Type": "text/plain",
          // });
          // res.end("ERROR");
          console.log("Error: " + err);
        } else {
          // res.writeHead(200, {
          //   "Content-type": "text/plain",
          // });
          console.log("Added" + result.affectedRows + "row!");
        }
      });
    }
    conn.release();
  });
});

app.post("/history", function (req, res) {
  console.log("Inside item  GET");
  const Id = parseInt(req.body.ProfileId);
  console.log("Request Body: " + Id);
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      // res.writeHead(400, {
      //   "Content-type": "text/plain",
      // });
      res.end("Error in creating connection!");
    } else {
      //Login validation query
      var sql = "SELECT * from orderdetails WHERE ProfileId = " + Id + ";";
      conn.query(sql, function (err, result) {
        if (err) {
          // res.writeHead(400, {
          //   "Content-Type": "text/plain",
          // });
          res.end("ERROR");
          console.log("Error: " + err);
        } else {
          // res.writeHead(200, {
          //   "Content-type": "text/plain",
          // });
          for (const [key, item] of Object.entries(result)) {
            var file = item.ImageName;
            var filetype = file.split(".").pop();
            console.log(file);
            var filelocation = path.join(
              __dirname + "/../public/uploads",
              file
            );
            // console.log("TESTTT: " + filelocation);
            var img = fs.readFileSync(filelocation);
            var base64img = new Buffer(img).toString("base64");
            item.ItemImage = "data:image/" + filetype + ";base64," + base64img;
          }
          res.send(result);
        }
      });
    }
    conn.release();
  });
});

app.get("/favourites", function (req, res) {
  console.log("Inside favourites POST");
  const Id = parseInt(req.query.ProfileId);
  console.log("Request Body: " + Id);
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      // res.writeHead(400, {
      //   "Content-type": "text/plain",
      // });
      res.end("Error in creating connection!");
    } else {
      //Login validation query
      var sql = "SELECT * from favourites WHERE ProfileId = '" + Id + "';";
      conn.query(sql, function (err, result) {
        if (err) {
          // res.writeHead(400, {
          //   "Content-Type": "text/plain",
          // });
          res.end("ERROR");
          console.log("Error: " + err);
          s;
        } else {
          // res.writeHead(200, {
          //   "Content-type": "text/plain",
          // });
          // for (const [key, item] of Object.entries(result)) {
          //   var file = item.ImageName;
          //   var filetype = file.split(".").pop();
          //   console.log(file);
          //   var filelocation = path.join(__dirname + "/../public/uploads", file);
          //   var img = fs.readFileSync(filelocation);
          //   var base64img = new Buffer(img).toString("base64");
          //   item.ItemImage = "data:image/" + filetype + ";base64," + base64img;
          // }
          // console.log("dsnjvndsjivni: " + JSON.stringify(result));
          res.send(result);
        }
      });
    }
    conn.release();
  });
});

app.post("/set-remove-favourite", function (req, res) {
  console.log("Inside set-remove-favourites POST");
  console.log(req.body.Item);
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      // res.writeHead(400, {
      //   "Content-type": "text/plain",
      // });
      res.end("Error in creating connection!");
    } else {
      var sql;
      //Login validation query
      if (!req.body.isDelete) {
        sql =
          "INSERT into favourites (ProfileId, ItemId, ItemName, ShopName, Category, ImageName, Price, QuantityAvailable, QuantitySold, Description) VALUES ('" +
          req.body.ProfileId +
          "', '" +
          req.body.Item.ItemId +
          "', '" +
          req.body.Item.ItemName +
          "', '" +
          req.body.Item.ShopId +
          "', '" +
          req.body.Item.Category +
          "', '" +
          req.body.Item.ImageName +
          "', '" +
          req.body.Item.Price +
          "', '" +
          req.body.Item.QuantityAvailable +
          "', '" +
          req.body.Item.QuantitySold +
          "', '" +
          req.body.Item.Description +
          "');";
      } else {
        sql =
          "DELETE from favourites WHERE ItemId = " +
          req.body.Item.ItemId +
          " AND ProfileId = " +
          req.body.ProfileId +
          ";";
      }

      conn.query(sql, function (err, result) {
        if (err) {
          // res.writeHead(400, {
          //   "Content-Type": "text/plain",
          // });
          res.end("ERROR");
          console.log("Error: " + err);
        } else {
          // res.writeHead(200, {
          //   "Content-type": "text/plain",
          // });
          // for (const [key, item] of Object.entries(result)) {
          //   var file = item.ImageName;
          //   var filetype = file.split(".").pop();
          //   console.log(file);
          //   var filelocation = path.join(__dirname + "/../public/uploads", file);
          //   var img = fs.readFileSync(filelocation);
          //   var base64img = new Buffer(img).toString("base64");
          //   item.ItemImage = "data:image/" + filetype + ";base64," + base64img;
          // }
          res.send(result);
        }
      });
    }
    conn.release();
  });
});

app.get("/favouritesImages", function (req, res) {
  console.log("Inside favourites images GET");
  const Id = parseInt(req.query.Id);
  console.log("Request Body: " + Id);
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      // res.writeHead(400, {
      //   "Content-type": "text/plain",
      // });
      res.end("Error in creating connection!");
    } else {
      //Login validation query
      var sql = "SELECT * from favourites WHERE ProfileId = '" + Id + "';";
      conn.query(sql, function (err, result) {
        if (err) {
          // res.writeHead(400, {
          //   "Content-Type": "text/plain",
          // });
          res.end("ERROR");
          console.log("Error: " + err);
        } else {
          // res.writeHead(200, {
          //   "Content-type": "text/plain",
          // });
          for (const [key, item] of Object.entries(result)) {
            var file = item.ImageName;
            var filetype = file.split(".").pop();
            console.log(file);
            var filelocation = path.join(
              __dirname + "/../public/uploads",
              file
            );
            // console.log("TESTTT: " + filelocation);
            var img = fs.readFileSync(filelocation);
            var base64img = new Buffer(img).toString("base64");
            item.ItemImage = "data:image/" + filetype + ";base64," + base64img;
          }
          res.send(result);
        }
      });
    }
    conn.release();
  });
});

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },

  // filename: function (req, file, cb) {
  //   if (
  //     file.mimetype !== "image/png" &&
  //     file.mimetype !== "image/jpg" &&
  //     file.mimetype !== "image/jpeg"
  //   ) {
  //     var err = new Error();
  //     err.code = "filetype";
  //     return cb(err);
  //   } else {
  //     var fileName = crypto.randomBytes(10).toString("hex");
  //     file.filename = fileName;
  //     cb(null, fileName + ".jpg");
  //   }
  // },
});

const upload = multer({
  storage: storage,
  //   limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

//uploading photo
app.post("/upload-photo", upload.single("photos"), (req, res) => {
  console.log("Request Body from upload DP: ", JSON.stringify(req.body));
  res.end(res.req.file.filename);
});

app.get("/download-photo/", (req, res) => {
  console.log("Inside Download File: " + req.query.file);
  var file = req.query.file;

  var filetype = file.split(".").pop();

  var filelocation = path.join(__dirname + "/../public/uploads", file);
  // console.log("TESTTT: " + filelocation);
  var img = fs.readFileSync(filelocation);
  var base64img = new Buffer(img).toString("base64");
  res.writeHead(200, {
    "Content--type": "image/" + filetype,
  });
  // console.log(base64img);
  res.end("data:image/" + filetype + ";base64," + base64img);
});

app.post("/cart", function (req, res) {
  console.log("Inside cart POST");
  console.log("Request Body: " + JSON.stringify(req.body));
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      // res.writeHead(400, {
      //   "Content-type": "text/plain",
      // });
      res.end("Error in creating connection!");
    } else {
      //Login validation query
      var sql = "SELECT * from favourites WHERE ProfileId = '" + Id + "';";
      conn.query(sql, function (err, result) {
        if (err) {
          // res.writeHead(400, {
          //   "Content-Type": "text/plain",
          // });
          res.end("ERROR");
          console.log("Error: " + err);
        } else {
          // res.writeHead(200, {
          //   "Content-type": "text/plain",
          // });
          for (const [key, item] of Object.entries(result)) {
            var file = item.ImageName;
            var filetype = file.split(".").pop();
            console.log(file);
            var filelocation = path.join(
              __dirname + "/../public/uploads",
              file
            );
            // console.log("TESTTT: " + filelocation);
            var img = fs.readFileSync(filelocation);
            var base64img = new Buffer(img).toString("base64");
            item.ItemImage = "data:image/" + filetype + ";base64," + base64img;
          }
          res.send(result);
        }
      });
    }
    conn.release();
  });
});

app.get("/check-shop-exists", function (req, res) {
  console.log("Inside check shop exists GET");
  //   console.log("Request Body ItemId: " + req.query.ItemId);
  let ProfileId = req.query.ProfileId;
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      //Login validation query

      var sql =
        "SELECT ShopName from shopdetails WHERE ProfileId = " +
        mysql.escape(ProfileId) +
        ";";

      // console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error while  check shop exists data");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error while check shop exists data");
        } else {
          res.writeHead(200, {
            "Content-type": "application/json",
          });

          if (result.length === 0) {
            res.end("Not Found");
          } else {
            res.end(result[0].ShopName);
          }
        }
      });
    }
    conn.release();
  });
});

app.post("/add-shop-name", function (req, res) {
  console.log("Inside add shop name  post");
  //   console.log("Request Body ItemId: " + req.query.ItemId);
  const { ProfileId, nameToAdd } = req.body;
  console.log(ProfileId);
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      var sql =
        "INSERT INTO shopdetails (ShopName, ProfileId) VALUES(" +
        mysql.escape(nameToAdd) +
        "," +
        mysql.escape(ProfileId) +
        ");";

      console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error in add shop data");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error in add shop data");
        } else {
          // console.log(result[0].password);
          console.log("Profile Data: ", result);
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          res.end("Added Shop Name");
        }
      });
    }
    conn.release();
  });
});

app.get("/check-shop-name", function (req, res) {
  console.log("Inside check shop name GET");
  //   console.log("Request Body ItemId: " + req.query.ItemId);
  const { ProfileId, nameToCheck } = req.query;

  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      //Login validation query

      var sql =
        "SELECT EXISTS(SELECT * from shopdetails WHERE ShopName=" +
        mysql.escape(nameToCheck) +
        ");";

      // console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error while retrieving name your shop data");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error while retrieving name your shop data");
        } else {
          // console.log(result[0].password);
          //   console.log("Items Data: ", result);
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          //   console.log(result[0]["EXISTS(SELECT * from shopdetails WHERE ShopName='First Etsy Shop')"]);
          var key = Object.keys(result[0])[0];
          // console.log(key );
          console.log(result[0][key]);
          if (result[0][key] === 1) {
            console.log(result[0][key]);
            res.end("false");
          } else {
            res.end("true");
          }
        }
      });
    }
    conn.release();
  });
});

app.get("/shop/details", function (req, res) {
  console.log("Inside shop details GET");
  console.log("Request query: " + JSON.stringify(req.query));

  const { ProfileId } = req.query;
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      var sql =
        "SELECT * from shopdetails WHERE ProfileId = " +
        mysql.escape(ProfileId) +
        ";";

      // console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error while  get shop details data");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error while get shop details data");
        } else {
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          if (result[0].ShopImage != undefined) {
            for (const [key, user] of Object.entries(result)) {
              var file = user.ShopImage;
              var filetype = file.split(".").pop();
              // console.log(file);
              var filelocation = path.join(
                __dirname + "/../public/uploads",
                file
              );
              // console.log("TESTTT: " + filelocation);
              var img = fs.readFileSync(filelocation);
              var base64img = new Buffer(img).toString("base64");
              user.ShopImage =
                "data:image/" + filetype + ";base64," + base64img;
            }
          }
          res.end(JSON.stringify(result[0]));
        }
      });
    }
    conn.release();
  });
});

app.get("/shop/items", function (req, res) {
  console.log("Inside get shop items GET");

  const { ShopId } = req.query;

  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      //Login validation query

      var sql =
        "SELECT * from products WHERE ShopId = " + mysql.escape(ShopId) + ";";

      // console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error while  get shop items data");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error while get shop items data");
        } else {
          res.writeHead(200, {
            "Content-type": "application/json",
          });

          for (const [key, user] of Object.entries(result)) {
            if (user.ImageName) {
              var file = user.ImageName;
              var filetype = file.split(".").pop();
              // console.log(file);
              var filelocation = path.join(
                __dirname + "/../public/uploads",
                file
              );
              // console.log("TESTTT: " + filelocation);
              var img = fs.readFileSync(filelocation);
              var base64img = new Buffer(img).toString("base64");
              user.ItemImage =
                "data:image/" + filetype + ";base64," + base64img;
            }
          }
          console.log("IMAGE NAME: " + JSON.stringify(result));
          res.end(JSON.stringify(result));
        }
      });
    }
    conn.release();
  });
});

app.get("/shop/check-owner", function (req, res) {
  console.log("Inside get shop items GET");

  const { ShopId, ProfileId } = req.query;
  // console.log(token);

  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      //Login validation query

      var sql =
        "SELECT ProfileId from shopdetails WHERE ShopId = " +
        mysql.escape(ShopId) +
        ";";

      // console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error while check if owner ");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error while check if owner ");
        } else {
          res.writeHead(200, {
            "Content-type": "application/json",
          });

          let OwnerId = result[0].ProfileId;

          if (OwnerId == ProfileId) {
            res.end("true");
          } else {
            res.end("false");
          }
        }
      });
    }
    conn.release();
  });
});

app.post("/shop/upload-photo", upload.single("photos"), (req, res) => {
  console.log("req.body", req.body);
  res.end(res.req.file.filename);
});

app.get("/check-shop-name", function (req, res) {
  console.log("Inside check shop name  GET");
  //   console.log("Request Body ItemId: " + req.query.ItemId);
  const { ProfileId, nameToCheck } = req.query;

  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      //Login validation query

      var sql =
        "SELECT EXISTS(SELECT * from shopdetails WHERE ShopName=" +
        mysql.escape(nameToCheck) +
        ");";

      // console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error while retrieving name your shop data");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error while retrieving name your shop data");
        } else {
          // console.log(result[0].password);
          //   console.log("Items Data: ", result);
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          //   console.log(result[0]["EXISTS(SELECT * from shopdetails WHERE ShopName='First Etsy Shop')"]);
          var key = Object.keys(result[0])[0];
          // console.log(key );
          console.log(result[0][key]);
          if (result[0][key] === 1) {
            console.log(result[0][key]);
            res.end("false");
          } else {
            res.end("true");
          }
        }
      });
    }
    conn.release();
  });
});

app.post("/shop/add-photo", function (req, res) {
  console.log("Inside add shop photo  post");
  //   console.log("Request Body ItemId: " + req.query.ItemId);
  const { ShopImage, ShopId } = req.body;

  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      var sql =
        "UPDATE shopdetails SET ShopImage = " +
        mysql.escape(ShopImage) +
        " WHERE ShopId = " +
        mysql.escape(ShopId) +
        ";";

      // console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error in add shop photo");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error in add shop photo");
        } else {
          // console.log(result[0].password);
          // console.log("Profile Data: ", result);
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          var file = ShopImage;
          var filetype = file.split(".").pop();
          // console.log(file);
          var filelocation = path.join(__dirname + "/../public/uploads", file);
          // console.log("TESTTT: " + filelocation);
          var img = fs.readFileSync(filelocation);
          var base64img = new Buffer(img).toString("base64");
          ShopImageEncoded = "data:image/" + filetype + ";base64," + base64img;
          console.log(ShopImageEncoded);
          res.end(ShopImageEncoded);
        }
      });
    }
    conn.release();
  });
});

app.post("/item/upload-photo", upload.single("photos"), (req, res) => {
  console.log("req.body", req.body);
  res.end(res.req.file.filename);
});

app.post("/item/add", function (req, res) {
  console.log("Inside ITEM ADD POST");
  console.log("Request Body: " + JSON.stringify(req.body.Description));
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      const zero = 0;
      // var file = req.body.ItemImage;
      // var filetype = file.split(".").pop();
      // // console.log(file);
      // var filelocation = path.join(__dirname + "/../public/uploads", file);
      // console.log("TESTTT: " + filelocation);
      // var img = fs.readFileSync(filelocation);
      // var base64img = new Buffer(img).toString("base64");
      // ShopImageEncoded = "data:image/" + filetype + ";base64," + base64img;
      var sql =
        "INSERT INTO products (ItemName, ShopId, Category, ImageName, Price, QuantityAvailable, QuantitySold, Description) VALUES ('" +
        req.body.ItemName +
        "'," +
        parseInt(req.body.ShopId) +
        ",'" +
        req.body.Category +
        "','" +
        req.body.ItemImage +
        "'," +
        parseFloat(req.body.Price) +
        "," +
        parseInt(req.body.QuantityAvailable) +
        "," +
        parseInt(zero) +
        ",'" +
        req.body.Description +
        "');";
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error in adding item");
          console.log("ERROR: " + err);
          console.log("SQL:" + sql);
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error in adding item");
        } else {
          // console.log(result[0].password);
          // console.log("Profile Data: ", result);
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          res.end(result[0]);
        }
      });
    }
    conn.release();
  });
});

app.post("/item/edit", function (req, res) {
  console.log("Inside ITEM EDIT POST");
  console.log("Request Body: " + JSON.stringify(req.body.Description));
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      const zero = 0;
      var sql =
        "UPDATE products SET ItemName = '" +
        req.body.ItemName +
        "',ShopId = " +
        parseInt(req.body.ShopId) +
        ", Category = '" +
        req.body.Category +
        "', ImageName = '" +
        req.body.ItemImage +
        "', Price = " +
        parseFloat(req.body.Price) +
        ", QuantityAvailable = " +
        parseInt(req.body.QuantityAvailable) +
        ", Description = '" +
        req.body.Description +
        "' WHERE ItemId = " +
        req.body.ItemId +
        ";";
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error in editing item");
          console.log("ERROR: " + err);
          console.log("SQL:" + sql);
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error in adding item");
        } else {
          // console.log(result[0].password);
          // console.log("Profile Data: ", result);
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          res.end(result[0]);
        }
      });
    }
    conn.release();
  });
});

app.post("/updatequantity", function (req, res) {
  console.log("INSIDE CART POST");
  console.log("Request Body: " + JSON.stringify(req.body));
  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      var sql = "";
      for (var i = 0; i < req.body[0].length; i++) {
        sql +=
          "UPDATE products SET QuantitySold = QuantitySold + " +
          parseInt(req.body[0][i].quantity) +
          ", QuantityAvailable = QuantityAvailable - " +
          parseInt(req.body[0][i].quantity) +
          " WHERE ItemId = " +
          parseInt(req.body[0][i].ItemId) +
          ";";
      }
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error in editing item");
          console.log("ERROR: " + err);
          console.log("SQL:" + sql);
          // res.writeHead(400, {
          //   "Content-type": "text/plain",
          // });
          res.end("Error in updating quantity item");
        } else {
          // console.log(result[0].password);
          // console.log("Profile Data: ", result);
          // res.writeHead(200, {
          //   "Content-type": "application/json",
          // });
          res.send(result);
        }
      });
    }
    conn.release();
  });
});

app.get("/item/search", function (req, res) {
  console.log("Inside download search item GET");
  let { searchWord } = req.query;

  connection.getConnection(function (err, conn) {
    if (err) {
      console.log("Error in creating connection!");
      res.writeHead(400, {
        "Content-type": "text/plain",
      });
      res.end("Error in creating connection!");
    } else {
      //Login validation query

      var sql =
        "SELECT * FROM products WHERE ItemName LIKE '%" + searchWord + "%';";
      console.log(sql);
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error in retrieving items search data");
          res.writeHead(400, {
            "Content-type": "text/plain",
          });
          res.end("Error in retrieving items search data");
        } else {
          // console.log(result[0].password);
          //   console.log("Items Data: ", result);
          res.writeHead(200, {
            "Content-type": "application/json",
          });
          for (const [key, item] of Object.entries(result)) {
            var file = item.ImageName;
            var filetype = file.split(".").pop();
            console.log(file);
            var filelocation = path.join(
              __dirname + "/../public/uploads",
              file
            );
            var img = fs.readFileSync(filelocation);
            var base64img = new Buffer(img).toString("base64");
            item.ItemImage = "data:image/" + filetype + ";base64," + base64img;
          }
          // console.log(result.length);
          console.log("SINDJNJSN: 2" + JSON.stringify(result));
          res.end(JSON.stringify(result));
        }
      });
    }
    conn.release();
  });
});
