import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import router from "./routes.js";

const app = express();
var corsOptions = {
  origin: [
    "http://localhost:8081",
    "http://localhost:4200",
    "https://lglrcx.com",
  ],
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Routes initializationss
app.use("/api", router);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
