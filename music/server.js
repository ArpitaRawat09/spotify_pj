import app from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB();

app.listen(3000, () => {
  console.log("Music Server is running on http://localhost:3000");
});
