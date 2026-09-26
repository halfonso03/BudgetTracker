import { useState } from 'react';
import useReports from '../../api/hooks/reports/useReports';
import ReportParameters from './ReportParameters';
import useRunReport from '../../api/hooks/reports/useRunReport';

const Reports = () => {
  const [reportParameters, setReportParameters] = useState<
    ReportParameter2[] | null
  >(null);
  const [selectedReport, setSelectedReport] = useState<Report2 | null>(null);
  // const [selectedValues, setSelectedValues] = useState<ParameterSelections[]>(
  //   [],
  // );
  const { data, isLoading } = useReports();
  const { getReport, running } = useRunReport();

  if (!data || isLoading) return <div>Loading...</div>;

  function loadParams(id: number) {
    setSelectedReport(data?.filter((x) => x.id === id)[0] ?? null);
    setReportParameters(data!.filter((r) => r.id === id)[0]!.parameters);
  }

  async function handleRunReport(values: ParameterSelections[]) {
    if (selectedReport) {
      const request: RunReportRequest = {
        path: selectedReport!.path,
        reportId: selectedReport!.id,
        reportExportFormat: 1,
        fileName: selectedReport!.downloadFilename!,
        parameters: values.map((v) => ({
          name: v.name,
          value:
            v.values !== null && v.values !== undefined
              ? v.values!.join(',')
              : v.value!,
        })),
      };
      await getReport(request);
    }

    // setSelectedValues(values);
  }

  // console.log('reports render');
  return (
    <div className="pt-4">
      {running && <div>Running report...</div>}
      {/* selectedValues: <pre>{JSON.stringify(selectedValues)}</pre> */}
      <div className="grid grid-cols-[1fr_3fr] gap-8 ">
        <div className="border-r border-r-neutral-300">
          {data?.map((r, i) => (
            <div key={i} className="mb-4">
              <button
                className={`cursor-pointer ${r.id === selectedReport?.id ? ' font-bold ' : ''}`}
                onClick={() => loadParams(r.id)}
              >
                {r.name}
              </button>
            </div>
          ))}
        </div>
        <div className="pt-4">
          {reportParameters && (
            <ReportParameters
              parameters={reportParameters}
              reportId={selectedReport!.id!}
              onRunReport={handleRunReport}
            ></ReportParameters>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reports;
