const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if the username already exists in the users array
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  const accessToken = jwt.sign({ username }, "fingerprint_customer", {
    expiresIn: "1h",
  });
  req.session.authorization = { accessToken };

  return res
    .status(200)
    .json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username; // Extrat username from authenticated session

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(400).json({ message: "Book not found" });
  }

  if (!review || review.trim().length === 0) {
    return res.status(400).json({ message: "Review cannot be empty" });
  }

  // Add or update the review
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review; // Associate review with the user

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
