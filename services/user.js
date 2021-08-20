const User = require('../models/User');


async function createUser(username, /*email,*/ hashedPassword) {            //Email..... according to specifics


    const user = new User({
        username,
    //    email,                                                       //Email.... according to specifics
        hashedPassword
    });
    console.log(user);
    user.save();
    return user;

}


async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');
    const user = await User.findOne({ username: { $regex: pattern } });
    return user;
}


async function getUserByEmail(email) {                                              // Only if Email
    const pattern = new RegExp(`^${email}$`, 'i');
    const user = await User.findOne({ email: { $regex: pattern } });
    console.log(user)
    return user;
}


module.exports = {
    createUser,
    getUserByUsername,
    getUserByEmail
};