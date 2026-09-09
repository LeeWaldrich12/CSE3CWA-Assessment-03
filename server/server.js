require("dotenv").config();

const db = require("./database");
const cors = require("cors");
const express = require("express");
const passport = require("./passport");
const session = require("express-session");

const app = express();


app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", (req, res) =>{
    res.json({status: "ok"});
});

//POST route
app.post("/api/capsules", (req, res) => {
  console.log(req.body);
  const {
    project_name,
    prompt_title,
    prompt_version,
    prompt_text,
    response_summary,
    category,
    usefulness,
    reviewed,
    improved,
    screenshot_url,
    notes
  } = req.body;

  const sql = `
    INSERT INTO capsules (
      user_id,
      project_name,
      prompt_title,
      prompt_version,
      prompt_text,
      response_summary,
      category,
      usefulness,
      reviewed,
      improved,
      screenshot_url,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      "test-user",
      project_name,
      prompt_title,
      prompt_version,
      prompt_text,
      response_summary,
      category,
      usefulness,
      reviewed,
      improved,
      screenshot_url,
      notes
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Capsule created",
        id: this.lastID
      });
    }
  );
});

//Get route
app.get("/api/capsules", (req, res) => {
    db.all("SELECT * FROM capsules", [], (err,rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//PUT
app.put("/api/capsules/:id", (req, res) => {
  const { id } = req.params;

  const {
    project_name,
    prompt_title,
    prompt_version,
    prompt_text,
    response_summary,
    category,
    usefulness,
    reviewed,
    improved,
    screenshot_url,
    notes
  } = req.body;

  const sql = `
    UPDATE capsules
    SET
      project_name = ?,
      prompt_title = ?,
      prompt_version = ?,
      prompt_text = ?,
      response_summary = ?,
      category = ?,
      usefulness = ?,
      reviewed = ?,
      improved = ?,
      screenshot_url = ?,
      notes = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      project_name,
      prompt_title,
      prompt_version,
      prompt_text,
      response_summary,
      category,
      usefulness,
      reviewed,
      improved,
      screenshot_url,
      notes,
      id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Capsule updated",
        changes: this.changes
      });
    }
  );
});

//DELETE
app.delete("/api/capsules/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM capsules WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Capsule deleted",
        changes: this.changes
      });
    }
  );
});

// GitHub OAuth routes
app.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

//callback
app.get("/auth/github/callback", passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.send("GitHub Login Successful");
  } 
);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});