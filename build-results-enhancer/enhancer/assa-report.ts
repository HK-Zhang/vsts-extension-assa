import * as Controls from "VSS/Controls";
import * as TFSBuildContracts from "TFS/Build/Contracts";
import * as TFSBuildExtensionContracts from "TFS/Build/ExtensionContracts";
import * as ChartsServices from "Charts/Services";
import * as DTClient from "TFS/DistributedTask/TaskRestClient";
import * as WidgetHelpers from "TFS/Dashboards/WidgetHelpers";
import { CommonChartOptions } from "Charts/Contracts";

const BUILD_PHASE = "build";
const HTML_ATTACHMENT_TYPE = "HTML_ATTACHMENT_TYPE";
const JSON_ATTACHMENT_TYPE = "JSON_ATTACHMENT_TYPE";

export class ASSAReportTab extends Controls.BaseControl {
  private projectId: string = "";
  private planId: string = "";
  private taskClient: DTClient.TaskHttpClient4 | undefined;
  private reportList: HTMLElement[] = [];

  constructor() {
    super();
  }

  public initialize = (): void => {
    super.initialize();
    WidgetHelpers.IncludeWidgetStyles();
    // Get configuration that's shared between extension and the extension host
    const sharedConfig: TFSBuildExtensionContracts.IBuildResultsViewExtensionConfig =
      VSS.getConfiguration();
    const vsoContext = VSS.getWebContext();
    if (sharedConfig) {
      // register your extension with host through callback
      sharedConfig.onBuildChanged((build: TFSBuildContracts.Build) => {
        this.taskClient = DTClient.getClient();
        this.projectId = vsoContext.project.id;
        this.planId = build.orchestrationPlan.planId;

        this.taskClient
          .getPlanAttachments(
            this.projectId,
            BUILD_PHASE,
            this.planId,
            JSON_ATTACHMENT_TYPE
          )
          .then((taskAttachments) => {
            const taskAttachment = taskAttachments.find(
              (attachment) => attachment.name === "assa.log"
            );

            if (taskAttachment) {
              const attachmentName = taskAttachment.name;
              const timelineId = taskAttachment.timelineId;
              const recordId = taskAttachment.recordId;

              this.taskClient!.getAttachmentContent(
                this.projectId,
                BUILD_PHASE,
                this.planId,
                timelineId,
                recordId,
                JSON_ATTACHMENT_TYPE,
                attachmentName
              ).then((content) => {
                console.log(
                  new TextDecoder("utf-8").decode(new DataView(content))
                );
                this._renderReport(
                  new TextDecoder("utf-8").decode(new DataView(content))
                );
                //   const json = JSON.parse(
                //     new TextDecoder('utf-8').decode(new DataView(content)),
                //   );
                VSS.notifyLoadSucceeded();
              });
            }
            //     taskAttachments.forEach(taskAttachment=>{

            //     console.log(taskAttachment)
            //   });
          });
      });
    }
  };

  private _renderReport(content: string) {
    var element = $("<pre />");
    element.text(content);
    this._element.append(element);
    ChartsServices.ChartsService.getService().then(function (chartService) {
      var $container = $("#chart");
      var chartOptions: CommonChartOptions = {
        hostOptions: {
          height: 290,
          width: 300,
        },
        chartType: "pie",
        series: [
          {
            data: [11, 4, 3, 1],
          },
        ],
        xAxis: {
          labelValues: ["Design", "On Deck", "Completed", "Development"],
        },
        specializedOptions: {
          showLabels: true,
          size: "200",
        },
      };

      console.log($container);
      chartService.createChart($container, chartOptions);
    });

    // VSS.register("build-builtin-task-dependent-tab", function () {
    //   return {
    //     load: function () {
    //       return ChartsServices.ChartsService.getService().then(function (
    //         chartService
    //       ) {
    //         var $container = $("#chart");
    //         var chartOptions: CommonChartOptions = {
    //           hostOptions: {
    //             height: 290,
    //             width: 300,
    //           },
    //           chartType: "pie",
    //           series: [
    //             {
    //               data: [11, 4, 3, 1],
    //             },
    //           ],
    //           xAxis: {
    //             labelValues: ["Design", "On Deck", "Completed", "Development"],
    //           },
    //           specializedOptions: {
    //             showLabels: true,
    //             size: "200",
    //           },
    //         };

    //         chartService.createChart($container, chartOptions);
    //         return WidgetHelpers.WidgetStatusHelper.Success();
    //       });
    //     },
    //   };
    // });
  }
}

ASSAReportTab.enhance(ASSAReportTab, $(".task-contribution"), {});
