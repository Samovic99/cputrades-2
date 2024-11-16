const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const dayjs = require('dayjs');
const {user_verification_status} = require("../utility/app-utility");

const userAccount = new mongoose.Schema({
    bonus: { type: Number, required: false },
    active_plans: { type: Number, required: true },
    balance: { type: Number, required: true },
    ref_bonus: { type: Number, required: true },
    earnings: { type: Number, required: true }
});

const userSettings = new mongoose.Schema({
    notification: { type: Boolean },
    currency: {type: String},
    language: {type: String}
});

const userPlans = new mongoose.Schema({
    amount: { type: Number },
    type: {type: String},
    date: {type: String}
});

const userTransactHistory = new mongoose.Schema({
    description: String,
    status: String,
    amount: Number,
    date: String
})

const verification = new mongoose.Schema({
    filename: String,
    path: String
});

const schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "please enter your email"],
        lowercase: true,
        validate: [isEmail, "enter a correct email address"]
    },
    password: { type: String, required: [true, "please enter your password"] },
    firstname: { type: String, required: [true, "please enter your firstname"], lowercase: true },
    lastname: { type: String, required: [true, "please enter your lastname"], lowercase: true },
    // dob: { type: Number, required: [true, "please enter your date of birth"] },
    // gender: { type: String, required: [true, "gender required"] },
    ref_code: { type: String, default: "AA000" },
    referrer: { type: String, default: null },
    update: { type: Number, default: 0 },
    reg: { type: String, default: (new Date().toISOString()) },
    status: {type: String, default: user_verification_status.unverified},
    mobile: { type: String, /*required: [true, "please enter your mobile number"],*/ lowercase: true },
    country: { type: String, required: [true, "please select your country"], lowercase: true },
    state: { type: String, required: [true, "please select your state"], lowercase: true },
    address: { type: String, /*required: [true, "please enter your address"],*/ lowercase: true },
    picture: { type: String, default: "/img/pictures/default.png" },
    account: { type: userAccount, default: { active_plans: 0, ref_bonus: 0, balance: 0, earnings: 0, bonus: 0 } },
    history: { type: [userTransactHistory], default: [] },
    plans: { type: [userPlans], default: [] },
    settings: { type: userSettings, default: { notification: false, currency: 'usd', language: 'en' } },
    verification: {type: [verification], default: []}
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
    this.firstname = this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1).toLowerCase();
    this.lastname = this.lastname.charAt(0).toUpperCase() + this.lastname.slice(1).toLowerCase();
    this.address = this.address.charAt(0).toUpperCase() + this.address.slice(1).toLowerCase();
    this.state = this.state.charAt(0).toUpperCase() + this.state.slice(1).toLowerCase();
    this.country = this.country.charAt(0).toUpperCase() + this.country.slice(1).toLowerCase();
    next();
});

schema.statics.login = async function(email, password) {
    const result = await this.findOne({ email });
    if (result) {
        const correctPass = await bcrypt.compare(password, result.password);
        if (correctPass) {
            return result;
        }
        throw Error("Incorrect email or password");
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

schema.statics.update_profits = async function() {
    try {
        const result = await this.find({});
        const currentTime = Date.now();
        const recent = dayjs(currentTime);

        for (const element of result) {
            if (element.update > 0 && (recent.diff(dayjs(element.update), 'week') == 3)) {
                element.account.profit = element.account.profit + calcPercent(element.account.btc + element.account.eth + element.account.usdt);
                element.update = currentTime;
                await element.save();
            }

            if (element.account.bonus <= 0) {
                element.account.bonus = element.account.bonus + 20;
                await element.save();
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function calcPercent(amount) {
    return (Math.round((250 / 100) * amount));
}

const user = mongoose.model('user', schema);
module.exports = user;