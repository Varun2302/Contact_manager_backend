const express = require("express");
const dotenv = require("dotenv").config()
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

connectDb();
const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use("/api/contacts", require("./routes/ContactRoutes"));

app.use("/api/users", require("./routes/UserRoutes"));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`server running on ${port}`)
})