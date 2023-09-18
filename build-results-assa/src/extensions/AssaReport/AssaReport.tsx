import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import {
  CommonServiceIds,
  IProjectPageService,
  getClient,
} from "azure-devops-extension-api";
import {
  BuildRestClient,
  IBuildPageDataService,
  BuildServiceIds,
} from "azure-devops-extension-api/Build";
import { Page } from "azure-devops-ui/Page";
import { Card } from "azure-devops-ui/Card";
import { Table } from "azure-devops-ui/Table";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import { showRootComponent } from "../Common";
import { Toggle } from "azure-devops-ui/Toggle";
import "./AssaReport.scss";
import {
  IListItemDetails,
  ListItem,
  ListSelection,
  ScrollableList,
  List,
} from "azure-devops-ui/List";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
// import { assaData } from "./data";
import { ThreatEventScore } from "../../type/AssaResult";
import { ControlRelevanceTable } from "../../AssaSchema";
import {
  IAssaReportContentState,
  IControlItem,
  IResponsibleStatusTableItem,
  responsibleStatusColumns,
} from "./type";
import { getSatausOverviewData, getStatusByResponsibleData } from "./utils";
const JSON_ATTACHMENT_TYPE = "JSON_ATTACHMENT_TYPE";

class AssaReportContent extends React.Component<{}, IAssaReportContentState> {
  constructor(props: {}) {
    super(props);
    this.state = { mandatory: false };
  }

  public componentDidMount() {
    SDK.init();
    this.buildResult();
    // this.setState({ assaPageData: assaData });
    // this.setState({ assaNotExist: true });
  }

  private async buildResult() {
    await SDK.ready();
    const projectService = await SDK.getService<IProjectPageService>(
      CommonServiceIds.ProjectPageService
    );
    const project = await projectService.getProject();
    const projectId = project!.id;
    const buildClient = getClient(BuildRestClient);
    const buildPageService: IBuildPageDataService = await SDK.getService(
      BuildServiceIds.BuildPageDataService
    );
    const buildPageData = await buildPageService.getBuildPageData();
    const timeline = await buildClient.getBuildTimeline(
      projectId,
      buildPageData?.build?.id!
    );
    const attachments = await buildClient.getAttachments(
      projectId,
      buildPageData?.build?.id!,
      JSON_ATTACHMENT_TYPE
    );

    if (attachments.findIndex((t) => t.name === "assa.json") === -1) {
      this.setState({ assaNotExist: true });
      return;
    }

    const record = timeline.records.find(
      (t) => t.task && t.task.id === "7d7d4c9d-845c-423a-a91d-ddf596fe8f6c"
    );
    const content = await buildClient.getAttachment(
      project?.id!,
      buildPageData?.build?.id!,
      timeline.id,
      record?.id!,
      JSON_ATTACHMENT_TYPE,
      "assa.json"
    );

    const assaStr = new TextDecoder("utf-8").decode(new DataView(content));
    this.setState({ assaPageData: JSON.parse(assaStr) });
  }

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
                {item.threatEvent.length} threat events are impacted.
              </span>
              {/* <div>
                <PillGroup className="flex-row">
                  {item.threatEvent.map((t,idx)=>{<Pill key={`pill-item-${index}-${idx}`} size={PillSize.compact}>{t}</Pill>})}
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
    item: ThreatEventScore,
    details: IListItemDetails<ThreatEventScore>,
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
              <span className="wrap-text">{item.threatEvent}</span>
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

  public render(): JSX.Element {
    const { assaPageData, mandatory, assaNotExist } = this.state;
    const complianceData =
      assaPageData?.complianceData.filter(
        (t) => this.state.mandatory === false || t.mandatory === true
      ) ?? [];
    const satausOverviewData = getSatausOverviewData(complianceData);
    const responsibleComplianceData =
      getStatusByResponsibleData(complianceData);

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
            threatEvent: ControlRelevanceTable.controlRelevance
              .filter(
                (t) =>
                  t.measurement.findIndex((f) => f.controlRef === item.ref) > -1
              )
              .map((t) => t.threatEvent),
          };
          return newItem;
        }) ?? []
    );

    return (
      <Page className="sample-hub flex-grow">
        {assaPageData && !assaNotExist && (
          <div className="page-content margin-top-16">
            <Card
              className="flex-grow"
              titleProps={{ text: "Status overview", ariaLevel: 3 }}
              headerDescriptionProps={{
                text: (
                  <Toggle
                    offText={"All"}
                    onText={"Mandatory"}
                    checked={mandatory}
                    onChange={(event, value) =>
                      this.setState({ mandatory: value })
                    }
                  />
                ),
              }}
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
                text: "Calculated likelihood of threat event initiation",
                ariaLevel: 3,
              }}
            >
              <List
                itemProvider={
                  new ArrayItemProvider(assaPageData.threatEventScores)
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
              <div style={{ display: "flex" }}>
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
        {!assaPageData && !assaNotExist && (
          <div className="flex-row">
            <Spinner size={SpinnerSize.large} />
          </div>
        )}
        {assaNotExist && (
          <div>
            <ZeroData
              primaryText="ASSA report is not found"
              secondaryText={
                <span>
                  Probably it is due to the assa yml file is not properly setup in
                  the ASSA Reader build pipeline task.
                </span>
              }
              imageAltText="ASSA missing"
              imagePath="./bars.png"
            />
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
