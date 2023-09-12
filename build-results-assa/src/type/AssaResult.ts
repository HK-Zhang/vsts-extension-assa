import { Control, Status } from "./Assa";

export interface AssaResult {
  assaVersion: number;
  projectName: string;
  projectVersion: number;
  projectDescription: string;
  owner: string;
  status: string;
  complianceData: ComplianceData[];
  ncControls: Control[];
  threadEventScores:ThreadEventScore[];
}

export interface ComplianceCount {
  status: Status;
  count: number;
}

export interface ComplianceData {
  mandatory: boolean;
  responsible: string;
  data: ComplianceCount[];
}

export interface ThreadEventScore{
    threadEvent:string;
    score:number;
}