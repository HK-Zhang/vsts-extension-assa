import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { ISimpleTableCell, TableColumnLayout, renderSimpleCell } from "azure-devops-ui/Table";
import { Status } from "../../type/Assa";
import { AssaResult } from "../../type/AssaResult";

export const responsibleStatusColumns = [
  {
    columnLayout: TableColumnLayout.singleLinePrefix,
    id: "responsible",
    name: "Responsible",
    readonly: true,
    SortOrder: 0,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-25),
  },
  {
    id: "C",
    name: "C",
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-15),
  },
  {
    id: "NC",
    name: "NC",
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-15),
  },
  {
    id: "PC",
    name: "PC",
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-15),
  },
  {
    id: "NA",
    name: "NA",
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-15),
  },
  {
    id: "IP",
    name: "IP",
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-15),
  },
];

export interface IResponsibleStatusTableItem extends ISimpleTableCell {
  responsible: string;
  C: string;
  NC: string;
  PC: string;
  NA: string;
  IP: string;
}

export interface IControlItem {
  description: string;
  id: string;
  status: Status;
  mandatory: boolean;
  responsible: string;
  threatEvent: string[];
}

export interface IAssaReportContentState {
  mandatory?: boolean;
  assaNotExist?:boolean;
  assaPageData?: AssaResult;
}
