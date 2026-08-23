import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import {connect} from "./src/broker/rabbit.js";
const PORT = process.env.PORT || 3000;

connectDB();
connect();

app.listen(PORT, () => {
  console.log(`Auth Server is running on port ${PORT}`);
});
