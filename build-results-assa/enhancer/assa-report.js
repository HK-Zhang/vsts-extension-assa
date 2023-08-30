var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "VSS/Controls", "Charts/Services", "TFS/DistributedTask/TaskRestClient", "TFS/Dashboards/WidgetHelpers"], function (require, exports, Controls, ChartsServices, DTClient, WidgetHelpers) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASSAReportTab = void 0;
    Controls = __importStar(Controls);
    ChartsServices = __importStar(ChartsServices);
    DTClient = __importStar(DTClient);
    WidgetHelpers = __importStar(WidgetHelpers);
    const BUILD_PHASE = "build";
    const HTML_ATTACHMENT_TYPE = "HTML_ATTACHMENT_TYPE";
    const JSON_ATTACHMENT_TYPE = "JSON_ATTACHMENT_TYPE";
    class ASSAReportTab extends Controls.BaseControl {
        constructor() {
            super();
            this.projectId = "";
            this.planId = "";
            this.reportList = [];
            this.initialize = () => {
                super.initialize();
                WidgetHelpers.IncludeWidgetStyles();
                // Get configuration that's shared between extension and the extension host
                const sharedConfig = VSS.getConfiguration();
                const vsoContext = VSS.getWebContext();
                if (sharedConfig) {
                    // register your extension with host through callback
                    sharedConfig.onBuildChanged((build) => {
                        this.taskClient = DTClient.getClient();
                        this.projectId = vsoContext.project.id;
                        this.planId = build.orchestrationPlan.planId;
                        this.taskClient
                            .getPlanAttachments(this.projectId, BUILD_PHASE, this.planId, JSON_ATTACHMENT_TYPE)
                            .then((taskAttachments) => {
                            const taskAttachment = taskAttachments.find((attachment) => attachment.name === "assa.log");
                            if (taskAttachment) {
                                const attachmentName = taskAttachment.name;
                                const timelineId = taskAttachment.timelineId;
                                const recordId = taskAttachment.recordId;
                                this.taskClient.getAttachmentContent(this.projectId, BUILD_PHASE, this.planId, timelineId, recordId, JSON_ATTACHMENT_TYPE, attachmentName).then((content) => {
                                    console.log(new TextDecoder("utf-8").decode(new DataView(content)));
                                    this._renderReport(new TextDecoder("utf-8").decode(new DataView(content)));
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
        }
        _renderReport(content) {
            var element = $("<pre />");
            element.text(content);
            this._element.append(element);
            ChartsServices.ChartsService.getService().then(function (chartService) {
                var $container = $("#chart");
                var chartOptions = {
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
                var areachartOptions = {
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
                var pivottableOptions = {
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
    exports.ASSAReportTab = ASSAReportTab;
    ASSAReportTab.enhance(ASSAReportTab, $(".task-contribution"), {});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzYS1yZXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhc3NhLXJlcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBUUEsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDO0lBQzVCLE1BQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUM7SUFDcEQsTUFBTSxvQkFBb0IsR0FBRyxzQkFBc0IsQ0FBQztJQUVwRCxNQUFhLGFBQWMsU0FBUSxRQUFRLENBQUMsV0FBVztRQU1yRDtZQUNFLEtBQUssRUFBRSxDQUFDO1lBTkYsY0FBUyxHQUFXLEVBQUUsQ0FBQztZQUN2QixXQUFNLEdBQVcsRUFBRSxDQUFDO1lBRXBCLGVBQVUsR0FBa0IsRUFBRSxDQUFDO1lBTWhDLGVBQVUsR0FBRyxHQUFTLEVBQUU7Z0JBQzdCLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbkIsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQ3BDLDJFQUEyRTtnQkFDM0UsTUFBTSxZQUFZLEdBQ2hCLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN6QixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3ZDLElBQUksWUFBWSxFQUFFO29CQUNoQixxREFBcUQ7b0JBQ3JELFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUE4QixFQUFFLEVBQUU7d0JBQzdELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7d0JBRTdDLElBQUksQ0FBQyxVQUFVOzZCQUNaLGtCQUFrQixDQUNqQixJQUFJLENBQUMsU0FBUyxFQUNkLFdBQVcsRUFD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Q0osQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQ0FDVixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dDQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0NBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDVCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dDQUNWLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0NBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs2QkFDWDs0QkFDRCxLQUFLLEVBQUUscUJBQXFCO3lCQUM3QjtxQkFDRjtpQkFDRixDQUFDO2dCQUNGLFlBQVksQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRjtJQXZNRCxzQ0F1TUM7SUFFRCxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIENvbnRyb2xzIGZyb20gXCJWU1MvQ29udHJvbHNcIjtcclxuaW1wb3J0ICogYXMgVEZTQnVpbGRDb250cmFjdHMgZnJvbSBcIlRGUy9CdWlsZC9Db250cmFjdHNcIjtcclxuaW1wb3J0ICogYXMgVEZTQnVpbGRFeHRlbnNpb25Db250cmFjdHMgZnJvbSBcIlRGUy9CdWlsZC9FeHRlbnNpb25Db250cmFjdHNcIjtcclxuaW1wb3J0ICogYXMgQ2hhcnRzU2VydmljZXMgZnJvbSBcIkNoYXJ0cy9TZXJ2aWNlc1wiO1xyXG5pbXBvcnQgKiBhcyBEVENsaWVudCBmcm9tIFwiVEZTL0Rpc3RyaWJ1dGVkVGFzay9UYXNrUmVzdENsaWVudFwiO1xyXG5pbXBvcnQgKiBhcyBXaWRnZXRIZWxwZXJzIGZyb20gXCJURlMvRGFzaGJvYXJkcy9XaWRnZXRIZWxwZXJzXCI7XHJcbmltcG9ydCB7IENvbW1vbkNoYXJ0T3B0aW9ucyB9IGZyb20gXCJDaGFydHMvQ29udHJhY3RzXCI7XHJcblxyXG5jb25zdCBCVUlMRF9QSEFTRSA9IFwiYnVpbGRcIjtcclxuY29uc3QgSFRNTF9BVFRBQ0hNRU5UX1RZUEUgPSBcIkhUTUxfQVRUQUNITUVOVF9UWVBFXCI7XHJcbmNvbnN0IEpTT05fQVRUQUNITUVOVF9UWVBFID0gXCJKU09OX0FUVEFDSE1FTlRfVFlQRVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFTU0FSZXBvcnRUYWIgZXh0ZW5kcyBDb250cm9scy5CYXNlQ29udHJvbCB7XHJcbiAgcHJpdmF0ZSBwcm9qZWN0SWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgcHJpdmF0ZSBwbGFuSWQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgcHJpdmF0ZSB0YXNrQ2xpZW50OiBEVENsaWVudC5UYXNrSHR0cENsaWVudDQgfCB1bmRlZmluZWQ7XHJcbiAgcHJpdmF0ZSByZXBvcnRMaXN0OiBIVE1MRWxlbWVudFtdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0aWFsaXplID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgV2lkZ2V0SGVscGVycy5JbmNsdWRlV2lkZ2V0U3R5bGVzKCk7XHJcbiAgICAvLyBHZXQgY29uZmlndXJhdGlvbiB0aGF0J3Mgc2hhcmVkIGJldHdlZW4gZXh0ZW5zaW9uIGFuZCB0aGUgZXh0ZW5zaW9uIGhvc3RcclxuICAgIGNvbnN0IHNoYXJlZENvbmZpZzogVEZTQnVpbGRFeHRlbnNpb25Db250cmFjdHMuSUJ1aWxkUmVzdWx0c1ZpZXdFeHRlbnNpb25Db25maWcgPVxyXG4gICAgICBWU1MuZ2V0Q29uZmlndXJhdGlvbigpO1xyXG4gICAgY29uc3QgdnNvQ29udGV4dCA9IFZTUy5nZXRXZWJDb250ZXh0KCk7XHJcbiAgICBpZiAoc2hhcmVkQ29uZmlnKSB7XHJcbiAgICAgIC8vIHJlZ2lzdGVyIHlvdXIgZXh0ZW5zaW9uIHdpdGggaG9zdCB0aHJvdWdoIGNhbGxiYWNrXHJcbiAgICAgIHNoYXJlZENvbmZpZy5vbkJ1aWxkQ2hhbmdlZCgoYnVpbGQ6IFRGU0J1aWxkQ29udHJhY3RzLkJ1aWxkKSA9PiB7XHJcbiAgICAgICAgdGhpcy50YXNrQ2xpZW50ID0gRFRDbGllbnQuZ2V0Q2xpZW50KCk7XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0SWQgPSB2c29Db250ZXh0LnByb2plY3QuaWQ7XHJcbiAgICAgICAgdGhpcy5wbGFuSWQgPSBidWlsZC5vcmNoZXN0cmF0aW9uUGxhbi5wbGFuSWQ7XHJcblxyXG4gICAgICAgIHRoaXMudGFza0NsaWVudFxyXG4gICAgICAgICAgLmdldFBsYW5BdHRhY2htZW50cyhcclxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0SWQsXHJcbiAgICAgICAgICAgIEJVSUxEX1BIQVNFLFxyXG4gICAgICAgICAgICB0aGlzLnBsYW5JZCxcclxuICAgICAgICAgICAgSlNPTl9BVFRBQ0hNRU5UX1RZUEVcclxuICAgICAgICAgIClcclxuICAgICAgICAgIC50aGVuKCh0YXNrQXR0YWNobWVudHMpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFza0F0dGFjaG1lbnQgPSB0YXNrQXR0YWNobWVudHMuZmluZChcclxuICAgICAgICAgICAgICAoYXR0YWNobWVudCkgPT4gYXR0YWNobWVudC5uYW1lID09PSBcImFzc2EubG9nXCJcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXNrQXR0YWNobWVudCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGF0dGFjaG1lbnROYW1lID0gdGFza0F0dGFjaG1lbnQubmFtZTtcclxuICAgICAgICAgICAgICBjb25zdCB0aW1lbGluZUlkID0gdGFza0F0dGFjaG1lbnQudGltZWxpbmVJZDtcclxuICAgICAgICAgICAgICBjb25zdCByZWNvcmRJZCA9IHRhc2tBdHRhY2htZW50LnJlY29yZElkO1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnRhc2tDbGllbnQhLmdldEF0dGFjaG1lbnRDb250ZW50KFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0SWQsXHJcbiAgICAgICAgICAgICAgICBCVUlMRF9QSEFTRSxcclxuICAgICAgICAgICAgICAgIHRoaXMucGxhbklkLFxyXG4gICAgICAgICAgICAgICAgdGltZWxpbmVJZCxcclxuICAgICAgICAgICAgICAgIHJlY29yZElkLFxyXG4gICAgICAgICAgICAgICAgSlNPTl9BVFRBQ0hNRU5UX1RZUEUsXHJcbiAgICAgICAgICAgICAgICBhdHRhY2htZW50TmFtZVxyXG4gICAgICAgICAgICAgICkudGhlbigoY29udGVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXHJcbiAgICAgICAgICAgICAgICAgIG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpLmRlY29kZShuZXcgRGF0YVZpZXcoY29udGVudCkpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyUmVwb3J0KFxyXG4gICAgICAgICAgICAgICAgICBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKS5kZWNvZGUobmV3IERhdGFWaWV3KGNvbnRlbnQpKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIC8vICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbmV3IFRleHREZWNvZGVyKCd1dGYtOCcpLmRlY29kZShuZXcgRGF0YVZpZXcoY29udGVudCkpLFxyXG4gICAgICAgICAgICAgICAgLy8gICApO1xyXG4gICAgICAgICAgICAgICAgVlNTLm5vdGlmeUxvYWRTdWNjZWVkZWQoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgdGFza0F0dGFjaG1lbnRzLmZvckVhY2godGFza0F0dGFjaG1lbnQ9PntcclxuXHJcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyh0YXNrQXR0YWNobWVudClcclxuICAgICAgICAgICAgLy8gICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIF9yZW5kZXJSZXBvcnQoY29udGVudDogc3RyaW5nKSB7XHJcbiAgICB2YXIgZWxlbWVudCA9ICQoXCI8cHJlIC8+XCIpO1xyXG4gICAgZWxlbWVudC50ZXh0KGNvbnRlbnQpO1xyXG4gICAgdGhpcy5fZWxlbWVudC5hcHBlbmQoZWxlbWVudCk7XHJcbiAgICBDaGFydHNTZXJ2aWNlcy5DaGFydHNTZXJ2aWNlLmdldFNlcnZpY2UoKS50aGVuKGZ1bmN0aW9uIChjaGFydFNlcnZpY2UpIHtcclxuICAgICAgdmFyICRjb250YWluZXIgPSAkKFwiI2NoYXJ0XCIpO1xyXG4gICAgICB2YXIgY2hhcnRPcHRpb25zOiBDb21tb25DaGFydE9wdGlvbnMgPSB7XHJcbiAgICAgICAgaG9zdE9wdGlvbnM6IHtcclxuICAgICAgICAgIGhlaWdodDogMjkwLFxyXG4gICAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYXJ0VHlwZTogXCJwaWVcIixcclxuICAgICAgICBzZXJpZXM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGF0YTogWzExLCA0LCAzLCAxXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICB4QXhpczoge1xyXG4gICAgICAgICAgbGFiZWxWYWx1ZXM6IFtcIkRlc2lnblwiLCBcIk9uIERlY2tcIiwgXCJDb21wbGV0ZWRcIiwgXCJEZXZlbG9wbWVudFwiXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNwZWNpYWxpemVkT3B0aW9uczoge1xyXG4gICAgICAgICAgc2hvd0xhYmVsczogdHJ1ZSxcclxuICAgICAgICAgIHNpemU6IFwiMjAwXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNoYXJ0U2VydmljZS5jcmVhdGVDaGFydCgkY29udGFpbmVyLCBjaGFydE9wdGlvbnMpO1xyXG5cclxuICAgICAgdmFyICRhcmVhY29udGFpbmVyID0gJChcIiNhcmVhY2hhcnRcIik7XHJcbiAgICAgIHZhciBhcmVhY2hhcnRPcHRpb25zOiBDb21tb25DaGFydE9wdGlvbnMgPSB7XHJcbiAgICAgICAgaG9zdE9wdGlvbnM6IHtcclxuICAgICAgICAgIGhlaWdodDogMjkwLFxyXG4gICAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoYXJ0VHlwZTogXCJzdGFja2VkQXJlYVwiLFxyXG4gICAgICAgIHNlcmllczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiBcIkNvbXBsZXRlZFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBbMSwgMywgNCwgMywgNiwgMSwgOSwgMCwgOCwgMTFdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogXCJEZXZlbG9wbWVudFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBbMSwgMSwgMCwgMywgMCwgMiwgOCwgOSwgMiwgOF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiBcIkRlc2lnblwiLFxyXG4gICAgICAgICAgICBkYXRhOiBbMCwgMCwgMCwgNiwgMSwgMSwgOSwgOSwgMSwgOV0sXHJcbiAgICAgICAgICAgIGNvbG9yOiBcIiMyMDc3NTJcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiT24gRGVja1wiLFxyXG4gICAgICAgICAgICBkYXRhOiBbMSwgMiwgNCwgNSwgNCwgMiwgMSwgNywgMCwgNl0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgIGxhYmVsRm9ybWF0TW9kZTogXCJkYXRlVGltZV9EYXlJbk1vbnRoXCIsXHJcbiAgICAgICAgICBsYWJlbFZhbHVlczogW1xyXG4gICAgICAgICAgICBcIjEvMS8yMDE2XCIsXHJcbiAgICAgICAgICAgIFwiMS8yLzIwMTZcIixcclxuICAgICAgICAgICAgXCIxLzMvMjAxNlwiLFxyXG4gICAgICAgICAgICBcIjEvNC8yMDE2XCIsXHJcbiAgICAgICAgICAgIFwiMS81LzIwMTZcIixcclxuICAgICAgICAgICAgXCIxLzYvMjAxNlwiLFxyXG4gICAgICAgICAgICBcIjEvNy8yMDE2XCIsXHJcbiAgICAgICAgICAgIFwiMS84LzIwMTZcIixcclxuICAgICAgICAgICAgXCIxLzkvMjAxNlwiLFxyXG4gICAgICAgICAgICBcIjEvMTAvMjAxNlwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgICBjaGFydFNlcnZpY2UuY3JlYXRlQ2hhcnQoJGFyZWFjb250YWluZXIsIGFyZWFjaGFydE9wdGlvbnMpO1xyXG5cclxuICAgICAgdmFyICRwaXZvdHRhYmxlY29udGFpbmVyID0gJChcIiNwaXZvdHRhYmxlXCIpO1xyXG4gICAgICB2YXIgcGl2b3R0YWJsZU9wdGlvbnM6IENvbW1vbkNoYXJ0T3B0aW9ucyA9IHtcclxuICAgICAgICBob3N0T3B0aW9uczoge1xyXG4gICAgICAgICAgaGVpZ2h0OiAyOTAsXHJcbiAgICAgICAgICB3aWR0aDogMzAwLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2hhcnRUeXBlOiBcInRhYmxlXCIsXHJcbiAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgIGxhYmVsVmFsdWVzOiBbXCJEZXNpZ25cIiwgXCJJbiBQcm9ncmVzc1wiLCBcIlJlc29sdmVkXCIsIFwiVG90YWxcIl0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgbGFiZWxWYWx1ZXM6IFtcIlAxXCIsIFwiUDJcIiwgXCJQM1wiLCBcIlRvdGFsXCJdLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiRGVzaWduXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IFtcclxuICAgICAgICAgICAgICBbMCwgMCwgMV0sXHJcbiAgICAgICAgICAgICAgWzAsIDEsIDJdLFxyXG4gICAgICAgICAgICAgIFswLCAyLCAzXSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IFwiSW4gUHJvZ3Jlc3NcIixcclxuICAgICAgICAgICAgZGF0YTogW1xyXG4gICAgICAgICAgICAgIFsxLCAwLCA0XSxcclxuICAgICAgICAgICAgICBbMSwgMSwgNV0sXHJcbiAgICAgICAgICAgICAgWzEsIDIsIDZdLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogXCJSZXNvbHZlZFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBbXHJcbiAgICAgICAgICAgICAgWzIsIDAsIDddLFxyXG4gICAgICAgICAgICAgIFsyLCAxLCA4XSxcclxuICAgICAgICAgICAgICBbMiwgMiwgOV0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiBcIlRvdGFsXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IFtcclxuICAgICAgICAgICAgICBbMywgMCwgMTJdLFxyXG4gICAgICAgICAgICAgIFszLCAxLCAxNV0sXHJcbiAgICAgICAgICAgICAgWzMsIDIsIDE4XSxcclxuICAgICAgICAgICAgICBbMCwgMywgNl0sXHJcbiAgICAgICAgICAgICAgWzEsIDMsIDE1XSxcclxuICAgICAgICAgICAgICBbMiwgMywgMjRdLFxyXG4gICAgICAgICAgICAgIFszLCAzLCAxMF0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGNvbG9yOiBcInJnYmEoMjU1LDI1NSwyNTUsMClcIixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfTtcclxuICAgICAgY2hhcnRTZXJ2aWNlLmNyZWF0ZUNoYXJ0KCRwaXZvdHRhYmxlY29udGFpbmVyLCBwaXZvdHRhYmxlT3B0aW9ucyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbkFTU0FSZXBvcnRUYWIuZW5oYW5jZShBU1NBUmVwb3J0VGFiLCAkKFwiLnRhc2stY29udHJpYnV0aW9uXCIpLCB7fSk7XHJcbiJdfQ==