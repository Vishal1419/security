/**
 * Created by vishal sherathiya on 16/09/17.
 */

const userController = require('../controllers/userController.js');

module.exports = function (server) {
    server.get("user/getAll",
        userController.getAll
    );
    server.post("user/save",
        userController.save
    );
};