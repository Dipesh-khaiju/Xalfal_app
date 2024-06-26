import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const protectRoute = async (req,res,next)=>{
    try{
            const token = req.cookies.jwt;
            if(!token){
                return res.status(401).json({error:"Unauthorized, No token provided "})
            }

            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            if(!decoded){
                return res.status(401).json({error:"TOkens didnot match "});
            }

            const user = await User.findById(decoded.userId).select("-password");
            if(!user){
                return res.status(401).json({error:"no user found"});
            }
            req.user =user
            next();

    }

    catch(err){
        console.log("Error in protectRoute middleware",err.message);
        res.status(500).json(
            {error:"Internal server"})
    }
}

export default protectRoute;