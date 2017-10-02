/**
 * Created by vishal sherathiya on 16/09/17.
 */

const licenceController = require('../controllers/licenceController.js');

module.exports = function (server) {
    server.get("licence/generateKeys",
        licenceController.generateKeys
    );
    server.get("licence/getAll",
        licenceController.getAll
    );
    server.get("licence/getAllUsed",
        licenceController.getAllUsed
    );
    server.get("licence/getAllUnused",
        licenceController.getAllUnused
    );
    server.get("licence/getAllUpdated",
        licenceController.getAllUpdated
    );
    server.post("licence/getLicenceKeyFromHDD",
        licenceController.getLicenceKeyFromHDD
    )
};