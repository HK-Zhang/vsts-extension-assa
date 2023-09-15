import { ComplianceCount, ComplianceData } from "../../type/AssaResult";

export const getSatausOverviewData = (
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

export const getStatusByResponsibleData = (
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
