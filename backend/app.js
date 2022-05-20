const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("authenticatejs"); // -> My own package !

const routes = require("./routes/routes");
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/chatDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const port = process.env.PORT || 5000;
const app = express();
auth.initialize(app);

const corsOptions ={
   origin:true, 
   credentials:true,
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use(express.json());
app.use("/api", routes);

app.listen(port, () => console.log(`Server running at port ${port}`));