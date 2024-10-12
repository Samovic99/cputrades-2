const usersModel = require('../models/users-model');
const adminModel = require('../models/admin-model');
const { sendWelcomeMail, sendVerificationFailedMail, confirmTransaction, declineTransaction, sendReferralMail } = require('./mail-controller');
// const adminEmail = require('../app');
const { showError, createToken } = require('./auth-controller');
const { adminEmail, user_verification_status, isStringEmptyOrWhitespace } = require('../utility/app-utility');
const user = require('../models/users-model');

// Note that in all operations that uses Admin Mail to fetch admin, a similar thing done with user's could be done
// In the sense that while protecting routes, admin data could be assigned to res.locals and then the id used afterwards

const shouldRenderDashboardInstead = (req) => {
    const fetchData = req.headers['fetch-data'];
    return (fetchData === undefined ? true : (fetchData === 'false'));
}

const renderDashboard = (res) => {
    res.sendFile('html/admin/index.html', { root: __basedir })
}

const isWithdrawal = (description, amount) => {
    const regex = new RegExp('withdrawal', 'i'); // 'i' flag makes the search case-insensitive
    return (regex.test(description) ? Number.parseInt(-amount) : Number.parseInt(amount));
}

module.exports.get_users = async(req, res) => {
    // const fieldsToReturn = 'name email balance'; // List of fields to include, separated by spaces
    const fieldsToExclude = '-password -history'; // Prefix the field with a '-' to exclude it

    if (shouldRenderDashboardInstead(req)) {
        renderDashboard(res);
    } else {
        let { limit, page } = req.query;
        limit = Number.parseInt(limit || 15);
        page = Number.parseInt(page || 1);
        let result = {status: true, message: "", data: {}}

        try {
            const skip = (page - 1) * limit;
            const users = await usersModel.find({}).select(fieldsToExclude).skip(skip).limit(limit).exec();
            result.totalUsers = await usersModel.countDocuments();

            result.data = {users/*, totalPages: Math.ceil(totalUsers / limit)*/};
            res.status(200).json(result);
        } catch (error) {
            result.status = false;
            result.message = "Unable to fetch data";
            res.status(422).json(result);
        }
    }
}

module.exports.get_settings = async(req, res) => {
    if (shouldRenderDashboardInstead(req)) {
        renderDashboard(res);
    } else {
        let result = {status: true, message: "", data: {}}

        try {
            const returnedValue = await adminModel.findOne({ email: adminEmail }, "accounts");

            result.data = {accounts: returnedValue.accounts};
            res.status(200).json(result);
        } catch (error) {
            result.status = false;
            result.message = "Unable to fetch data";
            res.status(422).json(result);
        }
    }
}

module.exports.get_messages = async(req, res) => {
    if (shouldRenderDashboardInstead(req)) {
        renderDashboard(res);
    } else {
        let { limit, page } = req.query;
        limit = Number.parseInt(limit || 10);
        page = Number.parseInt(page || 1);
        let result = {status: true, message: "", data: {}}

        try {
            const messagesResult = await adminModel.aggregate([
                { $match: { email:  adminEmail} }, // Match the user by email
                {
                  $project: {
                    messages: { $slice: ['$messages', (page - 1) * limit, limit] },
                    totalMessages: { $size: '$messages' } // Include the total count of posts
                  }
                }
            ]);
    
            result.totalMessages = messagesResult[0].totalMessages;
            result.data = {messages: messagesResult[0].messages}
            res.status(200).json(result);
        } catch (error) {
            result.status = false;
            result.message = "Unable to fetch data";
            res.status(422).json(result);
        }
    }
}

module.exports.get_confirm_user = async(req, res) => {
    const {id, code} = req.params;

    try {
        let userStatus = code == 0 ? user_verification_status.failed : user_verification_status.verified;
        let userResult = await user.findByIdAndUpdate(
            id,
            { $set: {status: userStatus} },
            { new: true}
        );
        if (!userResult) {
            throw Error("User not found");
        } else {
            if (userStatus == user_verification_status.failed) {
                await sendVerificationFailedMail(userResult.email, userResult.firstname);
                res.status(201).send("User not verified");
            } else {
                const referrer = userResult.referrer;
                if (referrer) {
                    usersModel.findOneAndUpdate(
                        {ref_code: referrer},
                        {$inc: {'account.ref_bonus': 25}}
                    ).then((value) => {
                        sendReferralMail(value.email, value.firstname);
                        console.log('referred', value)
                    }).catch((error) => {console.log(error)});
                }
                await sendWelcomeMail(userResult.email, userResult.firstname);
                res.status(201).send("User verified");
            }
        }
    } catch (error) {
        res.status(422).send(error.message);
    }
}

