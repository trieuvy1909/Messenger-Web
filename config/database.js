const mongoose = require("mongoose");

class Mongo {
  gridfs = null;
  static connect = () => {
    mongoose
      .connect("mongodb://localhost:27017/GKWebNC")
      .then(() => {
        console.log("Connect successfully");
      })
      .catch((err) => {
        console.log("Connection fail");
      });

    // lưu hình
    // const conn = mongoose.connection;
    // conn.once("open", () => {
    //   //connnect grid fs
    //   this.gridfs = new mongoose.mongo.GridFSBucket(conn.db, {
    //     bucketName: process.env.BUCKET_NAME,
    //   });
    // });
  };
}
module.exports = Mongo;