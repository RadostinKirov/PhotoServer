const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/user');
const { COOKIE_NAME, TOKEN_SECRET } = require('../config/index');

module.exports = () => (req, res, next) => {

    if (parseToken(req, res)) {
        req.auth = {
            async register(username, password) {
                const token = await register(username, password);
                const cookieInfo = `${COOKIE_NAME}=${token}; SameSite=None; Secure`;
                res.cookie(cookieInfo);
                return (COOKIE_NAME, token);
            },
            async login(username, password) {

                const [token, userInfo] = await login(username, password);
                const cookieInfo = `${COOKIE_NAME}=${token}; SameSite=None; Secure`;
                res.cookie(cookieInfo);

                return (COOKIE_NAME, token, userInfo);
            },
            logout() {
                res.clearCookie(COOKIE_NAME);
            }
        }
        next();
    }
};



async function register(username, password) {                                       //Email

    const existUsername = await userService.getUserByUsername(username);
    //       const existEmail = await userService.getUserByEmail(email);                             //Email


    if (existUsername) {
        throw new Error('Username is taken!');
    }
    // else if (existEmail) {                                                                  //Email
    //     throw new Error('Email is taken!');
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser(username, /*email,*/ hashedPassword);                //Email

    return generateToken(user);
}

async function login(username, password) {
    const user = await userService.getUserByUsername(username);
    const hasMatch = !user ? false : await bcrypt.compare(password, user.hashedPassword);

    if (!user || !hasMatch) {
        if (!user) {
            console.log('No such user');
        }
        if (!hasMatch) {
            console.log('Incorrect password');
        }
        throw new Error('Invalid username or password');
    }

    return [generateToken(user), user];
}


function generateToken(userData) {
    return jwt.sign({
        _id: userData._id,
        username: userData.username,
        //       email: userData.email                                            //Email
    }, TOKEN_SECRET);
}


function parseToken(req, res) {
    const token = req.cookies[COOKIE_NAME];
    if (token) {

        try {
            const userData = jwt.verify(token, TOKEN_SECRET);
            req.user = userData;
            res.locals.user = userData;
            return true;
        } catch (err) {
            res.clearCookie(COOKIE_NAME);
            res.redirect('/auth/login');
            return false;
        }
    }
    return true;
}



