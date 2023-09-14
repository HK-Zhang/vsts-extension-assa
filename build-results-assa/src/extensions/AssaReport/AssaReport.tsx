import * as React from "react";
// import * as SDK from "azure-devops-extension-sdk";
// import {
//   CommonServiceIds,
//   IProjectPageService,
//   getClient,
// } from "azure-devops-extension-api";
// import {
//   BuildDefinition,
//   BuildRestClient,
//   IBuildPageDataService,
//   BuildServiceIds,
//   IBuildPageData,
// } from "azure-devops-extension-api/Build";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { Card } from "azure-devops-ui/Card";
import {
  ColumnSorting,
  ISimpleTableCell,
  SortOrder,
  Table,
  TableColumnLayout,
  renderSimpleCell,
  sortItems,
} from "azure-devops-ui/Table";
import { showRootComponent } from "../Common";
import { Toggle } from "azure-devops-ui/Toggle";
import "./AssaReport.scss";
import {
  ObservableArray,
  ObservableValue,
} from "azure-devops-ui/Core/Observable";
import {
  IListItemDetails,
  ISimpleListCell,
  ListItem,
  ListSelection,
  ScrollableList,
  List,
} from "azure-devops-ui/List";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Icon, IconSize } from "azure-devops-ui/Icon";
import { Pill, PillSize, PillVariant } from "azure-devops-ui/Pill";
import { PillGroup } from "azure-devops-ui/PillGroup";
import { assaData } from "./data";
import {
  AssaResult,
  ComplianceCount,
  ComplianceData,
  ThreadEventScore,
} from "../../type/AssaResult";
import { ControlRelevanceTable } from "../../AssaSchema";
import { Status } from "../../type/Assa";
const JSON_ATTACHMENT_TYPE = "JSON_ATTACHMENT_TYPE";

