const express = require("express");
const connectTomongo = require("./dp");
var bodyParser = require("body-parser");
connectTomongo;
const app = express();



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mount the role routes
// app.use('/', );
app.use("/auth", require("./routes/createUserRoute"));
app.use("/auth", require("./routes/roleRoutes"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
