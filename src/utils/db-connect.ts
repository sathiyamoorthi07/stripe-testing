import mongoose from "mongoose";
//mongoose.set('debug', true);
let conn: any = null;

async function dbConnect() {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  if (conn == null) {
    conn = mongoose
      .connect(process.env.MONGODB_URI!, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => mongoose);

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
  }

  return conn;
}

export default dbConnect;
