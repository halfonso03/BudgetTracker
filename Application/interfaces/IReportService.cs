using Domain;
using static Application.Core.Enums;

namespace Application.Interfaces
{
    public interface IReportService
    {
        ParameterValue CreateReportParameter(string astrName, string astrValue);
        Task<Report> GetReportInfo(int reportId);
        Task<List<Domain.ReportParameter>> GetReportParameters(int reportId);
        Task<byte[]> RunReport(string path, ParameterValue[]? parameters = null, ReportExportFormat exportFormat = ReportExportFormat.EXCELOPENXML);
    }
}