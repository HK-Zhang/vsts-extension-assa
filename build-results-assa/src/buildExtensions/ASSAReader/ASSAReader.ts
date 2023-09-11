import tl = require("azure-pipelines-task-lib/task");
import * as fs from 'fs';
import * as path from 'path';

import yaml = require('js-yaml');
// import { Assa } from './Assa';


function run() {
    console.log("debug");
    const assaPath = tl.getPathInput("assaPath",true);
    // const assaPath = "assa.yml"
    console.log(assaPath);
    // var data = fs.readFileSync(assaPath!,'utf8');
    // var assaData:Assa = YAML.parse(data)
    var assaData = yaml.load(fs.readFileSync(assaPath!, 'utf8'));

    console.log(assaData);
    // console.log(data);
    const agentTempDirectory = tl.getVariable('Agent.TempDirectory');
    const jsonReportFullPath = path.join(agentTempDirectory!,`assa.log`);

    tl.writeFile(jsonReportFullPath,"I am assaer.")
    var log = fs.readFileSync(jsonReportFullPath,'utf8');
    console.log(log);

    tl.addAttachment('JSON_ATTACHMENT_TYPE',"assa.log",jsonReportFullPath);
}

run();
