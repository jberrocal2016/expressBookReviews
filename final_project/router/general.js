const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Ensure username and password are provided
  if (!username || !password || username.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if user already exists
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Add new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop (async-await)
public_users.get("/", async (req, res) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

    // Return books data after delay
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Get book details based on ISBN (async-await)
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;

    // Simulate a delay using setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (books[isbn]) {
      res.status(200).json(books[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Get book details based on author (async-await)
public_users.get("/author/:author", async (req, res) => {
  try {
    const searchAuthor = req.params.author.trim().toLowerCase(); // Normalize input

    // Simulate a delay using setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const booksByAuthor = Object.values(books).filter(
      (book) => book.author.toLowerCase().includes(searchAuthor) // Case-insensitive & partial match
    );

    if (booksByAuthor.length > 0) {
      res.status(200).json({
        count: booksByAuthor.length,
        books: booksByAuthor,
      });
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Get all books based on title (async-await)
public_users.get("/title/:title", async (req, res) => {
  try {
    const searchTitle = req.params.title.trim().toLocaleLowerCase(); // Normalize input

    // Simulate a delay using setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const booksByTitle = Object.values(books).filter(
      (book) => book.title.toLocaleLowerCase().includes(searchTitle) // Case-insensitive & partial match
    );

    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const book = books[isbn];
  const reviews = book.reviews || {}; // Ensure reviews exist

  return res.status(200).json({
    isbn: isbn,
    title: book.title,
    reviews: Object.keys(reviews).length > 0 ? reviews : "No reviews available",
  });
});

module.exports.general = public_users;
