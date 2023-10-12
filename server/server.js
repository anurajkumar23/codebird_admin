const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cokkie = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
dotenv.config();
const PORT = 8000 || process.env.PORT;

//------------------------Middlewares----------------------
const allowedOrigins = [
  process.env.FRONTEND_URL, // No need for interpolation here
  'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cokkie());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "1024mb" }));
app.use(bodyParser.urlencoded({ limit: "1024mb", extended: true }));

const verifyToken = async (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) {
    console.log("Not found cookies");
    return res.status(400).json({ error: "At First Login " });
  } else {
    try {
      const verify = await jwt.verify(token, process.env.JWT);
      if (verify) {
        console.log("verify Done");
        const data = await Admin.findOne({ email: verify.email });
        if (data) {
          req.userData = data;
          next();
        } else {
          return res.status(400).json({ error: "At First Login " });
        }
      } else {
        return res.status(400).json({ error: "At First Login " });
      }
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }
};

//------------------------Connect Database--------------------------

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Data Base Connected ");
  })
  .catch((error) => {
    console.log(error);
  });

//------------------------Mongodb Models--------------------------

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  roll: {
    type: Number,
    require: true,
    unique: true,
  },
  domain: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  batch: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  isPaymentDone: {
    type: Boolean,
    default: false,
  },
});

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userPhone: {
    type: Number,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});
const coreTeamSchema = new mongoose.Schema({
  pimg: {
    type: String,
    
  },
  name: {
    type: String,
    required: true,
  },
  clubPosition: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  facebook: {
    type: String,
  },
});
const eventSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  date: { type: String, require: true },
  registrationDate: { type: String, require: true },
  mode: { type: String, require: true },
  poster: { type: String, require: true },
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Payment = mongoose.model("Payment", paymentSchema);
const Team = mongoose.model("Coreteam", coreTeamSchema);
const Event = mongoose.model("Event", eventSchema);

//------------------------Controllers--------------------------

//1.Register Controller
const register = async (req, res) => {
  try {
    const { password, cpassword, name, email, phone } = req.body;
    if (!name || !email || !phone || !password || !cpassword) {
      return res
        .status(400)
        .json({ error: "Fill required fields", success: false });
    }
    const userExist = await Admin.findOne({ email: email });
    const userExistPhone = await Admin.findOne({ phone: phone });
    if (userExist || userExistPhone) {
      return res
        .status(403)
        .json({ error: "User Already Exists", success: false });
    } else {
      const newUser = new Admin({
        password,
        cpassword,
        name,
        phone,
        email,
      });
      try {
        await newUser.save();
        return res
          .status(200)
          .json({ message: "Registration Done!", success: true });
      } catch (error) {
        return res.status(500).send({ error: error, success: false });
      }
    }
  } catch (error) {
    return res.status(500).send({ error: error, success: false });
  }
};


//2. Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await Admin.findOne({ email: email });

    if (!userExist) {
      return res.status(404).json({ error: "User Not Found" });
    }

    const verifyPass = await bcrypt.compare(password, userExist.password);

    if (!verifyPass) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: userExist._id, email: userExist.email },
      process.env.JWT
    );

    const options = {
      httpOnly: true,
    };

    res.cookie("admin_token", token, options);
    return res.status(200).json({
      message: "Log In Done!",
      userName: userExist.name,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

app.post("/api/login", login);



//3.Users Datafetch Controller
const userData = async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (error) {
    res.status(200).json(error);
  }
};

//4.Members Datafetch Controller
const membersData = async (req, res) => {
  try {
    const users = await User.find({ isPaymentDone: true });
    res.status(200).json(users);
  } catch (error) {
    res.status(200).json(error);
  }
};

//5.Log out Controller
const logout = (req, res) => {
  console.log("working");
  res.clearCookie("admin_token");
  res.status(200).json({ msg: "logout" });
};

//6.Payments Datafetch Controller
const paymentData = async (req, res) => {
  try {
    const payments = await Payment.find().exec();
    res.json(payments);
  } catch (error) {
    res.status(400).json(error);
  }
};

//7.Users Data Delete Controller
const userDelete = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findOneAndDelete({ _id: id });
    res.status(200).json("Delete");
  } catch (error) {
    res.status(400).json(error);
  }
};

