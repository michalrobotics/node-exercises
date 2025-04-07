const jwt = require('jsonwebtoken');
const Member = require('../models/member');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'ihaveboobies');
        const member = await Member.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!member) {
            throw new Error();
        }

        if (req.method !== 'GET' && !member.isLeader) {
            throw new Error();
        }

        req.token = token;
        req.member = member;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}

module.exports = auth;