const responsibleStatusColumns = [
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

interface IResponsibleStatusTableItem extends ISimpleTableCell {
  responsible: string;
  C: string;
  NC: string;
  PC: string;
  NA: string;
  IP: string;
}

interface IControlItem {
  description: string;
  id: string;
  status: Status;
  mandatory: boolean;
  responsible: string;
  threadEvent: string[];
}

interface IAssaReportContentState {
  mandatory?: boolean;
  assaPageData?: AssaResult;
}

class AssaReportContent extends React.Component<{}, IAssaReportContentState> {
  constructor(props: {}) {
    super(props);
    this.state = { mandatory: false };
  }

  public componentDidMount() {
    // SDK.init();
    // this.buildResult();
    this.setState({ assaPageData: assaData });
  }

  // private async buildResult() {
  //   await SDK.ready();
  //   const projectService = await SDK.getService<IProjectPageService>(
  //     CommonServiceIds.ProjectPageService
  //   );
  //   const project = await projectService.getProject();
  //   const projectId = project!.id;
  //   const buildClient = getClient(BuildRestClient);
  //   const buildPageService: IBuildPageDataService = await SDK.getService(
  //     BuildServiceIds.BuildPageDataService
  //   );
  //   const buildPageData = await buildPageService.getBuildPageData();
  //   const timeline = await buildClient.getBuildTimeline(
  //     projectId,
  //     buildPageData?.build?.id!
  //   );
  //   const attachments = await buildClient.getAttachments(
  //     projectId,
  //     buildPageData?.build?.id!,
  //     JSON_ATTACHMENT_TYPE
  //   );
  //   const record = timeline.records.find(
  //     (t) => t.task && t.task.id === "7d7d4c9d-845c-423a-a91d-ddf596fe8f6c"
  //   );
  //   const content = await buildClient.getAttachment(
  //     project?.id!,
  //     buildPageData?.build?.id!,
  //     timeline.id,
  //     record?.id!,
  //     JSON_ATTACHMENT_TYPE,
  //     "assa.log"
  //   );
  //   console.log(new TextDecoder("utf-8").decode(new DataView(content)));
  //   console.log(project);
  //   console.log(buildPageData);
  //   console.log(attachments);
  //   console.log(timeline);
  // }

  private renderRow = (
    index: number,
    item: IControlItem,
    details: IListItemDetails<IControlItem>,
    key?: string
  ): JSX.Element => {
    return (
      <ListItem
        key={key || "list-item" + index}
        index={index}
        details={details}
      >
        <div
          className={`list-example-row flex-row h-scroll-hidden border-l-${item.status}`}
        >
          <div
            style={{ marginLeft: "10px", padding: "10px 0px" }}
            className="flex-column h-scroll-hidden"
          >
            <div className="wrap-text" style={{ whiteSpace: "normal" }}>
              {item.description}
            </div>
            <div className="flex-row justify-space-between">
              <span className="fontSizeMS font-size-ms secondary-text wrap-text">
                {item.responsible}
              </span>
              <span className="fontSizeMS font-size-ms secondary-text wrap-text">
                {item.threadEvent.length} thread events are impacted.
              </span>
              {/* <div>
                <PillGroup className="flex-row">
                  {item.threadEvent.map((t,idx)=>{<Pill key={`pill-item-${index}-${idx}`} size={PillSize.compact}>{t}</Pill>})}
                </PillGroup>
              </div> */}
            </div>
          </div>
        </div>
      </ListItem>
    );
  };

  private renderScoreRow = (
    index: number,
    item: ThreadEventScore,
    details: IListItemDetails<ThreadEventScore>,
    key?: string
  ): JSX.Element => {
    const totalCount = item.data.map((t) => t.count).reduce((a, b) => a + b, 0);
    return (
      <ListItem
        key={key || "list-item" + index}
        index={index}
        details={details}
      >
        <div className="list-example-row flex-row h-scroll-hidden">
          <div
            style={{ marginLeft: "10px", padding: "10px 0px" }}
            className="flex-column h-scroll-hidden"
          >
            <div
              style={{ width: 800 }}
              className="flex-row justify-space-between"
            >
              <span className="wrap-text">{item.threadEvent}</span>
              <span className="wrap-text">{Math.round(item.score * 100)}%</span>
            </div>
            <Bar
              data={[
                {
                  color: "#10b981",
                  percent:
                    ((item.data.find((t) => t.status === "C")?.count ?? 0) *
                      100) /
                    totalCount,
                },
                {
                  color: "#ef4444",
                  percent:
                    ((item.data.find((t) => t.status === "NC")?.count ?? 0) *
                      100) /
                    totalCount,
                },
                {
                  color: "#f59e0b",
                  percent:
                    ((item.data.find((t) => t.status === "PC")?.count ?? 0) *
                      100) /
                    totalCount,
                },
                {
                  color: "#6b7280",
                  percent:
                    ((item.data.find((t) => t.status === "NA")?.count ?? 0) *
                      100) /
                    totalCount,
                },
                {
                  color: "#0ea5e9",
                  percent:
                    ((item.data.find((t) => t.status === "IP")?.count ?? 0) *
                      100) /
                    totalCount,
                },
              ]}
            />
          </div>
        </div>
      </ListItem>
    );
  };

  private getSatausOverviewData = (
    complianceData: ComplianceData[]
  ): ComplianceCount[] => {
    let result: ComplianceCount[] = [
      { status: "C", count: 0 },
      { status: "NC", count: 0 },
      { status: "PC", count: 0 },
      { status: "NA", count: 0 },
      { status: "IP", count: 0 },
    ];
    complianceData.forEach((t) => {
      t.data.forEach((f) => {
        let item = result.find((r) => r.status === f.status);
        if (item) item.count = item.count + f.count;
      });
    });

    return result;
  };

  private getStatusByResponsibleData = (
    compliancedata: ComplianceData[]
  ): ComplianceData[] => {
    let groups = new Map();
    compliancedata.forEach((item) => {
      let gpItem: ComplianceCount[] = groups.get(item.responsible);
      if (gpItem) {
        item.data.forEach((t) => {
          var i = gpItem.find((g) => g.status === t.status);
          if (i) {
            i.count = i.count + t.count;
          } else {
            gpItem.push({ ...t });
          }
        });
      } else {
        gpItem = item.data.map((t) => ({ status: t.status, count: t.count }));
      }
      groups.set(item.responsible, gpItem);
    });

    const result: ComplianceData[] = [...groups].map(([name, value]) => ({
      responsible: name,
      mandatory: true,
      data: value,
    }));

    return result;
  };

  public render(): JSX.Element {
    const { assaPageData, mandatory } = this.state;
    const complianceData =
      assaPageData?.complianceData.filter(
        (t) => this.state.mandatory === false || t.mandatory === true
      ) ?? [];
    const satausOverviewData = this.getSatausOverviewData(complianceData);
    const responsibleComplianceData =
      this.getStatusByResponsibleData(complianceData);

    const responsibleStatusTableData =
      new ArrayItemProvider<IResponsibleStatusTableItem>(
        responsibleComplianceData.map((item) => {
          const newItem: IResponsibleStatusTableItem = {
            responsible: item.responsible,
            C: (
              item.data.find((t) => t.status === "C")?.count ?? ""
            ).toString(),
            NC: (
              item.data.find((t) => t.status === "NC")?.count ?? ""
            ).toString(),
            PC: (
              item.data.find((t) => t.status === "PC")?.count ?? ""
            ).toString(),
            NA: (
              item.data.find((t) => t.status === "NA")?.count ?? ""
            ).toString(),
            IP: (
              item.data.find((t) => t.status === "IP")?.count ?? ""
            ).toString(),
          };
          return newItem;
        })
      );

    const ncControls = new ArrayItemProvider<IControlItem>(
      assaPageData?.ncControls
        ?.filter((t) => this.state.mandatory === false || t.mandatory === true)
        .map((item) => {
          const newItem: IControlItem = {
            id: item.id,
            status: item.status!,
            description: item.description,
            mandatory: item.mandatory,
            responsible: item.responsible,
            threadEvent: ControlRelevanceTable.controlRelevance
              .filter(
                (t) =>
                  t.measurement.findIndex((f) => f.controlRef === item.ref) > -1
              )
              .map((t) => t.threadEvent),
          };
          return newItem;
        }) ?? []
    );

    return (
      <Page className="sample-hub flex-grow">
        <Header title="ASSA Compliance Overview" titleSize={TitleSize.Large}>
          <Toggle
            offText={"All"}
            onText={"Mandatory"}
            checked={mandatory}
            onChange={(event, value) => this.setState({ mandatory: value })}
          />
        </Header>
        {assaPageData && (
          <div className="page-content margin-top-16">
            <Card
              className="flex-grow"
              titleProps={{ text: "Status overview", ariaLevel: 3 }}
            >
              <div className="flex-row" style={{ flexWrap: "wrap" }}>
                {satausOverviewData.map((item, index) => (
                  <div
                    className="flex-column"
                    style={{ minWidth: "120px" }}
                    key={index}
                  >
                    <div
                      className={`body-m secondary-text font-weight-semibold color-${item.status}`}
                    >
                      {item.status}
                    </div>
                    <div className="body-m primary-text">{item.count}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card
              className="flex-grow margin-top-16"
              titleProps={{
                text: "Status overview by responsible",
                ariaLevel: 3,
              }}
            >
              <Table
                ariaLabel="Basic Table"
                columns={responsibleStatusColumns}
                itemProvider={responsibleStatusTableData}
                role="table"
                containerClassName="h-scroll-auto"
              />
            </Card>
            <Card
              className="margin-top-16"
              titleProps={{
                text: "Thread event scores",
                ariaLevel: 3,
              }}
            >
              <List
                itemProvider={
                  new ArrayItemProvider(assaPageData.threadEventScores)
                }
                renderRow={this.renderScoreRow}
                selection={new ListSelection(true)}
                width="100%"
              />
            </Card>
            <Card
              className="margin-top-16"
              titleProps={{
                text: "Controls to compliance",
                ariaLevel: 3,
              }}
            >
              <div style={{ display: "flex", height: "500px" }}>
                <ScrollableList
                  itemProvider={ncControls}
                  renderRow={this.renderRow}
                  selection={new ListSelection(true)}
                  width="100%"
                />
              </div>
            </Card>
          </div>
        )}
        {!assaPageData && (
          <div className="flex-row">
            <Spinner size={SpinnerSize.large} />
          </div>
        )}
      </Page>
    );
  }
}

const Bar = ({ data }: { data: { color: string; percent: number }[] }) => {
  return (
    <div className="BarChart">
      {data &&
        data.map((d, index) => {
          return (
            <div
              key={`bar-${d.percent}-${index}`}
              className="BarData"
              style={{ background: `${d.color}`, width: `${d.percent}%` }}
            >
              {/* <p className="PercentText">{d.percent + "%"}</p> */}
            </div>
          );
        })}
    </div>
  );
};

showRootComponent(<AssaReportContent />);
