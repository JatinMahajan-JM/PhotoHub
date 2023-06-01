const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const feedRoutes = require("./routes/feedRoutes");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const compression = require("compression");
const dotenv = require("dotenv");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimeType === "image/jpeg" || "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

dotenv.config();
app.use(compression());
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("imageUrl")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(feedRoutes);
app.use(authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(path.resolve(), "/frontend/build")));
  app.get("*", (req, res, next) => {
    res.sendFile(path.join(path.resolve(), "/frontend/build/index.html"));
  });
}

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({ message });
});

// mongoose
//   .connect(
//     "mongodb+srv://JatinMahajan:XwK1b0CnV2KUa70K@cluster0.9s9ex2a.mongodb.net/posts?retryWrites=true&w=majority"
//   )
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.9s9ex2a.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {});
  });
