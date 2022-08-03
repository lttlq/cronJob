const express = require('express');
const app = express();
const shortUUID = require('short-uuid');
const cron = require('node-cron');
const _ = require('lodash');
app.use(express.json());
var cronJobs = [];
var status;
const fs = require('fs');
const file = fs.createWriteStream('dates.txt');



app.get('/jobs', (req, res) => {
    status = res.statusCode;
    var _cronJobs = _.cloneDeep(cronJobs);
    _cronJobs.forEach(element => {
        delete element['cron'];
    });

    res.send(JSON.stringify(_cronJobs));
    // fs.writeFile('/dates.txt',JSON.stringify(cronJobs)),function(err){
    //     if(err){
    //         console.log("fck")
    //     }
    // }


});

app.get('/job/:id', (req, res) => {

    var id = req.params.id;
    var job = cronJobs.find(o => o.id == id);
    console.log(job);

    if (job) {
        delete job['cron'];
        res.send(JSON.stringify({ message: "job found.", data: job }));
    } else {
        res.send(JSON.stringify({ message: "job not found.", data: null }));
    }




});

app.get('/job/all', (req, res) => {
    var id = req.params.id;
    for (let i = 0; i < cronJobs.length; i++) {
        if (cronJobs[i].id === id) {

            console.log(cronJobs[i]);
            res.send(JSON.stringify(cronJobs[i]));
        }
    }

});

app.post('/job', (req, res) => {
    status = res.statusCode;
    var job = {
        name: req.body.name,
        cronDateSec: req.body.second,
        cronDateMin: req.body.minute,
        cronDateHour: req.body.hour,
        cronDateDayM: req.body.dayM,
        cronDateMonth: req.body.month,
        cronDateDayW: req.body.dayW,
        cronDateYear: req.body.Year,
        cronStatus: req.body.cronStatus,
        id: shortUUID.generate()
    };
    //console.log(job.myDate.minute);

    var jobCheck = cronJobs.find(o => o.name == job.name);
    if (jobCheck) {
        res.send("already exist");
    }
    else {

        if (job.cronStatus === "active") {
            job['cron'] = task;
            cronJobs.push(job);
            res.send("ok");
            console.log(job.cronDateDayM + job.cronDateDayW + job.cronDateHour + job.cronDateSec + job.cronDateMonth + job.cronDateMin + job.cronDateYear);
            var task = cron.schedule(
                `${job.cronDateSec} ${job.cronDateMin} ${job.cronDateHour} ${job.cronDateDayM} ${job.cronDateMonth} ${job.cronDateDayW} ${job.cronDateYear}`,
                function () {
                    console.log("working..");
                });

            //console.log(cron.scheduledJobs);

        }
        else {
            job['cron'] = task;
            cronJobs.push(job);
            res.send("ok");
            console.log('pending');
            //     file.on('error', function(err) { /* error handling */ });
            //     cronJobs.forEach(function(v) { file.write(v.join(', ') + '\n'); });
            //     file.end();
            //    }

        }


    }



});

app.delete('/job', (req, res) => {
    status = res.statusCode;
    var id = req.body.id;
    var job = cronJobs.find(o => o.id == id);
    console.log(job);

    if (job) {
        cronJobs = cronJobs.filter(o => o.id != job.id);
        job.cron.cancel();
        res.send(JSON.stringify({ message: "job deleted." }));
    } else {
        res.send(JSON.stringify({ message: "job not found." }));
    }



});

app.put('/jobs/:id', (req, res) => {
    status = res.statusCode;
    var id = req.params.id;

    var job = cronJobs.find(o => o.id == id);


    if (job) {

        job = {

            ...job,
            ...req.body

        }
        cron.schedule(
            `${job.cronDateSec} ${job.cronDateMin} ${job.cronDateHour}
                     ${job.cronDateDayM} ${job.cronDateMonth} ${job.cronDateDayW} ${job.cronDateYear}`,
            function () {
                console.log("working")
            });

        
    }

    res.json({
        success: true,
        data: job
    });

});

app.listen(5001, () => {
    console.log("listening 5001...")
});

