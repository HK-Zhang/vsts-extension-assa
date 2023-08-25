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
define(["require", "exports", "VSS/Controls", "TFS/DistributedTask/TaskRestClient"], function (require, exports, Controls, DTClient) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ASSAReportTab = void 0;
    Controls = __importStar(Controls);
    DTClient = __importStar(DTClient);
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
                                    console.log(new TextDecoder('utf-8').decode(new DataView(content)));
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
    }
    exports.ASSAReportTab = ASSAReportTab;
    ASSAReportTab.enhance(ASSAReportTab, $("#task-contribution"), {});
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzYS1yZXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhc3NhLXJlcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUtBLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQztJQUM1QixNQUFNLG9CQUFvQixHQUFHLHNCQUFzQixDQUFDO0lBQ3BELE1BQU0sb0JBQW9CLEdBQUcsc0JBQXNCLENBQUM7SUFFcEQsTUFBYSxhQUFjLFNBQVEsUUFBUSxDQUFDLFdBQVc7UUFNckQ7WUFDRSxLQUFLLEVBQUUsQ0FBQztZQU5GLGNBQVMsR0FBVyxFQUFFLENBQUM7WUFDdkIsV0FBTSxHQUFXLEVBQUUsQ0FBQztZQUVwQixlQUFVLEdBQWtCLEVBQUUsQ0FBQztZQU1oQyxlQUFVLEdBQUcsR0FBUyxFQUFFO2dCQUM3QixLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ25CLDJFQUEyRTtnQkFDM0UsTUFBTSxZQUFZLEdBQ2hCLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUN6QixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ3ZDLElBQUksWUFBWSxFQUFFO29CQUNoQixxREFBcUQ7b0JBQ3JELFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUE4QixFQUFFLEVBQUU7d0JBQzdELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7d0JBRTdDLElBQUksQ0FBQyxVQUFVOzZCQUNaLGtCQUFrQixDQUNqQixJQUFJLENBQUMsU0FBUyxFQUNkLFdBQVcsRUFDWCxJQUFJLENBQUMsTUFBTSxFQUNYLG9CQUFvQixDQUNyQjs2QkFDQSxJQUFJLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRTs0QkFDeEIsTUFBTSxjQUFjLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FDekMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUMvQyxDQUFDOzRCQUVGLElBQUksY0FBYyxFQUFFO2dDQUNsQixNQUFNLGNBQWMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDO2dDQUMzQyxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO2dDQUM3QyxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDO2dDQUV6QyxJQUFJLENBQUMsVUFBVyxDQUFDLG9CQUFvQixDQUNuQyxJQUFJLENBQUMsU0FBUyxFQUNkLFdBQVcsRUFDWCxJQUFJLENBQUMsTUFBTSxFQUNYLFVBQVUsRUFDVixRQUFRLEVBQ1Isb0JBQW9CLEVBQ3BCLGNBQWMsQ0FDZixDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO29DQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3BFLDZCQUE2QjtvQ0FDN0IsOERBQThEO29DQUM5RCxPQUFPO29DQUNQLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dDQUM1QixDQUFDLENBQUMsQ0FBQzs2QkFDSjs0QkFDRCxnREFBZ0Q7NEJBRWhELGtDQUFrQzs0QkFDbEMsUUFBUTt3QkFHVixDQUFDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsQ0FBQztpQkFDSjtZQUNILENBQUMsQ0FBQztRQXpERixDQUFDO0tBMERGO0lBbEVELHNDQWtFQztJQUVELGFBQWEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQ29udHJvbHMgZnJvbSBcIlZTUy9Db250cm9sc1wiO1xyXG5pbXBvcnQgKiBhcyBURlNCdWlsZENvbnRyYWN0cyBmcm9tIFwiVEZTL0J1aWxkL0NvbnRyYWN0c1wiO1xyXG5pbXBvcnQgKiBhcyBURlNCdWlsZEV4dGVuc2lvbkNvbnRyYWN0cyBmcm9tIFwiVEZTL0J1aWxkL0V4dGVuc2lvbkNvbnRyYWN0c1wiO1xyXG5pbXBvcnQgKiBhcyBEVENsaWVudCBmcm9tIFwiVEZTL0Rpc3RyaWJ1dGVkVGFzay9UYXNrUmVzdENsaWVudFwiO1xyXG5cclxuY29uc3QgQlVJTERfUEhBU0UgPSBcImJ1aWxkXCI7XHJcbmNvbnN0IEhUTUxfQVRUQUNITUVOVF9UWVBFID0gXCJIVE1MX0FUVEFDSE1FTlRfVFlQRVwiO1xyXG5jb25zdCBKU09OX0FUVEFDSE1FTlRfVFlQRSA9IFwiSlNPTl9BVFRBQ0hNRU5UX1RZUEVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBU1NBUmVwb3J0VGFiIGV4dGVuZHMgQ29udHJvbHMuQmFzZUNvbnRyb2wge1xyXG4gIHByaXZhdGUgcHJvamVjdElkOiBzdHJpbmcgPSBcIlwiO1xyXG4gIHByaXZhdGUgcGxhbklkOiBzdHJpbmcgPSBcIlwiO1xyXG4gIHByaXZhdGUgdGFza0NsaWVudDogRFRDbGllbnQuVGFza0h0dHBDbGllbnQ0IHwgdW5kZWZpbmVkO1xyXG4gIHByaXZhdGUgcmVwb3J0TGlzdDogSFRNTEVsZW1lbnRbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5pdGlhbGl6ZSA9ICgpOiB2b2lkID0+IHtcclxuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcclxuICAgIC8vIEdldCBjb25maWd1cmF0aW9uIHRoYXQncyBzaGFyZWQgYmV0d2VlbiBleHRlbnNpb24gYW5kIHRoZSBleHRlbnNpb24gaG9zdFxyXG4gICAgY29uc3Qgc2hhcmVkQ29uZmlnOiBURlNCdWlsZEV4dGVuc2lvbkNvbnRyYWN0cy5JQnVpbGRSZXN1bHRzVmlld0V4dGVuc2lvbkNvbmZpZyA9XHJcbiAgICAgIFZTUy5nZXRDb25maWd1cmF0aW9uKCk7XHJcbiAgICBjb25zdCB2c29Db250ZXh0ID0gVlNTLmdldFdlYkNvbnRleHQoKTtcclxuICAgIGlmIChzaGFyZWRDb25maWcpIHtcclxuICAgICAgLy8gcmVnaXN0ZXIgeW91ciBleHRlbnNpb24gd2l0aCBob3N0IHRocm91Z2ggY2FsbGJhY2tcclxuICAgICAgc2hhcmVkQ29uZmlnLm9uQnVpbGRDaGFuZ2VkKChidWlsZDogVEZTQnVpbGRDb250cmFjdHMuQnVpbGQpID0+IHtcclxuICAgICAgICB0aGlzLnRhc2tDbGllbnQgPSBEVENsaWVudC5nZXRDbGllbnQoKTtcclxuICAgICAgICB0aGlzLnByb2plY3RJZCA9IHZzb0NvbnRleHQucHJvamVjdC5pZDtcclxuICAgICAgICB0aGlzLnBsYW5JZCA9IGJ1aWxkLm9yY2hlc3RyYXRpb25QbGFuLnBsYW5JZDtcclxuXHJcbiAgICAgICAgdGhpcy50YXNrQ2xpZW50XHJcbiAgICAgICAgICAuZ2V0UGxhbkF0dGFjaG1lbnRzKFxyXG4gICAgICAgICAgICB0aGlzLnByb2plY3RJZCxcclxuICAgICAgICAgICAgQlVJTERfUEhBU0UsXHJcbiAgICAgICAgICAgIHRoaXMucGxhbklkLFxyXG4gICAgICAgICAgICBKU09OX0FUVEFDSE1FTlRfVFlQRVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgLnRoZW4oKHRhc2tBdHRhY2htZW50cykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0YXNrQXR0YWNobWVudCA9IHRhc2tBdHRhY2htZW50cy5maW5kKFxyXG4gICAgICAgICAgICAgIChhdHRhY2htZW50KSA9PiBhdHRhY2htZW50Lm5hbWUgPT09IFwiYXNzYS5sb2dcIlxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRhc2tBdHRhY2htZW50KSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgYXR0YWNobWVudE5hbWUgPSB0YXNrQXR0YWNobWVudC5uYW1lO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHRpbWVsaW5lSWQgPSB0YXNrQXR0YWNobWVudC50aW1lbGluZUlkO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlY29yZElkID0gdGFza0F0dGFjaG1lbnQucmVjb3JkSWQ7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMudGFza0NsaWVudCEuZ2V0QXR0YWNobWVudENvbnRlbnQoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3RJZCxcclxuICAgICAgICAgICAgICAgIEJVSUxEX1BIQVNFLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGFuSWQsXHJcbiAgICAgICAgICAgICAgICB0aW1lbGluZUlkLFxyXG4gICAgICAgICAgICAgICAgcmVjb3JkSWQsXHJcbiAgICAgICAgICAgICAgICBKU09OX0FUVEFDSE1FTlRfVFlQRSxcclxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnROYW1lXHJcbiAgICAgICAgICAgICAgKS50aGVuKChjb250ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXcgVGV4dERlY29kZXIoJ3V0Zi04JykuZGVjb2RlKG5ldyBEYXRhVmlldyhjb250ZW50KSkpO1xyXG4gICAgICAgICAgICAgICAgLy8gICBjb25zdCBqc29uID0gSlNPTi5wYXJzZShcclxuICAgICAgICAgICAgICAgIC8vICAgICBuZXcgVGV4dERlY29kZXIoJ3V0Zi04JykuZGVjb2RlKG5ldyBEYXRhVmlldyhjb250ZW50KSksXHJcbiAgICAgICAgICAgICAgICAvLyAgICk7XHJcbiAgICAgICAgICAgICAgICBWU1Mubm90aWZ5TG9hZFN1Y2NlZWRlZCgpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICB0YXNrQXR0YWNobWVudHMuZm9yRWFjaCh0YXNrQXR0YWNobWVudD0+e1xyXG5cclxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHRhc2tBdHRhY2htZW50KVxyXG4gICAgICAgICAgICAvLyAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuQVNTQVJlcG9ydFRhYi5lbmhhbmNlKEFTU0FSZXBvcnRUYWIsICQoXCIjdGFzay1jb250cmlidXRpb25cIiksIHt9KTtcclxuIl19