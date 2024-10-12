module.exports.adminEmail = 'administrator@cputrades.com';

module.exports.user_verification_status = {verified: "VERIFIED", unverified: "UNVERIFIED", verifying: "VERIFYING", failed: "FAILED"};

module.exports.isStringEmptyOrWhitespace = (str) => {
    return str.trim() === '';
}