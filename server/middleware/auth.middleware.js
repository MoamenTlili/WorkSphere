import jwt from 'jsonwebtoken';


export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            console.log("No token provided");
            return res.status(403).send("Access denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        console.log("Token received:", token); 

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log("Token verified successfully. User ID:", verified.id);
        next();

    } catch (e) {  
        console.error("Error in verifyToken middleware:", e);
        res.status(500).json({ error: e.message });  
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access denied." });
    }
    next();
};
