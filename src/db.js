const mongoose = require("mongoose");

module.exports = {
  connect: (DB_HOST) => {
    mongoose.connect(DB_HOST);
    mongoose.connection.on("error", (err) => {
      console.error(err);
      console.log(
        "MongoDB connection error. Please mkae sure MongoDB is running."
      );
    });
  },
  close: () => {
    mongoose.connection.close();
  },
};
