const express = require('express');
const monk = require('monk');
const jwt = require('jsonwebtoken');

// DB
const db = monk(process.env.MONGO_URI);
const users = db.get('users');

const router = express.Router();

router.post('/login', async(req, res, next) => {
    try {
        // Check if user/pass is correct
        const user = await users.findOne({user: req.body.user, password: req.body.password})
        if(!user) return res.status(400).json({error: 'Invalid user/pass'})
        
        // Create and assing a token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.header('auth-token', token)
        res.json({
            message: "logged in",
            user: user
        })
        db.close()
    } catch (error) {
        next(error)
    }
})


router.get('/verify-token', (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) res.status(401).json({message: 'Acces denied'})
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        res.status(200).json({
            message: 'verified token',
            user: verified
        })
    } catch (error) {
        res.status(400).json({message: 'Invalid token'})
    }
})
module.exports = router;