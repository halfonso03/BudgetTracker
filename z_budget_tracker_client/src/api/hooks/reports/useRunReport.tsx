import { useState } from 'react';
import agent from '../../agent';

const useRunReport = () => {
  const [reportIsRunning, setRunning] = useState(false);

  async function getReport(runReportRequest: RunReportRequest) {
    try {
      setRunning(true);
      const response = await agent.post(
        '/reports/runReport',
        runReportRequest,
        { responseType: 'blob' },
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const blobUrl = URL.createObjectURL(blob);
      const aTag = document.createElement('a');
      aTag.href = blobUrl;
      aTag.download =
        runReportRequest.fileName + '_' + crypto.randomUUID() + '.xlsx';
      aTag.click();
    } catch (error) {
      console.log('error', error);
    } finally {
      setRunning(false);
    }
  }

  return { getReport, reportIsRunning };
};

export default useRunReport;
