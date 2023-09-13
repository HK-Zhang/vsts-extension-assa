import tl = require("azure-pipelines-task-lib/task");
import * as fs from "fs";
import * as path from "path";

import yaml = require("js-yaml");
import { Assa, Control, Status } from "../../type/Assa";
import {
  AssaResult,
  ComplianceCount,
  ComplianceData,
  ThreadEventScore,
} from "../../type/AssaResult";
import AssaSchema, { ControlRelevanceTable } from "../../AssaSchema";

function sumByStatus(controls: Control[]): ComplianceCount[] {
  let groups = new Map();
  controls.forEach((item) => {
    let gpItem: number = groups.get(item.status) ?? 0;
    groups.set(item.status, gpItem + 1);
  });

  const result: ComplianceCount[] = [...groups].map(([name, value]) => ({
    status: name,
    count: value,
  }));

  return result;
}

function enrichAssaData(data: Assa): Assa {
  data.controls.forEach((t) => {
    const controlDefinition = AssaSchema.controls.find((c) => c.id === t.id);
    t.mandatory = controlDefinition?.mandatory ?? true;
    t.ref = controlDefinition?.ref ?? null;
    if (!t.status) {
      t.status = Status.IP;
    }
  });
  return data;
}

function getComplianceData(data: Assa): ComplianceData[] {
  let compliaceReport: ComplianceData[] = [];
  const uniqueResponsible = [
    ...new Set(data.controls.map((t) => t.responsible)),
  ];
  uniqueResponsible.forEach((r) => {
    const mandatorySummary = sumByStatus(
      data.controls.filter((t) => t.responsible === r && t.mandatory === true)
    );
    compliaceReport.push({
      responsible: r,
      mandatory: true,
      data: mandatorySummary,
    });

    const nonMandatorySummary = sumByStatus(
      data.controls.filter((t) => t.responsible === r && t.mandatory === false)
    );
    compliaceReport.push({
      responsible: r,
      mandatory: false,
      data: nonMandatorySummary,
    });
  });

  return compliaceReport;
}

function getThreadEventScore(controls: Control[]): ThreadEventScore[] {
  let threadEventScores: ThreadEventScore[] = [];

  ControlRelevanceTable.controlRelevance.forEach((t) => {
    const total = t.measurement.map((m) => m.score).reduce((a, c) => a + c, 0);
    const relevantControls = controls.filter(
      (c) => t.measurement.findIndex((m) => m.controlRef === c.ref) > -1
    );
    const sum = t.measurement
      .filter(
        (m) =>
          relevantControls.findIndex(
            (c) =>
              c.ref === m.controlRef &&
              (c.status === Status.C || c.status === Status.Na)
          ) > -1
      )
      .map((m) => m.score)
      .reduce((a, c) => a + c, 0);

    threadEventScores.push({
      threadEvent: t.threadEvent,
      score: sum / total,
      data: sumByStatus(relevantControls),
    });
  });

  return threadEventScores;
}

function generateAssaResport(data: Assa): AssaResult {
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
    complianceData: getComplianceData(data),
    threadEventScores: getThreadEventScore(data.controls),
  };
  return assaResult;
}

function run() {
  const assaPath = tl.getPathInput("assaPath", true);
  // const assaPath = "assa.yml"
  let assaData = yaml.load(fs.readFileSync(assaPath!, "utf8")) as Assa;
  assaData = enrichAssaData(assaData);

  const assaPageData = generateAssaResport(assaData);

  console.log(JSON.stringify(assaPageData));

  const agentTempDirectory = tl.getVariable("Agent.TempDirectory");
  const jsonReportFullPath = path.join(agentTempDirectory!, `assa.log`);

  tl.writeFile(jsonReportFullPath, "I am assaer.");
  var log = fs.readFileSync(jsonReportFullPath, "utf8");
  console.log(log);

  tl.addAttachment("JSON_ATTACHMENT_TYPE", "assa.log", jsonReportFullPath);
}

run();
