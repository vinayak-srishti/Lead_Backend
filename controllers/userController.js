const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");


//creating a new user 
exports.createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...rest,
      password: hashedPassword
    });

    const savedUser = await user.save();
    savedUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser
    });

  } catch (error) {
    if (error.code === 11000) {
      if (error.keyValue.email) {
        return res.status(409).json({
          success: false,
          message: "Email already registered"
        });
      }

      if (error.keyValue.contactNumber) {
        return res.status(409).json({
          success: false,
          message: "Contact number already registered"
        });
      }
    }

    res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: error.message
    });
  }
};

// GET ALL USERS 
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//user Login function

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email
    });

    if (!user) {   
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {  
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }  
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 


//update user function

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) { 
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: error.message
    });
  }
};

//delete user functionality
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  } 
};