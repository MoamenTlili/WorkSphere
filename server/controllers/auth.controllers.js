import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

/*Registeration*/
export const register = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    console.log("Request file:", req.file); // Log the uploaded file

    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      department,
    } = req.body;

    // Handle file upload
    const picturePath = req.file ? `/uploads/${req.file.filename}` : ""; 
    console.log("Picture path:", picturePath); 

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      department,
      viewedProfile: Math.floor(Math.random() * 10),
      impressions: Math.floor(Math.random() * 10),
    });

    console.log("New user:", newUser);

    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);

    // Generate a token for the new user
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return the token and user data in the response
    res.status(201).json({ token, user: savedUser });
  } catch (e) {
    console.error("Error in register function:", e);
    res.status(500).json({ error: e.message });
  }
};

/*Login*/
export const login = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid password." });

      // Modified token creation to include isAdmin
      const token = jwt.sign(
          { 
              id: user._id, 
              isAdmin: user.isAdmin,  
              role: user.role          
          }, 
          process.env.JWT_SECRET, 
          { expiresIn: '1d' }
      );

      // To remove password before sending user data
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.status(200).json({ 
          token, 
          user: userWithoutPassword 
      });
  } catch (e) {
      res.status(500).json({ error: e.message });
  }
}