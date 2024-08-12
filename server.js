const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.listen(port, "0.0.0.0", () => {
    console.log("Listening on port " + port);
})