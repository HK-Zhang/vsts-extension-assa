export interface Assa {
  assaVersion: number;
  projectName: string;
  projectVersion: number;
  projectDescription: string;
  owner: string;
  status: string;
  revisions: Revision[];
  azureSubscriptions: any[];
  endpoints: string[];
  repositories: string[];
  pipelines: string[];
  people: string[];
  controls: Control[];
}

export interface Control {
  id: string;
  ref: null | string;
  mandatory: boolean;
  description: string;
  status: null | Status;
  evidence: null | string;
  responsible: string;
  workItemUrl: null | string;
}

export type Status = "C" | "IP" | "NA" | "NC" | "PC"

// export enum Status {
//   C = "C",
//   IP = "IP",
//   Na = "NA",
//   Nc = "NC",
//   PC = "PC",
// }

export interface Revision {
  date: Date;
  description: string;
}
