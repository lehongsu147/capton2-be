require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const accountRoutes = require("./routes/account.routes");
const novelRoutes = require("./routes/novel.routes");
const chapterRoutes = require("./routes/chapter.routes");
const bookmarkRoutes = require("./routes/bookmark.routes");
const reviewRoutes = require("./routes/review.routes");
const commentRoutes = require("./routes/comment.routes");
const historyRoutes = require("./routes/history.routes");
const rankingRoutes = require("./routes/ranking.routes");
const rdfRoutes = require("./routes/rdf.routes");

//express app
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, res.method);
  next();
});

//routes
app.use("/api/accounts", accountRoutes);
app.use("/api/novels", novelRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/rdf", rdfRoutes);

//connect database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