//8.Users Data Update Controller
const userUpdate = async (req, res) => {
  const id = req.params.id;
  try {
    const update = await User.findByIdAndUpdate({ _id: id }, req.body);
    res.status(200).json(update);
  } catch (error) {
    res.status(400).json(error);
  }
};

//9.Single Users Data Controller
const userOneData = async (req, res) => {
  const id = req.params.id;
  try {
    const update = await User.findById({ _id: id });
    res.status(200).json(update);
  } catch (error) {
    res.status(400).json(error);
  }
};

// 10. Core Team Data Create Controller
const createTeam = async (req, res) => {
  const { name, position, branch, instagram, facebook, linkedin, twitter, profile } =
    req.body;

  // Set a default image URL if 'profile' is not provided
  const defaultProfileImage = 'demoimg.png'; // Replace with the actual URL

  if (!name || !position || !branch) {
    return res
      .status(400)
      .json({ error: "Fill required fields", success: false });
  }

  const userExist = await Team.findOne({ name: name });
  if (userExist) {
    return res
      .status(400)
      .json({ error: "User Already Exist", success: false });
  }

  try {
    const newMember = new Team({
      name: name,
      clubPosition: position,
      branch : branch,
      insta: instagram,
      facebook: facebook,
      linkedin: linkedin,
      twitter: twitter,  
      pimg: profile || defaultProfileImage, // Use the provided profile or default image
    });
    console.log("done");
    await newMember.save();
    res
      .status(200)
      .json({ message: "CoreTeam Member Registration Done!", success: true });
  } catch (error) {
    res.status(400).json({ error: error, success: false });
  }
};


//11. Single Core Team Data Controller
const singleCoreTeam = async (req, res) => {
  const id = req.params.id;
  try {
    const member = await Team.findById({ _id: id });
    res.status(200).json(member);
  } catch (error) {
    res.status(400).json(error);
  }
};

//12. All Core Members Data
const teamData = async (req, res) => {
  try {
    const member = await Team.find().exec();
    res.json(member);
  } catch (error) {
    res.status(400).json(error);
  }
};

//13 Create Event

const createEvent = async (req, res) => {
  const { name, description, date, registrationDate, mode, poster } = req.body;
  if (!name || !poster || !date || !description || !mode || !registrationDate) {
    return res
      .status(400)
      .json({ error: "Fill required fields", success: false });
  }
  const userExist = await Event.findOne({ name: name });
  if (userExist) {
    return res
      .status(400)
      .json({ error: "User Already Exist", success: false });
  }
  try {
    const newevent = new Event({
      name,
      description,
      date,
      registrationDate,
      mode,
      poster,
    });
    console.log("done");
    await newevent.save();
    res
      .status(200)
      .json({ message: "CoreTeam Member Registration Done!", success: true });
  } catch (error) {
    res.status(400).json({ error: error, success: false });
  }
};

// 14 Get Events
const eventData = async (req, res) => {
  try {
    const events = await Event.find().exec();
    res.json(events);
  } catch (error) {
    res.status(400).json(error);
  }
};


// 15 Delete Event

const deleteEvent = async (req, res) => {
  const id = req.params.id;
  try {
    await Event.findOneAndDelete({ _id: id });
    res.status(200).json("Delete");
  } catch (error) {
    res.status(400).json(error);
  }
};
//------------------------Routes--------------------------

app.post("/", (req,res)=>{
  res.json("API Is Runnig😢")
});
app.post("/api/register", register);
app.post("/api/login", login);
app.patch("/api/update/:id", userUpdate);
app.get("/api/members", verifyToken, membersData);
app.get("/api/transactions", paymentData);
app.get("/api/users", userData);
app.post("/api/coreTeam", createTeam);
app.get("/api/coreTeam", teamData);
app.get("/api/coreTeam/:id", singleCoreTeam);
app.patch("/api/coreTeam", (req, res) => {
  res.json("working");
});
app.delete("/api/coreTeam", (req, res) => {
  res.json("working");
});
app.post("/api/createEvent",createEvent);
app.get("/api/event",eventData);
app.delete("/api/deleteEvent/:id",deleteEvent);
app.get("/api/logout", logout);
app.get("/api/user/:id", verifyToken, userOneData);
app.delete("/api/users/:id", verifyToken, userDelete);

//------------------------Listen--------------------------

app.listen(PORT, () => {
  console.log("Server Start At Port " + PORT);
});
