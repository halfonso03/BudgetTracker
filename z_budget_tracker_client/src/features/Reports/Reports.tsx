import { useState } from 'react';
import useReports from '../../api/hooks/reports/useReports';
import ReportParameters from './ReportParameters';

const Reports = () => {
  const { data, isLoading } = useReports();

  const [selected, setSelected] = useState<ReportParameter2[] | null>(null);
  const [reportId, setReportId] = useState(0);
  const [selectedValues, setSelectedValues] = useState<ParameterSelections[]>(
    [],
  );

  if (!data || isLoading) return <div>Loading...</div>;

  function loadParams(id: number) {
    setReportId(id);
    setSelected(data!.filter((r) => r.id === id)[0]!.parameters);
  }

  function handleRunReport(values: ParameterSelections[]) {
    setSelectedValues(values);
  }

  // console.log('reports render');
  return (
    <div className='pt-4'>
      selectedValues: <pre>{JSON.stringify(selectedValues)}</pre>
      
      <div className="grid grid-cols-[1fr_3fr] gap-8 ">
        <div className='border-r border-r-neutral-300'>
          {data?.map((r, i) => (
            <div key={i} className="mb-4">
              <button
                className={`cursor-pointer ${r.id === reportId ? ' font-bold ' : ''}`}
                onClick={() => loadParams(r.id)}
              >
                {r.name} 
              </button>
            </div>
          ))}
        </div>
        <div className='pt-4'>
          {selected && (
            <ReportParameters
              parameters={selected}
              reportId={reportId}
              onRunReport={handleRunReport}
            ></ReportParameters>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reports;
