const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {

        return res.status(401).json({

            message: "Access Denied"

        });

    }

    try {

        const verified = jwt.verify(

            token.replace("Bearer ", ""),

            process.env.JWT_SECRET || "erp_secret_key"

        );

        req.user = verified;

        next();

    }

    catch {

        return res.status(401).json({

            message: "Invalid Token"

        });

    }

}

module.exports = verifyToken;