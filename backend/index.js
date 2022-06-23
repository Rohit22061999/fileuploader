const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const directoryPath = path.join(__dirname, "public");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getFile", (req, res) => {
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    // console.log(files);
    res.json({ files: files });
  });
});

app.post("/downloadFile", (req, res) => {
  try {
    console.log(req.body);
    const file = `${__dirname}/public/${req.body.file}`;
    res.download(file);
    console.log("here");
  } catch (err) {
    console.log(err);
  }
});

app.post("/uploadFile", upload.single("file"), function (req, res, next) {
  console.log(req.file);
  res.send({ file: req.file.originalname });
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
