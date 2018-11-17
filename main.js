const {Docker} = require('node-docker-api');
const git = require("nodegit");
const path=require("path")
const tar = require('tar-fs');
const express = require('express')

const app = express()
const port = 3030

         
const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', data => console.log(data.toString()))
    stream.on('end', resolve)
    stream.on('error', reject)
  });


app.get('/docker', (req, res) => {
    let folder="f"
    let repo=req.query.repo;
    let tag=req.query.tag | "mytag";
    let clonedPath=path.join("./tmp",folder);
    let finalTag="aheadai-"+tag;
    let dockerFilePath=path.join(clonedPath,"Dockerfile");

    console.log("Dockerizing "+repo+" into "+finalTag+" from ",dockerFilePath)
    git.Clone(repo,clonedPath).then(function(repo) {
        console.log("REPO CLONED")

        var tarStream = tar.pack(dockerFilePath)
        const docker = new Docker({ socketPath: '/var/run/docker.sock' });
        docker.image.build(tarStream, {          t:finaltag        })
          .then(stream => promisifyStream(stream))
          .then(() => docker.image.get('testimg').status())
          .then(image => image.remove())
          .catch(error => console.log(error));

        //return repo.getCommit("59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5");
        res.json({status:"done"})
      })
    
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))