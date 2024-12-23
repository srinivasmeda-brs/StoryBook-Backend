import User from '../models/userModel.js';
import {sendEmailVerificationLink} from '../utils/utils.js'
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

const createUser = async (req, res, next) => {
    const { first_name, last_name, email, password,isAuthor } = req.body;
  
    try {
      // Check if any fields are empty
      if (!first_name || !last_name || !email || !password) {
        const error = new Error(
          "Please fill first_name, last_name, email, and password in the body"
        );
        error.statusCode = 400; // Changed to 400 for Bad Request
        return next(error);
      }
  
      // Check for a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const error = new Error("Invalid email format");
        error.statusCode = 400; // Changed to 400 for Bad Request
        return next(error);
      }
  
      // Check if a user is already registered with the same email
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("User already exists with this email");
        error.statusCode = 400; // Changed to 400 for Bad Request
        return next(error);
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate a token for email verification
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "2h", // Token expires in 2 hours
      });
  
      // Send verification email
      try {
        const verificationEmailResponse = await sendEmailVerificationLink(
          email,
          token,
          first_name
        );
  
        if (verificationEmailResponse.error) {
          const error = new Error("Error sending verification email");
          error.statusCode = 500; // Internal Server Error
          return next(error);
        }
  
        // Create a new user and save to database
        const user = await User.create({
          first_name,
          last_name,
          email,
          password: hashedPassword,
          isAuthor: isAuthor || false, 
          verify_token: token,
          verify_token_expires: Date.now() + 7200000, // Token expires in 2 hours
        });
  
        // Return a success response
        return res.status(201).json({
          message:
            "Registered successfully. Please check your email for the verification link.",
        });
      } catch (emailError) {
        // Handle error in email sending
        return next(emailError);
      }
    } catch (err) {
      // Catch any errors that occur in the try block
      return next(err);
    }
  };

 // 2. Verifing email--we will get the "Get" request to here
const verifyEmail = async (req, res, next) => {
    try {
      // console.log(req.params.verify_token);
      const user = await User.findOne({ verify_token: req.params.verify_token });
      if (!user) {
        return res.status(404).send("User not found so,Invalid token");
      } else if (user.verify_token_expires <= Date.now()) {
        if (!user.verified) {
          await user.deleteOne();
          return res
            .status(409)
            .send("Verification link is expired.Please register again");
        } else {
          return res.status(409).send("Please login to continue");
        }
      } else if (user.verified === true) {
        return res.status(200).json({
          status: "success",
          message: "Email already verified. Please login.",
        });
      } else {
        user.verified = true;
        await user.save();
        return res.status(201).json({
          status: "success",
          message: "Email verified successfully. Please login.",
        });
      }
    } catch (error) {
      return next(error);
    }
  };
  
// 3. Login User
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    const err = new Error("Please enter both email and password");
    err.statusCode = 400;
    return next(err); // Pass the error to the error handling middleware
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const err = new Error("Invalid email format");
    err.statusCode = 400;
    return next(err); // Pass the error to the error handling middleware
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err); // Pass the error to the error handling middleware
    }

    // Check if the email is verified
    if (!user.verified) {
      const err = new Error("Email verification is pending. Please verify your email.");
      err.statusCode = 409;
      return next(err); // Pass the error to the error handling middleware
    }

    // Check if the password is valid
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const err = new Error("Invalid password");
      err.statusCode = 401;
      return next(err); // Pass the error to the error handling middleware
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, isAuthor: user.isAuthor }, // Include isAuthor in the token
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Token expiration time (30 days)
    );

    // Save the token to the user object (optional)
    user.token = token;
    await user.save();

    // Send the response with the token and user information
    res.status(200).json({
      message: "Login successful",
      token, // Send the generated JWT token
      expiresIn: 2592000, // 30 days in seconds
      user: {
        _id: user._id,
        email: user.email,
        username: user.first_name,
        isAuthor: user.isAuthor, // Add the isAuthor field
        createdAt: user.createdAt, // Created date
        updatedAt: user.updatedAt // Last updated date
      }
    });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};


  const getUser = async (req, res, next) => {
    try {
      const users = await User.find({})  // Ensure you're using the correct model
      res.json(users);
    } catch (error) {
      next(error);  // Pass the error to the error handling middleware
    }
  };

  const getStories = async (req, res, next) => {
    const { id } = req.params;
    try {
      // Fetch user by ID and populate the stories virtual field
      const user = await User.findById(id).populate('stories');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(user);
      res.json(user);  // Return the user with populated stories
    } catch (error) {
      next(error);  // Pass the error to the error handling middleware
    }
  };


export {createUser,verifyEmail,loginUser,
  getUser,getStories

}