module.exports.get_pending_transactions = async(req, res) => {
    if (shouldRenderDashboardInstead(req)) {
        renderDashboard(res);
    } else {
        let { limit, page } = req.query;
        limit = Number.parseInt(limit || 10);
        page = Number.parseInt(page || 1);
        let result = {status: true, message: "", data: {}}

        try {
            const transactionsResult = await adminModel.aggregate([
                { $match: { email:  adminEmail} }, // Match the user by email
                {
                  $project: {
                    transactions: { $slice: ['$pending', (page - 1) * limit, limit] },
                    totalTransactions: { $size: '$pending' } // Include the total count of posts
                  }
                }
            ]);
    
            result.totalTransactions = transactionsResult[0].totalTransactions;
            result.data = {transactions: transactionsResult[0].transactions}
            res.status(200).json(result);
        } catch (error) {
            result.status = false;
            result.message = "Unable to fetch data";
            res.status(422).json(result);
        }
    }
}

module.exports.delete_user = async(req, res) => {
    const { id } = req.params
    let result = {status: false, message: "", data: {}}

        try {
            let deletedUser = await usersModel.findByIdAndDelete(id);

            if (!deletedUser) {
                result.message = 'User not found';
            } else {
                result.status = true;
                result.message = " User deleted successfully";
            }

            res.status(201).json(result);
        } catch (error) {
            result.message = 'Unknown error occurred';
            res.status(422).json(result);
        }
}

module.exports.confirm_transaction = async(req, res) => {
    const { user, transaction, description } = req.body
    let result = {status: false, message: "", data: {}}

    try {
        const updatedUser = await usersModel.updateOne(
            { 
                _id: user, 
                history: {
                    $elemMatch: { _id: transaction, status: "pending" }
                }
            },  // Find the user by ID and matching status in array history
            { $set: { "history.$.status": "success" } } // Update the status field
        );

        if (updatedUser.modifiedCount) {
            // TODO Manually
            const selectedValues = await usersModel.findOne(
                { 
                    _id: user, 
                    history: {
                        $elemMatch: {_id: transaction}
                    }
                }, 
                { "history.$": 1, "account.balance": 1 }
            );
            const transactionAmount = isWithdrawal(description, selectedValues.history[0].amount);
            usersModel.findByIdAndUpdate(
                user,
                { $inc: { "account.balance":  transactionAmount} }, // Increment accounts.balance by transactionAmount
                { new: true } // Return the updated document
            ).then(newUser => {
                // console.log(newUser); // Should show the updated balance
                confirmTransaction(newUser.email, newUser.firstname, (transactionAmount >= 1), selectedValues.history[0].amount)
                const referrer = newUser.referrer;
                const bonusAmount = (2/100) * transactionAmount;
                if (referrer) {
                    usersModel.findOneAndUpdate(
                        {ref_code: referrer},
                        {$inc: {'account.ref_bonus': bonusAmount}}
                    ).then((value) => {console.log('referred', value)}).catch((error) => {console.log(error)});
                }
                console.log("balance updated");
            }).catch(error => {
                console.error(error);
            });

            // TODO Automatically
            // usersModel.findOneAndUpdate(
            //     { _id: user, "history._id": transaction }, // Query to find the user and specific item in A
            //     { $inc: { "account.balance": "$history.$[elem].amount" } }, // Increment account.balance by the amount from the matched item
            //     {
            //         arrayFilters: [{ "elem._id": transaction }], // Array filter to target the specific element in history
            //         new: false, // Don't return the updated document
            //     }
            // );

            const updatedAdminModel = await adminModel.findOneAndUpdate(
                { email: adminEmail }, // Query to find admin by their email
                {
                    $pull: {
                        pending: {
                            transaction_id: transaction,
                            user_id: user,
                        },
                    },
                }, // Condition to match and remove the specific item from the pending array
                { new: true, projection: { "pending": 1 } } // Return the updated document. projection was just added
            );
            result.status = true;
            result.totalTransactions = updatedAdminModel.pending.length;
            result.data = {transactions: updatedAdminModel.pending}
            result.message = 'Transaction confirmed successfully';
        } else {
            result.message = 'Operation failed. Could not find user or transaction';
        }
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        result.message = 'Unknown error occurred';
        res.status(422).json(result);
    }
}

