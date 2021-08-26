const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest } = require('../middlewares/guards');


router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});

router.post('/register',
       async (req, res) => {
        const userTrim = req.body.username.trim();
        const passTrim = req.body.password.trim();

        let message = [];
        // if (errors.length > 0) {
        //     message = errors.map(e => e.msg);
        // };

        // if (!userTrim) {
        //     message.push('Please enter username');
        // }
        // else if (userTrim.length < 3) {
        //     message.push('Username must be at least 3 characters long')
        // }
        // else if (!/^[a-zA-Z0-9]+$/.test(passTrim)) {
        //     message.push('Username must consist only english letters and numbers')
        // };

        // if (!passTrim) {
        //     message.push('Please enter password');
        // }
        // else if (passTrim.length < 3) {
        //     message.push('Password must be at least 3 characters long');
        // }


        if (message.length > 0) {
            const messageStr = message.join('\n');
            console.log('message LOG-> ', message)
           
            res.status(400).send(messageStr);
            throw new Error(messageStr);
        }

        try {
          const postRegister =  await req.auth.register(userTrim, /*req.body.email.trim(),*/ passTrim);  
          console.log("success register")
            res.status(200).send(JSON.stringify("Successful Registration"));

        } catch (err) {
            console.log('register err ->', err.message);
        
            res.status(400).send(err.message)
        }
    }
);

router.get('/login', isGuest(), (req, res) => {
    console.log('GET login')
    res.render('user/login');
});

router.post('/login', /*isGuest(),*/ async (req, res) => {
    console.log('post login')
    const userTrim = req.body.username.trim();
    const passTrim = req.body.password.trim();
    console.log('username -> ',userTrim);
    console.log('password -> ',passTrim);

    
    try {
        const response = await req.auth.login(userTrim, passTrim);
console.log('login response -> ', response)
       res.status(200).send(JSON.stringify("Successful Login"))                        //TODO change redirect location

    } catch (err) {
        console.log('login err ->', err.message);
        
            res.status(400).send(err.message)

    }

});

router.get('/logout', async (req, res) => {
    try {
        await req.auth.logout();
        res.redirect('/');                   //TODO change according project requirements
    } catch (err) {
        console.log(err.message);
        res.render('/');                    //TODO change according project requirements
    }
});



module.exports = router;