import jwt from "jsonwebtoken";

const authUserProfile = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
    }

    const token = authHeader.split(" ")[1]; // ✅ extract token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(401).json({ success: false, message: "Token verification failed" });
  }
};


export default authUserProfile;
