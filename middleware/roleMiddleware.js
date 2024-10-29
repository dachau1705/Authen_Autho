const Role = require('../models/Role');
const User = require('../models/User');

const checkPermission = (permission) => {
    return async (req, res, next) => {
        const userRoles = req.user;
        const user = await User.findById(userRoles.userId).populate('roles');
        const roles = await Role.find({ _id: { $in: user.roles } }).populate('permissions');

        const hasPermission = roles.some((role) =>
            role.permissions.some((perm) => perm.name === permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

const checkRoles = (roleuser) => {
    return async (req, res, next) => {
        const userRoles = req.user;
        const user = await User.findById(userRoles.userId).populate('roles');
        const roles = await Role.find({ _id: { $in: user.roles } })
        const hasPermission = roles.some((role) =>
            role.name === roleuser
        );

        if (hasPermission) {
            next();
        } else {
            return res.status(403).send('Access Denied: You do not have the right permissions.');
        }
    };
};

module.exports = { checkPermission, checkRoles };
