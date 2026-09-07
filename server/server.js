const db = require("./database");
const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) =>{
    res.json({status: "ok"});
});

//TEST route
app.get("/api/test-db", (req, res) => {
    db.all("SELECT * FROM capsules", [], (err,rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});