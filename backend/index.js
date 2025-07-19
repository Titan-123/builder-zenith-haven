const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Import job routes
const jobRoutes = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

