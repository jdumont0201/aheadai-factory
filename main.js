const {Docker} = require('node-docker-api');
//const git = require("nodegit");
const path=require("path")
//const tar = require('tar-fs');
const express = require('express')

var cors = require('cors')
var app = express()
const docker = new Docker({ 
  //socketPath: '/var/run/docker.sock' 
});
app.use(cors())
const port = 3030
const  bodyParser = require('body-parser');
    app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));     
const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', data => console.log(data.toString()))
    stream.on('end', resolve)
    stream.on('error', reject)
  });


app.post('/docker', (req, res) => {
  console.log("POST",req.url)
if(!req.body.params){
  res.json({success:false,error:"No post parameter called 'params'"})
  return;
}
console.log("post",req.body)
    let params=JSON.parse(req.body.params)
    let dataset=params.dataset;
    let algo=params.algo;
    let job=params.job;
    let run=params.run;
    let repo=algo.repo;
    let teamId=params.team.id;
    
    let tag="ahead-job-"+teamId+"-"+run.id

    let datatable=dataset.datatables[0]
    let datatableUrl="http://localhost:3000/api/datatables/"+datatable.id+"/dataentries"
    let algopath=algo.username+":"+algo.token+"@"+algo.repo;
    
    let buildCmd="docker build -t "+tag + " --build-arg DATASET_REPO="+datatableUrl+" --build-arg ALGO_REPO="+algopath
    let dockerFilePath="build/Dockerfile";
  //  let finalTag="ahead-job-"+job.id
    console.log("ALGO_REPO   : "+algo.repo);
    console.log("DATASET     : "+dataset.id)
    console.log("DATATABLE   : "+datatable.id)
    
    console.log("DATA URL    : "+datatableUrl)
    console.log("TAG         : "+tag)

    console.log("DOCKERFILE  : ",dockerFilePath)
    docker.image.build(dockerFilePath, {          t:tag        })
          .then(stream => promisifyStream(stream))
          .then(() => docker.image.get(tag).status())
         // .then(image => image.remove())
          .catch(error => console.log(error));

 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))