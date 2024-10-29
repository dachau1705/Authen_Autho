const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    description: String,
});

module.exports = mongoose.model('Permission', permissionSchema);
