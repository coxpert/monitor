const schedule = require('node-schedule');
const { exec } = require('child_process');

const job = schedule.scheduleJob('*/3 * * * * *', function(){
    exec('node -v', (err, stdout, stderr) => {
        if (err) {
          return;
        }
       
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
});