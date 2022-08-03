const cron = require('node-schedule');

cron.scheduleJob('a', "* * * * * *", async () => {
  console.log("alo")});
  

  const key = "a";
const job = cron.scheduledJobs[key];
if (job) {
  job[key].reschedule(newDate.getTime());
}