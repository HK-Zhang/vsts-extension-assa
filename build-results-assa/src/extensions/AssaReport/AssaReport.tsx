import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import {
  CommonServiceIds,
  IProjectPageService,
  getClient,
} from "azure-devops-extension-api";
import {
  BuildDefinition,
  BuildRestClient,
  IBuildPageDataService,
  BuildServiceIds,
  IBuildPageData,
} from "azure-devops-extension-api/Build";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { showRootComponent } from "../Common";
import "./AssaReport.scss";
const JSON_ATTACHMENT_TYPE = "JSON_ATTACHMENT_TYPE";

class AssaReportContent extends React.Component<{}, {}> {
  public componentDidMount() {
    SDK.init();
    this.buildResult();
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
    const record = timeline.records.find(
      (t) => t.task && t.task.id === "7d7d4c9d-845c-423a-a91d-ddf596fe8f6c"
    );
    const content = await buildClient.getAttachment(
      project?.id!,
      buildPageData?.build?.id!,
      timeline.id,
      record?.id!,
      JSON_ATTACHMENT_TYPE,
      "assa.log"
    );
    console.log(new TextDecoder("utf-8").decode(new DataView(content)));
    console.log(project);
    console.log(buildPageData);
    console.log(attachments);
    console.log(timeline);
  }

  public render(): JSX.Element {
    const iframeUrl = window.location.href;
    const isV2 = window.location.search.indexOf("v2=true") >= 0;
    return (
      <Page className="sample-hub flex-grow">
        <Header title={"ABC Sample hub" + (isV2 ? " (version 2)" : "")} />
        <div className="page-content">
          <p>Feature ABC page</p>
          <p>iframe url: {iframeUrl}</p>
        </div>
      </Page>
    );
  }
}

showRootComponent(<AssaReportContent />);
