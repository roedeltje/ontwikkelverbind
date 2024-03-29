const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Verbind met MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Verbonden"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Gebruik Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Server statische assets wanneer in productie
if (process.env.NODE_ENV === "production") {
  // Set Statische Map
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
