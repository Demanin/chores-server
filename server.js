if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const express = require("express");
const router = require("./routes");

const app = express();

// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: "*" }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// helps us parse the body of POST requests to set wheels
app.use(bodyParser.json());

// Setup server routes
app.use("/", router);

const port = process.env.PORT || 5000;

// listen for requests :)
const listener = app.listen(port, () => {
    console.log("Starting on port "+port);

    console.log("Chore Wheel server up and running.");
});
