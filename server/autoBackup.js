require("dotenv").config();

const { autoBackup } = require("./services/backupService");

(async () => {

    console.log("Business ERP Auto Backup Started");

    const result = await autoBackup();

    console.log(result);

    process.exit();

})();