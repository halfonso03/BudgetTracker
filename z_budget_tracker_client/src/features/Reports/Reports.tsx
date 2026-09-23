import { useState } from 'react';
import useReports from '../../api/hooks/reports/useReports';
import ReportParameters from './ReportParameters';

const Reports = () => {
  const { data, isLoading } = useReports();

  const [selected, setSelected] = useState<ReportParameter2[] | null>(null);
  const [reportId, setReportId] = useState(0);

  if (!data || isLoading) return <div>Loading...</div>;

  function loadParams(id: number) {
    setReportId(id);
    setSelected(data!.filter((r) => r.id === id)[0]!.parameters);
  }

  return (
    <div>
      <div className="grid grid-cols-[1fr_3fr]">
        <div>
          {data?.map((r, i) => (
            <div key={i} className="mb-4">
              <button
                className="cursor-pointer"
                onClick={() => loadParams(r.id)}
              >
                {r.id} - 
                {r.name}
              </button>
            </div>
          ))}
        </div>
        <div>
          {selected && (
            <ReportParameters
              parameters={selected}
              reportId={reportId}
            ></ReportParameters>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reports;
