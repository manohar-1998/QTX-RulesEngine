const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");


const ruleEngineRoutes = require("./routes/ruleEngine.routes");
const employeeRoutes = require("./routes/employee.routes");
const projectRoutes = require("./routes/project.routes");

dotenv.config();

const app = express();
const PORT = process.env.RULE_ENGINE_PORT

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Rules Engine API started on port ${PORT}`);
});


app.use("/api/employee", employeeRoutes);
app.use("/api/ruleEngine", ruleEngineRoutes);
app.use("/api/project", projectRoutes);

