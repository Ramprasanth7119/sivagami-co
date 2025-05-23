import express from "express"

import { loginUser, registerUser, adminLogin, getUserProfile } from "../controllers/userController.js";;
import authUser from "../middleware/authUserProfile.js";
import User from "../models/userModel.js";

//create a router using express router

const userRouter=express.Router()

userRouter.post('/register', registerUser)//pass endpoint and function, whenever we will call this, we will use execute function
userRouter.post('/login', loginUser)//if we hit this endpoint /api/user/login, then this login user controller function will be executed
userRouter.get('/profile', authUser, getUserProfile)//get user profile, we will use this in profile page
userRouter.post('/admin', adminLogin);

// Express route example
// routes/user.js


userRouter.put('/profile', authUser, async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id; // from the token middleware

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
});



export default userRouter//using this, we will create endpoints in server.js file