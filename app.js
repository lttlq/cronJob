const express = require('express');
const app = express();
const shortUUID = require('short-uuid');
const cron = require('node-schedule');
const _ = require('lodash');
app.use(express.json());
var cronJobs = [];
var status;
const fs = require('fs');
const file = fs.createWriteStream('dates.txt');



app.get('/jobs', (req, res) => {
    status=res.statusCode;
    var _cronJobs = _.cloneDeep(cronJobs);
    _cronJobs.forEach(element => {
        delete element['cron'];
    });
    
    res.send(JSON.stringify(_cronJobs));
    fs.writeFile('/dates.txt',JSON.stringify(cronJobs)),function(err){
        if(err){
            console.log("fck")
        }
    }

    
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

app.get('/job/all',(req,res)=>{
    var id=req.params.id;
    for(let i = 0;i<cronJobs.length;i++){
        if(cronJobs[i].id===id){
           
            console.log(cronJobs[i]);
            res.send(JSON.stringify(cronJobs[i]));
        }
    }
    
});

app.post('/job', (req, res) => {
    status=res.statusCode;
        var job = {
            name:req.body.name,
            myDate:req.body.cronDate,
            cronDateSec:req.body.cronDate.second,
            cronDateMin:req.body.cronDate.minute,
            cronDateHour:req.body.cronDate.hour,
            cronDateDayM:req.body.cronDate.dayM,
            cronDateMonth:req.body.cronDate.month,
            cronDateDayW:req.body.cronDate.dayW,
            cronDateYear:req.body.cronDate.year,
            cronStatus:req.body.cronStatus,
           
            startTime:req.body.startTime,
            endTime:req.body.endTime,
            id: shortUUID.generate()
        };
        console.log(job.myDate.minute);
      
        var jobCheck = cronJobs.find(o => o.name == job.name);
        if (jobCheck) {
            res.send("already exist");
        }
        else {
            if(job.cronStatus==="active"){
                job['cron'] = task;
                cronJobs.push(job);
                res.send("ok");
                fs.writeFile('/dates.txt',cronJobs,err=>{
                    if (err){
                        console.log(err);
                    }
                });
                var task = cron.scheduleJob(
                
                    // start: job.startTime,
                   
                    // end:job.endTime ,
                    `${job.id}`,
                    `${job.cronDateSec} ${job.cronDateMin} ${job.cronDateHour}
                     ${job.cronDateDayM} ${job.cronDateMonth} ${job.cronDateDayW}`, 
                      function () {
                          console.log("working")
                        });
             
          }
          else{
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
    status=res.statusCode;
        var id = req.body.id;
        var job = cronJobs.find(o => o.id == id);
        console.log(job);
       
        if (job) {
            cronJobs = cronJobs.filter(o => o.id != job.id);
            job.cron.cancel();
            res.send(JSON.stringify({ message: "job deleted."}));
        } else {
            res.send(JSON.stringify({ message: "job not found." }));
        }
    
  
    
});

app.put('/jobs/:id',(req,res)=>{
    status=res.statusCode;
        var id=req.params.id;
    
        var job = cronJobs.find(o => o.id == id);
     
            for(let i = 0;i<cronJobs.length;i++){
                if(cronJobs[i].id===id){
                   
                    cronJobs[i]={
                      
                        ...cronJobs[i],
                        ...req.body
                        
                    }
                    cron.scheduleJob(
                
                        `${cronJobs[i].id}`,
                        `${cronJobs[i].cronDateSec} ${cronJobs[i].cronDateMin} ${cronJobs[i].cronDateHour}
                         ${cronJobs[i].cronDateDayM} ${cronJobs[i].cronDateMonth} ${cronJobs[i].cronDateDayW} ${cronJobs[i].cronDateYear}`,
                          function () {
                              console.log("working")
                            });
                
                console.log("alo2");
                }
            }
            
           
      
        
       if(job){

                // job.cron={
                //     ...job,
                //     ...req.body
                // }
                

        //    cron.scheduleJob(
                
        //             `${job.id}`,
        //             `${job.cronDateSec} ${job.cronDateMin} ${job.cronDateHour}
        //              ${job.cronDateDayM} ${job.cronDateMonth} ${job.cronDateDayW} ${job.cronDateYear}`,
        //               function () {
        //                   console.log("working")
        //                 });
            
        //     console.log("alo2");
        }
        res.json({
            success:true,
            data:cronJobs
        });
    
});    

app.listen(5001, () => { 
    console.log("listening 5001...") 
});

