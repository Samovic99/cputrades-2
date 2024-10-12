const { Router } = require('express');
const authController = require('../controllers/auth-controller');
const { protectRoutes, redirectToDashboard } = require('../middlewares/confirmations');
const multer = require('multer');
const path = require('path'); 

const routes = Router();
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (req.path.includes("/profile-picture")) {
            cb(null, path.resolve('assets/img/pictures'))
        } else {
            cb(null, path.resolve('uploads'));
        }
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

routes.get('/dashboard', protectRoutes, authController.get_dashboard);
routes.get('/transactions', protectRoutes, authController.get_history);
routes.get('/deposit/:method?/:amount?', protectRoutes, authController.get_deposit);
routes.get('/withdraw', protectRoutes, authController.get_withdrawal);

routes.get('/profile', protectRoutes, authController.get_profile);
routes.get('/basic-details', protectRoutes, authController.get_basic_details);
routes.get('/settings', protectRoutes, authController.get_settings);
routes.get('/purchase-plan', protectRoutes, authController.get_purchase_plan);
routes.get('/verification', protectRoutes, authController.get_verification);
routes.get('/logout', authController.get_logout);

routes.get('/reset-password/:token/:id', authController.get_reset_password);

routes.post('/signup', authController.post_signup);
routes.post('/validate', authController.verify_email);
routes.post('/verify-otp', authController.verify_otp);
routes.post('/login', authController.post_login);
routes.post('/contact', authController.post_contact);
routes.post('/user-contact', protectRoutes, authController.post_user_contact);
routes.post('/reset-password/:token/:id', authController.post_reset_password);
routes.post('/reset-password-mail', authController.post_send_reset_password_mail);
routes.post('/deposit', protectRoutes, upload.single('file'), authController.post_deposit);
routes.post('/withdraw', protectRoutes, authController.post_withdrawal);
routes.post('/purchase-plan', protectRoutes, authController.post_purchase_plan);
routes.post('/verify', protectRoutes, upload.array('file', 2), authController.post_verification);
routes.post('/update-settings', protectRoutes, authController.post_update_settings);
routes.post('/update-email', protectRoutes, authController.post_update_email);
routes.post('/profile-picture', protectRoutes, upload.single('file'), authController.post_profile_picture)

module.exports = routes;