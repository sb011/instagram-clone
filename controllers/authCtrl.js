const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authCtrl = {
    register: async (req, res) => {
        try {
            const { fullname, username, email, password, gender } = req.body;
            let newUserName = username.toLowerCase().replace(/ /g, '');

            const user_name = await Users.findOne({ username: newUserName });
            if (user_name)
                return res.status(400).json({ msg: "This Username is already in Use." });

            const user_email = await Users.findOne({ email });
            if (user_email)
                return res.status(400).json({ msg: "This Email is already in Use." });

            if (password.length < 6)
                return res.status(400).json({ msg: "Password must be at least 6 characters." });

            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = new Users({
                fullname, username: newUserName, email, password: passwordHash, gender
            })

            const access_token = createAccessToken({ id: newUser._id });
            const refresh_token = createRefreshToken({ id: newUser._id });

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/refresh_token',
                maxAge: 30 * 7 * 24 * 60 * 60 * 1000
            })

            await newUser.save();

            res.json({
                msg: 'Registered Successfully!!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email }).populate("followers follwing", "avatar username fullname followers follwing");

            if (!user)
                return res.status(500).json({ msg: "This email does not exist." });

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch)
                return res.status(500).json({ msg: "Password is Wrong." });

            const access_token = createAccessToken({ id: user._id });
            const refresh_token = createRefreshToken({ id: user._id });

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/refresh_token',
                maxAge: 30 * 7 * 24 * 60 * 60 * 1000
            })

            res.json({
                msg: 'Login Successfully!!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/refresh_token' })
            return res.json({ msg: "Logout Successfully!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;

            if (!rf_token)
                return res.status(400).json({ msg: "Please Login!!" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
                if (err)
                    return res.status(400).json({ msg: "Please login!!" });

                const user = await Users.findById(result.id).select("-password").populate("followers following", "avatar username fullname followers follwing");

                if (!user)
                    return res.status(400).json({ msg: "User is not exist :(" });

                const access_token = createAccessToken({ id: result.id });

                res.json({
                    access_token,
                    user
                });
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
}

module.exports = authCtrl;