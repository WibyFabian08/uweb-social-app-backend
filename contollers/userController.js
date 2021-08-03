const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10); 
        const password = await bcrypt.hash(req.body.password, salt);

        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: password,
        })

        await user.save();

        return res.status(200).json({
            status: 'ok',
            message: 'register success',
            user
        })
    } catch(err) {
        return res.status(500).json({
            status: 'error',
            message: 'register failed',
            err
        })
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(404).json({
                status: 'error',
                message: 'user not found'
            })
        }
        const password = await bcrypt.compare(req.body.password, user.password)

        if(!password) {
            return res.status(403).json({
                status: 'error',
                message: 'wrong password'
            })
        }

        res.status(200).json({
            status: 'ok',
            message: 'login success',
            user,
        })
    } catch(err) {
        res.status(500).json({
            status: 'error',
            message: 'login failed',
            err
        })
    }
} 