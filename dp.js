const mongoose = require("mongoose");

const connectTomongo = mongoose.connect(
  "mongodb://localhost:27017/usermanagement",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log("database is connected")
);

module.export = connectTomongo;
