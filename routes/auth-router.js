const express = require('express');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Import the middlewares and controllers
const { protectRoutes, checkUsersDetails, redirectToDashboard } = require('../middlewares/confirmations');  
const { 
    get_dashboard, get_history, get_deposit, get_withdrawal, get_profile, get_basic_details, 
    get_settings, get_purchase_plan, get_verification, get_logout, get_reset_password 
} = require('../controllers/auth-controller');  // Ensure correct imports for the get functions
const { 
    post_signup, post_login, post_reset_password, post_send_reset_password_mail, 
    post_deposit, post_withdrawal, post_purchase_plan, post_verification, 
    post_update_settings, post_update_email, post_profile_picture, verify_email, verify_otp
} = require('../controllers/auth-controller');  // Ensure correct imports for the post functions

// Multer file upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = req.path.includes("/profile-picture") 
            ? 'assets/img/pictures' 
            : 'uploads';
        cb(null, path.resolve(dest));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Route Definitions with middlewares
router.get('/dashboard', protectRoutes, checkUsersDetails, get_dashboard);  
router.get('/transactions', protectRoutes, checkUsersDetails, get_history);  
router.get('/deposit/:method?/:amount?', protectRoutes, checkUsersDetails, get_deposit);  
router.get('/withdraw', protectRoutes, checkUsersDetails, get_withdrawal);

router.get('/profile', protectRoutes, checkUsersDetails, get_profile);  
router.get('/basic-details', protectRoutes, checkUsersDetails, get_basic_details);  
router.get('/settings', protectRoutes, checkUsersDetails, get_settings);  
router.get('/purchase-plan', protectRoutes, checkUsersDetails, get_purchase_plan);  
router.get('/verification', protectRoutes, checkUsersDetails, get_verification);  
router.get('/logout', get_logout);  // No need to protect logout route

router.get('/reset-password/:token/:id', get_reset_password);

// POST Routes
router.post('/signup', post_signup);
router.post('/validate', verify_email);  // Now verify_email is correctly imported
router.post('/verify-otp', verify_otp);  // Now verify_otp is correctly imported
router.post('/login', redirectToDashboard, post_login);  
router.post('/reset-password/:token/:id', post_reset_password);
router.post('/reset-password-mail', post_send_reset_password_mail);
router.post('/deposit', protectRoutes, checkUsersDetails, upload.single('file'), post_deposit);  
router.post('/withdraw', protectRoutes, checkUsersDetails, post_withdrawal);  
router.post('/purchase-plan', protectRoutes, checkUsersDetails, post_purchase_plan);  
router.post('/verify', protectRoutes, checkUsersDetails, upload.array('file', 2), post_verification);  
router.post('/update-settings', protectRoutes, checkUsersDetails, post_update_settings);  
router.post('/update-email', protectRoutes, checkUsersDetails, post_update_email);  
router.post('/profile-picture', protectRoutes, checkUsersDetails, upload.single('file'), post_profile_picture);  

module.exports = router;
