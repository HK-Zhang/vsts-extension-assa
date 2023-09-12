import tl = require("azure-pipelines-task-lib/task");
import * as fs from 'fs';
import * as path from 'path';

import yaml = require('js-yaml');
import { Assa, Status } from "../../type/Assa";
import { AssaResult } from "../../type/AssaResult";


function GenerateAssaResport(data: Assa): AssaResult {
  let assaResult: AssaResult = {
    assaVersion: data.assaVersion,
    projectName: data.projectName,
    projectVersion: data.projectVersion,
    projectDescription: data.projectDescription,
    owner: data.owner,
    status: data.status,
    ncControls: data.controls.filter(
      (t) => t.status !== Status.C && t.status !== Status.Na
    ),
    complianceData: [],
    threadEventScores: [],
  };
  return assaResult;
}


function run() {
    const assaPath = tl.getPathInput("assaPath",true);
    // const assaPath = "assa.yml"
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
