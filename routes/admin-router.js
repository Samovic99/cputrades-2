const { Router } = require('express');
const adminController = require('../controllers/admin-controller');
const { protectRoutes, redirectToDashboard } = require('../middlewares/confirmations');

const routes = Router();

// routes.get('/dashboard', protectRoutes, authController.get_dashboard);
// routes.post('/user-contact', protectRoutes, authController.post_user_contact);
// routes.get('/refer', redirectToDashboard, authController.get_referals);

routes.get('/confirm-user/:id/:code', adminController.get_confirm_user);

routes.get('/users/:id?', protectRoutes, adminController.get_users);
routes.get('/messages/:id?', protectRoutes, adminController.get_messages);
routes.get('/pending', protectRoutes, adminController.get_pending_transactions);
routes.get('/pending-transactions', protectRoutes, adminController.get_pending_transactions);
routes.get('/delete-user/:id', protectRoutes, adminController.delete_user);
routes.get('/delete-message/:id', protectRoutes, adminController.delete_message);
routes.get('/settings', protectRoutes, adminController.get_settings);
routes.get('/login', redirectToDashboard, adminController.get_login);
routes.get('/', redirectToDashboard, adminController.get_login);
routes.get('/dashboard', protectRoutes, (req, res) => {res.redirect('/users')});
routes.get('/logout', adminController.logout);

routes.post('/send-messages', protectRoutes, adminController.send_message);
routes.post('/update-user/:id', protectRoutes, adminController.update_user);
routes.post('/update-admin', protectRoutes, adminController.update_admin);
routes.post('/confirm-transaction', protectRoutes, adminController.confirm_transaction);
routes.post('/decline-transaction', protectRoutes, adminController.decline_transaction);
routes.post('/reset-password', protectRoutes, adminController.reset_admin_password);
routes.post('/login', redirectToDashboard, adminController.post_login);

module.exports = routes;