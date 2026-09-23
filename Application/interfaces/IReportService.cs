using Application.Core;
using Application.DTOs.Reporting;
using Domain;
using static Application.Core.Enums;

namespace Application.Interfaces
{
    public interface IReportService
    {
        ParameterValue CreateReportParameter(string astrName, string astrValue);
        Task<Result<List<ReportResponseDto>>> GetAllReports();
        // Task<Result<List<SelectOption>>> GetParameterDataSource(int reportId, int parameterId, bool showAllOption = false);
        // Task<Result<List<SelectOption>>> GetDepenedentParameterDataSource(int reportId, int parameterId, string selectedValue, bool showAllOption = false);

        Task<Result<List<SelectOption>>> GetParameterDataSource(int reportId, int parameterId, string? selectedValue, bool showAllOption = false);

        Task<Result<ReportResponseDto>> GetReport(int reportId);
        Task<List<Domain.ReportParameter>> GetReportParameters(int reportId);
        Task<FileResult<byte[]>> RunReport(RunReportRequestDto runReportRequestDto);
    }
}