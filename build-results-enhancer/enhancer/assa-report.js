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
    exports.ASSAReportTab = ASSAReportTab;
    ASSAReportTab.enhance(ASSAReportTab, $(".task-contribution"), {});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzYS1yZXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhc3NhLXJlcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBUUEsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDO0lBQzVCLE1BQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUM7SUFDcEQsTUFBTSxvQkFBb0IsR0FBRyxzQkFBc0IsQ0FBQztJQUVwRCxNQUFhLGFBQWMsU0FBUSxRQUFRLENBQUMsV0FBVztRQU1yRDtZQUNFLEtBQUssRUFBRSxDQUFDO1lBTkYsY0FBUyxHQUFXLEVBQUUsQ0FBQztZQUN2QixXQUFNLEdBQVcsRUFBRSxDQUFDO1lBRXBCLGVBQVUsR0FBa0IsRUFBRSxDQUFDO1lBTWhDLGVBQVUsR0FBRyxHQUFTLEVBQUU7Z0JBQzdCLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbkIsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQ3BDLDJFQUEyRTtnQkFDM0UsTUFBTSxZQUFZLEdBQ2hCLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN6QixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3ZDLElBQUksWUFBWSxFQUFFO29CQUNoQixxREFBcUQ7b0JBQ3JELFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUE4QixFQUFFLEVBQUU7d0JBQzdELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7d0JBRTdDLElBQUksQ0FBQyxVQUFVOzZCQUNaLGtCQUFrQixDQUNqQixJQUFJLENBQUMsU0FBUyxFQUNkLFdBQVcsRUFD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QUEwQjtZQUMxQixlQUFlO1lBQ2YsOEJBQThCO1lBQzlCLHNCQUFzQjtZQUN0QixnQkFBZ0I7WUFDaEIscUNBQXFDO1lBQ3JDLGlCQUFpQjtZQUNqQixlQUFlO1lBQ2YscUJBQXFCO1lBQ3JCLDhFQUE4RTtZQUM5RSxlQUFlO1lBQ2Ysa0NBQWtDO1lBQ2xDLGdDQUFnQztZQUNoQywyQkFBMkI7WUFDM0IsZUFBZTtZQUNmLGFBQWE7WUFFYiw4REFBOEQ7WUFDOUQsNkRBQTZEO1lBQzdELFlBQVk7WUFDWixTQUFTO1lBQ1QsT0FBTztZQUNQLE1BQU07UUFDUixDQUFDO0tBQ0Y7SUF2SUQsc0NBdUlDO0lBRUQsYUFBYSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBDb250cm9scyBmcm9tIFwiVlNTL0NvbnRyb2xzXCI7XHJcbmltcG9ydCAqIGFzIFRGU0J1aWxkQ29udHJhY3RzIGZyb20gXCJURlMvQnVpbGQvQ29udHJhY3RzXCI7XHJcbmltcG9ydCAqIGFzIFRGU0J1aWxkRXh0ZW5zaW9uQ29udHJhY3RzIGZyb20gXCJURlMvQnVpbGQvRXh0ZW5zaW9uQ29udHJhY3RzXCI7XHJcbmltcG9ydCAqIGFzIENoYXJ0c1NlcnZpY2VzIGZyb20gXCJDaGFydHMvU2VydmljZXNcIjtcclxuaW1wb3J0ICogYXMgRFRDbGllbnQgZnJvbSBcIlRGUy9EaXN0cmlidXRlZFRhc2svVGFza1Jlc3RDbGllbnRcIjtcclxuaW1wb3J0ICogYXMgV2lkZ2V0SGVscGVycyBmcm9tIFwiVEZTL0Rhc2hib2FyZHMvV2lkZ2V0SGVscGVyc1wiO1xyXG5pbXBvcnQgeyBDb21tb25DaGFydE9wdGlvbnMgfSBmcm9tIFwiQ2hhcnRzL0NvbnRyYWN0c1wiO1xyXG5cclxuY29uc3QgQlVJTERfUEhBU0UgPSBcImJ1aWxkXCI7XHJcbmNvbnN0IEhUTUxfQVRUQUNITUVOVF9UWVBFID0gXCJIVE1MX0FUVEFDSE1FTlRfVFlQRVwiO1xyXG5jb25zdCBKU09OX0FUVEFDSE1FTlRfVFlQRSA9IFwiSlNPTl9BVFRBQ0hNRU5UX1RZUEVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBU1NBUmVwb3J0VGFiIGV4dGVuZHMgQ29udHJvbHMuQmFzZUNvbnRyb2wge1xyXG4gIHByaXZhdGUgcHJvamVjdElkOiBzdHJpbmcgPSBcIlwiO1xyXG4gIHByaXZhdGUgcGxhbklkOiBzdHJpbmcgPSBcIlwiO1xyXG4gIHByaXZhdGUgdGFza0NsaWVudDogRFRDbGllbnQuVGFza0h0dHBDbGllbnQ0IHwgdW5kZWZpbmVkO1xyXG4gIHByaXZhdGUgcmVwb3J0TGlzdDogSFRNTEVsZW1lbnRbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5pdGlhbGl6ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcclxuICAgIFdpZGdldEhlbHBlcnMuSW5jbHVkZVdpZGdldFN0eWxlcygpO1xyXG4gICAgLy8gR2V0IGNvbmZpZ3VyYXRpb24gdGhhdCdzIHNoYXJlZCBiZXR3ZWVuIGV4dGVuc2lvbiBhbmQgdGhlIGV4dGVuc2lvbiBob3N0XHJcbiAgICBjb25zdCBzaGFyZWRDb25maWc6IFRGU0J1aWxkRXh0ZW5zaW9uQ29udHJhY3RzLklCdWlsZFJlc3VsdHNWaWV3RXh0ZW5zaW9uQ29uZmlnID1cclxuICAgICAgVlNTLmdldENvbmZpZ3VyYXRpb24oKTtcclxuICAgIGNvbnN0IHZzb0NvbnRleHQgPSBWU1MuZ2V0V2ViQ29udGV4dCgpO1xyXG4gICAgaWYgKHNoYXJlZENvbmZpZykge1xyXG4gICAgICAvLyByZWdpc3RlciB5b3VyIGV4dGVuc2lvbiB3aXRoIGhvc3QgdGhyb3VnaCBjYWxsYmFja1xyXG4gICAgICBzaGFyZWRDb25maWcub25CdWlsZENoYW5nZWQoKGJ1aWxkOiBURlNCdWlsZENvbnRyYWN0cy5CdWlsZCkgPT4ge1xyXG4gICAgICAgIHRoaXMudGFza0NsaWVudCA9IERUQ2xpZW50LmdldENsaWVudCgpO1xyXG4gICAgICAgIHRoaXMucHJvamVjdElkID0gdnNvQ29udGV4dC5wcm9qZWN0LmlkO1xyXG4gICAgICAgIHRoaXMucGxhbklkID0gYnVpbGQub3JjaGVzdHJhdGlvblBsYW4ucGxhbklkO1xyXG5cclxuICAgICAgICB0aGlzLnRhc2tDbGllbnRcclxuICAgICAgICAgIC5nZXRQbGFuQXR0YWNobWVudHMoXHJcbiAgICAgICAgICAgIHRoaXMucHJvamVjdElkLFxyXG4gICAgICAgICAgICBCVUlMRF9QSEFTRSxcclxuICAgICAgICAgICAgdGhpcy5wbGFuSWQsXHJcbiAgICAgICAgICAgIEpTT05fQVRUQUNITUVOVF9UWVBFXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAudGhlbigodGFza0F0dGFjaG1lbnRzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhc2tBdHRhY2htZW50ID0gdGFza0F0dGFjaG1lbnRzLmZpbmQoXHJcbiAgICAgICAgICAgICAgKGF0dGFjaG1lbnQpID0+IGF0dGFjaG1lbnQubmFtZSA9PT0gXCJhc3NhLmxvZ1wiXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGFza0F0dGFjaG1lbnQpIHtcclxuICAgICAgICAgICAgICBjb25zdCBhdHRhY2htZW50TmFtZSA9IHRhc2tBdHRhY2htZW50Lm5hbWU7XHJcbiAgICAgICAgICAgICAgY29uc3QgdGltZWxpbmVJZCA9IHRhc2tBdHRhY2htZW50LnRpbWVsaW5lSWQ7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVjb3JkSWQgPSB0YXNrQXR0YWNobWVudC5yZWNvcmRJZDtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy50YXNrQ2xpZW50IS5nZXRBdHRhY2htZW50Q29udGVudChcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdElkLFxyXG4gICAgICAgICAgICAgICAgQlVJTERfUEhBU0UsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYW5JZCxcclxuICAgICAgICAgICAgICAgIHRpbWVsaW5lSWQsXHJcbiAgICAgICAgICAgICAgICByZWNvcmRJZCxcclxuICAgICAgICAgICAgICAgIEpTT05fQVRUQUNITUVOVF9UWVBFLFxyXG4gICAgICAgICAgICAgICAgYXR0YWNobWVudE5hbWVcclxuICAgICAgICAgICAgICApLnRoZW4oKGNvbnRlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICAgICAgICBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKS5kZWNvZGUobmV3IERhdGFWaWV3KGNvbnRlbnQpKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlclJlcG9ydChcclxuICAgICAgICAgICAgICAgICAgbmV3IFRleHREZWNvZGVyKFwidXRmLThcIikuZGVjb2RlKG5ldyBEYXRhVmlldyhjb250ZW50KSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAvLyAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIG5ldyBUZXh0RGVjb2RlcigndXRmLTgnKS5kZWNvZGUobmV3IERhdGFWaWV3KGNvbnRlbnQpKSxcclxuICAgICAgICAgICAgICAgIC8vICAgKTtcclxuICAgICAgICAgICAgICAgIFZTUy5ub3RpZnlMb2FkU3VjY2VlZGVkKCk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gICAgIHRhc2tBdHRhY2htZW50cy5mb3JFYWNoKHRhc2tBdHRhY2htZW50PT57XHJcblxyXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2codGFza0F0dGFjaG1lbnQpXHJcbiAgICAgICAgICAgIC8vICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBfcmVuZGVyUmVwb3J0KGNvbnRlbnQ6IHN0cmluZykge1xyXG4gICAgdmFyIGVsZW1lbnQgPSAkKFwiPHByZSAvPlwiKTtcclxuICAgIGVsZW1lbnQudGV4dChjb250ZW50KTtcclxuICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgQ2hhcnRzU2VydmljZXMuQ2hhcnRzU2VydmljZS5nZXRTZXJ2aWNlKCkudGhlbihmdW5jdGlvbiAoY2hhcnRTZXJ2aWNlKSB7XHJcbiAgICAgIHZhciAkY29udGFpbmVyID0gJChcIiNjaGFydFwiKTtcclxuICAgICAgdmFyIGNoYXJ0T3B0aW9uczogQ29tbW9uQ2hhcnRPcHRpb25zID0ge1xyXG4gICAgICAgIGhvc3RPcHRpb25zOiB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDI5MCxcclxuICAgICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGFydFR5cGU6IFwicGllXCIsXHJcbiAgICAgICAgc2VyaWVzOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGE6IFsxMSwgNCwgMywgMV0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgeEF4aXM6IHtcclxuICAgICAgICAgIGxhYmVsVmFsdWVzOiBbXCJEZXNpZ25cIiwgXCJPbiBEZWNrXCIsIFwiQ29tcGxldGVkXCIsIFwiRGV2ZWxvcG1lbnRcIl0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzcGVjaWFsaXplZE9wdGlvbnM6IHtcclxuICAgICAgICAgIHNob3dMYWJlbHM6IHRydWUsXHJcbiAgICAgICAgICBzaXplOiBcIjIwMFwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygkY29udGFpbmVyKTtcclxuICAgICAgY2hhcnRTZXJ2aWNlLmNyZWF0ZUNoYXJ0KCRjb250YWluZXIsIGNoYXJ0T3B0aW9ucyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBWU1MucmVnaXN0ZXIoXCJidWlsZC1idWlsdGluLXRhc2stZGVwZW5kZW50LXRhYlwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyAgIHJldHVybiB7XHJcbiAgICAvLyAgICAgbG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICAgICAgcmV0dXJuIENoYXJ0c1NlcnZpY2VzLkNoYXJ0c1NlcnZpY2UuZ2V0U2VydmljZSgpLnRoZW4oZnVuY3Rpb24gKFxyXG4gICAgLy8gICAgICAgICBjaGFydFNlcnZpY2VcclxuICAgIC8vICAgICAgICkge1xyXG4gICAgLy8gICAgICAgICB2YXIgJGNvbnRhaW5lciA9ICQoXCIjY2hhcnRcIik7XHJcbiAgICAvLyAgICAgICAgIHZhciBjaGFydE9wdGlvbnM6IENvbW1vbkNoYXJ0T3B0aW9ucyA9IHtcclxuICAgIC8vICAgICAgICAgICBob3N0T3B0aW9uczoge1xyXG4gICAgLy8gICAgICAgICAgICAgaGVpZ2h0OiAyOTAsXHJcbiAgICAvLyAgICAgICAgICAgICB3aWR0aDogMzAwLFxyXG4gICAgLy8gICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgICAgY2hhcnRUeXBlOiBcInBpZVwiLFxyXG4gICAgLy8gICAgICAgICAgIHNlcmllczogW1xyXG4gICAgLy8gICAgICAgICAgICAge1xyXG4gICAgLy8gICAgICAgICAgICAgICBkYXRhOiBbMTEsIDQsIDMsIDFdLFxyXG4gICAgLy8gICAgICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgICBdLFxyXG4gICAgLy8gICAgICAgICAgIHhBeGlzOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBsYWJlbFZhbHVlczogW1wiRGVzaWduXCIsIFwiT24gRGVja1wiLCBcIkNvbXBsZXRlZFwiLCBcIkRldmVsb3BtZW50XCJdLFxyXG4gICAgLy8gICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgICAgc3BlY2lhbGl6ZWRPcHRpb25zOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBzaG93TGFiZWxzOiB0cnVlLFxyXG4gICAgLy8gICAgICAgICAgICAgc2l6ZTogXCIyMDBcIixcclxuICAgIC8vICAgICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICB9O1xyXG5cclxuICAgIC8vICAgICAgICAgY2hhcnRTZXJ2aWNlLmNyZWF0ZUNoYXJ0KCRjb250YWluZXIsIGNoYXJ0T3B0aW9ucyk7XHJcbiAgICAvLyAgICAgICAgIHJldHVybiBXaWRnZXRIZWxwZXJzLldpZGdldFN0YXR1c0hlbHBlci5TdWNjZXNzKCk7XHJcbiAgICAvLyAgICAgICB9KTtcclxuICAgIC8vICAgICB9LFxyXG4gICAgLy8gICB9O1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG59XHJcblxyXG5BU1NBUmVwb3J0VGFiLmVuaGFuY2UoQVNTQVJlcG9ydFRhYiwgJChcIi50YXNrLWNvbnRyaWJ1dGlvblwiKSwge30pO1xyXG4iXX0=