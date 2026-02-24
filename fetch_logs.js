const { exec } = require('child_process');
const fs = require('fs');

exec('"C:\\Users\\thien\\AppData\\Local\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd" builds log ba81ff4c-285e-48fb-b62f-39f104e8ce15 --region=asia-southeast1', (error, stdout, stderr) => {
    fs.writeFileSync('build_log_output.txt', stdout || stderr);
    if (error) {
        fs.appendFileSync('build_log_output.txt', '\nERROR: ' + error.message);
    }
});
