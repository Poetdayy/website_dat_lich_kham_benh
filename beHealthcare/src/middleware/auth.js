const jwt = require("jsonwebtoken");

const middlewareController = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                console.log(user);
                if (err) {
                    res.status(403).json("Token is not valid")
                }

                req.user = user;
                next();
            });
        } else {
            res.status(401).json("You're not authenticated!")
        }
    },
    
    verifyTokenAdminAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (Number(req.user.roleId) === 0) {
                next();
            } else {
                res.status(403).json("You're not allowed to access because you are'nt admin")
            }
        })
    },

    verifyTokenDoctorAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (Number(req.user.roleId) === 1) {
                next();
            } else {
                res.status(403).json("You're not allowed to access you are'nt doctor")
            }
        })
    },

    verifyTokenPatientAuth: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (Number(req.user.roleId) === 2) {
                next();
            } else {
                res.status(403).json("You're not allowed to access you are'nt patient")
            }
        })
    }

}

module.exports = middlewareController