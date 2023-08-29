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

      chartService.createChart($container, chartOptions);

      var $areacontainer = $("#areachart");
      var areachartOptions: CommonChartOptions = {
        hostOptions: {
          height: 290,
          width: 300,
        },
        chartType: "stackedArea",
        series: [
          {
            name: "Completed",
            data: [1, 3, 4, 3, 6, 1, 9, 0, 8, 11],
          },
          {
            name: "Development",
            data: [1, 1, 0, 3, 0, 2, 8, 9, 2, 8],
          },
          {
            name: "Design",
            data: [0, 0, 0, 6, 1, 1, 9, 9, 1, 9],
            color: "#207752",
          },
          {
            name: "On Deck",
            data: [1, 2, 4, 5, 4, 2, 1, 7, 0, 6],
          },
        ],
        xAxis: {
          labelFormatMode: "dateTime_DayInMonth",
          labelValues: [
            "1/1/2016",
            "1/2/2016",
            "1/3/2016",
            "1/4/2016",
            "1/5/2016",
            "1/6/2016",
            "1/7/2016",
            "1/8/2016",
            "1/9/2016",
            "1/10/2016",
          ],
        },
      };
      chartService.createChart($areacontainer, areachartOptions);

      var $pivottablecontainer = $("#pivottable");
      var pivottableOptions: CommonChartOptions = {
        hostOptions: {
          height: 290,
          width: 300,
        },
        chartType: "table",
        xAxis: {
          labelValues: ["Design", "In Progress", "Resolved", "Total"],
        },
        yAxis: {
          labelValues: ["P1", "P2", "P3", "Total"],
        },
        series: [
          {
            name: "Design",
            data: [
              [0, 0, 1],
              [0, 1, 2],
              [0, 2, 3],
            ],
          },
          {
            name: "In Progress",
            data: [
              [1, 0, 4],
              [1, 1, 5],
              [1, 2, 6],
            ],
          },
          {
            name: "Resolved",
            data: [
              [2, 0, 7],
              [2, 1, 8],
              [2, 2, 9],
            ],
          },
          {
            name: "Total",
            data: [
              [3, 0, 12],
              [3, 1, 15],
              [3, 2, 18],
              [0, 3, 6],
              [1, 3, 15],
              [2, 3, 24],
              [3, 3, 10],
            ],
            color: "rgba(255,255,255,0)",
          },
        ],
      };
      chartService.createChart($pivottablecontainer, pivottableOptions);
    });
  }
}

ASSAReportTab.enhance(ASSAReportTab, $(".task-contribution"), {});
