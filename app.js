// app.js

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/pagination-demo", {
});
const db = mongoose.connection;

// Define a simple schema for the data
const pageSchema = new mongoose.Schema({
  content: String,
});

// app.get("/create", async (req, res) => {
//   await Page.create({
//     content: " this is content 4 ",
//   })
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {});
// });

const Page = mongoose.model("Page", pageSchema);

// Middleware to parse JSON
app.use(express.json());

// Serve static files (HTML, CSS, etc.)
app.use(express.static(__dirname + "/public"));

// Endpoint to get pages
app.get("/api/pages/:page", async (req, res) => {
  const page = parseInt(req.params.page);
  const pageSize = 1; // Adjust as needed
  const totalPages = await Page.find({});
  let pages;
  try {
    if (page - 2 > totalPages.length - 1) {
      console.log(
        "page - 2 > totalPages.length - 1===>",
        page - 2 > totalPages.length - 1
      );
      pages = { message: "page not found......" };
      return res.send(pages);
    }
    pages = await Page.find({})
      .skip((page - 2) * pageSize)
      .limit(pageSize);
    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
