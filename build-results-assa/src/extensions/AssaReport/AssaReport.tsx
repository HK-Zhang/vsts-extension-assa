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
import { showRootComponent } from "../Common";
import { Toggle } from "azure-devops-ui/Toggle";
import "./AssaReport.scss";
const JSON_ATTACHMENT_TYPE = "JSON_ATTACHMENT_TYPE";

class AssaReportContent extends React.Component<{}, {}> {
  public componentDidMount() {
    // SDK.init();
    // this.buildResult();
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

  public render(): JSX.Element {
    const iframeUrl = window.location.href;
    const isV2 = window.location.search.indexOf("v2=true") >= 0;
    const data = [
      { color: "#10b981", percent: 20 },
      { color: "#0ea5e9", percent: 10 },
      { color: "#ef4444", percent: 20 },
      { color: "#6b7280", percent: 31 },
      { color: "#f59e0b", percent: 19 },
    ];
    return (
      <Page className="sample-hub flex-grow">
        <Header
          title={"ABC Sample hub" + (isV2 ? " (version 2)" : "")}
          titleSize={TitleSize.Large}
        >
          <Toggle
            offText={"All"}
            onText={"Mandatory"}
            // checked={firstToggle}
            // onChange={(event, value) => (firstToggle.value = value)}
          />
        </Header>
        <div className="page-content">
          <p>Feature ABC page</p>
          <p>iframe url: {iframeUrl}</p>
          <div style={{ width: "20rem" }}>
            <Bar data={data} />
          </div>
          <Card className="flex-grow">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Card>
        </div>
      </Page>
    );
  }
}

const Bar = ({ data }: { data: { color: string; percent: number }[] }) => {
  return (
    <div className="BarChart">
      {data &&
        data.map((d) => {
          return (
            <div
              className="BarData"
              style={{ background: `${d.color}`, width: `${d.percent}%` }}
            >
              <p className="PercentText">{d.percent + "%"}</p>
            </div>
          );
        })}
    </div>
  );
};

showRootComponent(<AssaReportContent />);
