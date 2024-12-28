const express = require('express')
const router = express.Router()
const User = require('../modal/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')




const secreteKey = "swer&*&^#*&^@HJHjsdhfksdfhskfhw9853734598374";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) return res.status(400).json({ status: false, message: "All files are require" })

    const existingUser = await User.findOne({ email })

    if (existingUser) return res.status(400).json({ status: false, message: "Email already register" })

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ name, email, password: hashPassword })
    await newUser.save();

    return res.status(200).json({ status: true, message: "Register successfuly" })
  }
  catch (err) {

    return res.status(404).json({ status: false, message: "Something went wrong", err: err.message })
  }
})



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ status: false, message: "All files are require" })

    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ status: true, message: "invalid credential" })
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secreteKey, { expiresIn: '1hr' })



    return res.status(200).json({ status: true, message: "Login successfuly", token: token })
  }
  catch (err) {

    return res.status(404).json({ status: false, message: "Something went wrong", err: err.message })
  }
})



router.post("/profile", async (req, res) => {
  try {
    
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: false, message: "Access Denied" });
    }

    
    const decoded = jwt.verify(token, secreteKey); 
    if (!decoded?.id) {
      return res.status(400).json({ status: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({ status: true, message: "Profile Data", data: userData });
  } catch (err) {
    // Catch unexpected errors
    return res.status(500).json({ status: false, message: "Something went wrong", err: err.message });
  }
});










module.exports = router;