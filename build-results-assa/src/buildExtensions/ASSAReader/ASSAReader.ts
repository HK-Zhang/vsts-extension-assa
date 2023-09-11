import tl = require("azure-pipelines-task-lib/task");
import * as fs from 'fs';
import * as path from 'path';

import yaml = require('js-yaml');
import { Assa } from "./Assa";


function run() {
    const assaPath = tl.getPathInput("assaPath",true);
    // const assaPath = "assa.yml"
    console.log(assaPath);
    const assaData = yaml.load(fs.readFileSync(assaPath!, 'utf8')) as Assa;

    console.log(assaData);

    
    const agentTempDirectory = tl.getVariable('Agent.TempDirectory');
    const jsonReportFullPath = path.join(agentTempDirectory!,`assa.log`);

    tl.writeFile(jsonReportFullPath,"I am assaer.")
    var log = fs.readFileSync(jsonReportFullPath,'utf8');
    console.log(log);

    tl.addAttachment('JSON_ATTACHMENT_TYPE',"assa.log",jsonReportFullPath);
}

run();
