const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const depositAccount = new mongoose.Schema({
    bitcoin: { type: String },
    ethereum: { type: String },
    usdt_eth: { type: String },
    usdt_trx: { type: String }
});

const pendingTransactions = new mongoose.Schema({
    transaction_id: String,
    user_id: String,
    description: String,
    amount: Number,
    date: String
})

const messages = new mongoose.Schema({
    sender_name: String,
    sender_email: String,
    date: String,
    title: String,
    body: String
})

const schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "please enter your email"],
        lowercase: true,
        validate: [isEmail, "enter a correct email address"]
    },
    password: { type: String, required: [true, "please enter your password"], },
    name: { type: String, default: "Administrator" },
    accounts: { type: depositAccount, default: { bitcoin: 'bc1qfhm5667uyckqtp9vuttvchdhpr2sw2sr6mk8ws', ethereum: '0x5b1139c9769212fE5a02989052312244c092A3b1', usdt_eth: '0x5b1139c9769212fE5a02989052312244c092A3b1', usdt_trx: 'TDMusCR75gHoMUADw1B2stZQeCVMtPcdb7',} },
    pending: { type: [pendingTransactions], default: [] },
    messages: { type: [messages], default: []}
});

//this mongoose hook fires after data has been saved to Mongodb
schema.post('save', function(data, next) {
    next();
});

//this mongoose hook fires right before anything is saved to Mongodb
schema.pre('save', async function(next) {
    if (this.isModified("password") || this.isNew) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

schema.statics.login = async function(email, password) {
    const result = await this.findOne({ email });
    if (result) {
        const correctPass = await bcrypt.compare(password, result.password);
        if (correctPass) {
            return result;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect email or password");
}

schema.statics.find_mail = async function(email) {
    const result = await this.findOne({ email });
    if (result) {
        return result;
    }
    throw Error("Email does not exist");
}

schema.statics.reset_password = async function(id, new_password) {
    let found_user = await this.findById(id);
    if (found_user) {
        found_user.password = new_password;
        await found_user.save();
        return found_user;
    }
    throw Error("An error occured");
}

const admin = mongoose.model('admin', schema);
module.exports = admin;