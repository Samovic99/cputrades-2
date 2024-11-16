// middleware/confirmations.js
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../controllers/auth-controller');
const usersModel = require("../models/users-model");
const administrator = require("../models/admin-model");

const protectRoutes = (req, res, next) => {
    let cookies = req.cookies;
    if (cookies != null) {
        console.log(cookies);
        jwt.verify(cookies.token, jwt_secret, (error, decodedToken) => {
            if (error) {
                console.log(error);
                res.redirect('/login');
            } else { next(); }
        });
    } else { res.redirect('/login'); }
}

const checkUsersDetails = (req, res, next) => {
    let cookies = req.cookies;
    if (cookies != null) {
        jwt.verify(cookies.token, jwt_secret, async (error, decodedToken) => {
            if (error) {
                next();
            } else {
                let data = await usersModel.findById(decodedToken.id);
                let admin = await administrator.findOne();
                if (data) {
                    data.account.balance = (data.account.balance + data.account.earnings + data.account.ref_bonus);
                    res.locals.data = data;
                    res.locals.admin = admin;
                    next();
                } else {
                    res.cookie('token', ' ', { maxAge: 1, httpOnly: true, secure: true });
                    res.redirect('/login');
                }
            }
        });
    } else { next(); }
}

const redirectToDashboard = (req, res, next) => {
    let cookies = req.cookies;
    if (cookies != null) {
        jwt.verify(cookies.token, jwt_secret, async (error, decodedToken) => {
            if (error) {
                next();
            } else {
                let data = await usersModel.findById(decodedToken.id);
                if (data) {
                    res.redirect('/dashboard');
                } else { next(); }
            }
        });
    } else { next(); }
}

module.exports = { protectRoutes, checkUsersDetails, redirectToDashboard };