module.exports.decline_transaction = async(req, res) => {
    const { user, transaction, amount, description } = req.body
    let result = {status: false, message: "", data: {}}

    try {
        const updatedUser = await usersModel.findOneAndUpdate(
            { 
                _id: user, 
                history: {
                    $elemMatch: { _id: transaction, status: "pending" }
                }
            },  // Find the user by ID and matching status in array A
            { $set: { "history.$.status": "failed" } }, // Update the status field
            { new: true, projection: { "email": 1, "firstname": 1, "lastname": 1 } }
        );
        console.log(updatedUser);

        if (updatedUser) {
            const updatedAdminModel = await adminModel.findOneAndUpdate(
                { email: adminEmail }, // Query to find admin by their email
                {
                    $pull: {
                        pending: {
                            transaction_id: transaction,
                            user_id: user,
                        },
                    },
                }, // Condition to match and remove the specific item from the pending array
                { new: true, projection: { "pending": 1 } } // Return the updated document. projection was just added
            );
            const transactionAmount = isWithdrawal(description, amount);
            declineTransaction(updatedUser.email, updatedUser.firstname, (transactionAmount >= 1), amount)
            result.status = true;
            result.totalTransactions = updatedAdminModel.pending.length;
            result.data = {transactions: updatedAdminModel.pending}
            result.message = 'Transaction declined successfully';
        } else {
            result.message = 'Operation failed. Could not find user or transaction';
        }
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        result.message = 'Unknown error occurred';
        res.status(422).json(result);
    }
}

module.exports.delete_message = async(req, res) => {
    const { id } = req.params
    let result = {status: false, message: "", data: {}}

    try {
        const updatedAdminModel = await adminModel.findOneAndUpdate(
            { email: adminEmail },
            {
                $pull: {
                    messages: {
                        _id: id
                    },
                },
            },
            { new: true, projection: { "messages": 1 } } // Return the updated document. projection was just added
        );

        if (updatedAdminModel) {
            result.status = true;
            result.data = {messages: updatedAdminModel.messages}
            result.message = 'Message successfully deleted';
        } else {
            result.message = 'Operation failed. Could not find or delete message';
        }

        res.status(201).json(result);
    } catch (error) {
        result.message = 'Unknown error occurred';
        res.status(422).json(result);
    }
}

module.exports.send_message = async(req, res) => {
    let {email, name, title, body} = req.body;
    let result = {status: false, message: "", data: {}}

    
}

module.exports.update_user = async(req, res) => {
    const {id} = req.params;
    const {earnings} = req.body;

    try {
        let updatedUser = await usersModel.findByIdAndUpdate(
            id,
            {$set: {'account.earnings': earnings}},
            {new: true, projection: {'account.earnings': 1}}
        );
        if (!updatedUser) {
            throw Error("Can't find or update user")
        } else {
            res.status(201).json({status: true, message: "User's earnings updated successfully", data: {}});
        }
    } catch (error) {
        res.status(422).json({status: false, message: error.message, data: {}});
    }
}

module.exports.update_admin = async(req, res) => {
    const {tokens} = req.body;
    let result = {status: false, message: "", data: {}}

    try {
        let updatedAdmin = await adminModel.findOneAndUpdate(
            {email: adminEmail},
            { $set: { accounts: tokens } }, // Replace the entire "account" object
            { new: true, projection: { "accounts": 1 } }
        );

        if(updatedAdmin) {
            result.status = true;
            result.data = {accounts: updatedAdmin.accounts}
            result.message = "Data updated successfully";
        } else {
            result.message = "Failed! Unable to update data";
        }

        res.status(201).json(result);
    } catch (error) {
        result.message = 'Unknown error occurred';
        res.status(422).json(result);
    }
}

module.exports.reset_admin_password = async(req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        if (isStringEmptyOrWhitespace(oldPassword) || isStringEmptyOrWhitespace(newPassword)) {
            throw Error("Fields cannot be empty");
        }

        const user = await adminModel.login(adminEmail, oldPassword);
        await adminModel.reset_password(user._id, newPassword);
        res.status(201).json({status: true, message: "Password reset successfully", data: {}});
    } catch (error) {
        console.log(error);
        res.status(422).json({status: false, message: error.message, data: {}});
    }
}

module.exports.logout = async(req, res) => {
    res.cookie('token', ' ', { maxAge: 1, httpOnly: true, secure: true });
    res.redirect('/');
}

module.exports.get_login = async(req, res) => {
    res.sendFile('html/admin/login.html', { root: __basedir })
}

module.exports.post_login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await adminModel.login(email, password);
        const token = createToken(user._id);

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
        res.status(200).json({ status: true, message: "", data: {} });
    } catch (err) {
        let errors = showError(err);
        res.status(400).json(errors);
    }
}