require("../node_modules1/dotenv/lib/main").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Static files serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("CONNECTED TO MONGO!");
  })
  .catch((err) => {
    console.log("OH NO! MONGO CONNECTION ERROR!");
    console.log(err);
  });

// Schemas
const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const empSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobileNo: String,
  designation: String,
  gender: String,
  course: String,
  imageUrl: String,
  createDate: {
    type: Date,
    default: Date.now,
  },
});

const Login = mongoose.model("Login", loginSchema);
const Employee = mongoose.model("Employee", empSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }

    req.username = decoded.username;
    next();
  });
};

// Routes
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Login.findOne({
      username: username,
      password: password,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Sign JWT
    const token = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      user: { username: user.username },
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

app.post("/createEmp", upload.single("file"), async (req, res) => {
  const { name, email, mobileNo, designation, gender, course } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    const newEmployee = new Employee({
      name,
      email,
      mobileNo,
      designation,
      gender,
      course,
      imageUrl,
      createDate: Date.now(),
    });

    await newEmployee.save();
    res
      .status(201)
      .json({ message: "Employee created successfully", newEmployee });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating employee", error: err.message });
  }
});

app.post("/verify", verifyToken, async (req, res) => {
  try {
    res.status(200).json({username:req.username, message: "Token is valid" });
  } catch (err) {}
});

// DELETE /deleteEmp/:id
app.delete("/deleteEmp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Employee.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit /updateEmp/:id
app.put("/updateEmp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // Expect the updated employee data in the request body
    const result = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Show All Emplist
app.get("/showEmplist", async (req, res) => {
  try {
    const data = await Employee.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employee list", error });
  }
});



//Find Emp for update
app.get("/findEmp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Employee.findById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employee", error });
  }
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(4000, () => console.log("Server Started on Port 4000!"));
