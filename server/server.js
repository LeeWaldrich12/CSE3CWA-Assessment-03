require("dotenv").config();

const db = require("./database");
const cors = require("cors");
const express = require("express");
const passport = require("./passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authenticateToken = require("./authMiddleware");

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
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

app.get("/api/auth/me", authenticateToken, (req, res) => {
    res.json({ 
      authenticated: true, 
      user: req.user, 
    });
});

//POST route
app.post("/api/capsules", authenticateToken, (req, res) => {
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
      req.user.id,
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
app.get("/api/capsules", authenticateToken, (req, res) => {
    db.all("SELECT * FROM capsules WHERE user_id = ? ORDER BY created_at DESC", [req.user.id], (err,rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//PUT
app.put("/api/capsules/:id", authenticateToken, (req, res) => {
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
    WHERE id = ? AND user_id = ?
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
      id,
      req.user.id
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Capsule not found"
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
app.delete("/api/capsules/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM capsules WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Capsule not found"
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
app.get( 
  "/auth/github/callback", passport.authenticate("github", { 
    failureRedirect: "/login", 
  }), 
  (req, res) => {
    const token = jwt.sign( { 
      id: String(req.user.id), 
      username: req.user.username, 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: "1h", 
    } 
  ); 

res.cookie("token", token, { 
  httpOnly: true, 
  secure: process.env.NODE_ENV === "production", 
  sameSite: "lax", 
  maxAge: 60 * 60 * 1000, 
}); 

    res.redirect("http://localhost:5173/dashboard"); 
  } 
);


const PORT = 5000;

app.post("/api/logout", (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ message: "Logged out successfully" });
});


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});