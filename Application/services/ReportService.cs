using System.Net;
using System.ServiceModel;
using Application.Core;
using Application.DTOs.Reporting;
using Application.Exceptions;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class ReportService(AppDbContext dbContext,
                ReportParameterValuesService reportParameterValuesService) : IReportService
    {

        public async Task<Result<ReportResponseDto>> GetReport(int reportId)
        {
            var report = await dbContext.Reports
                    .Include(x => x.Parameters)
                    .Include(x => x.Category)
                    .FirstAsync(x => x.Id == reportId);

            var response = new ReportResponseDto
            {
                Id = report.Id,
                Name = report.Name,
                CategoryId = report.CategoryId,
                Path = report.Path,
                Enabled = true,
                Parameters = Helpers.ConvertReportParametersToDto(report.Parameters)
            };

            return Result<ReportResponseDto>.Success(response);
        }

        public async Task<List<Domain.ReportParameter>> GetReportParameters(int reportId)
        {
            return await dbContext.ReportParameters.Where(x => x.ReportId == reportId).ToListAsync();
        }

        public async Task<Result<List<ReportResponseDto>>> GetAllReports()
        {
            var reports = await dbContext.Reports
                                .Include(x => x.Parameters)
                                .OrderBy(x => x.Name)
                                .ToListAsync();

            var response = reports.Select(x =>
                    ReportResponseDto.Create(
                            x.Id,
                            x.Name,
                            x.Path,
                            Helpers.ConvertReportParametersToDto([.. x.Parameters.Where(x => x.Enabled)])))
                            .ToList();

            return Result<List<ReportResponseDto>>.Success(response);
        }

        public async Task<Result<List<SelectOption>>> GetParameterDataSource(int reportId, int parameterId, string? selectedValue, bool showAllOption = false)
        {
            var p = await dbContext.ReportParameters.SingleAsync(x => x.ReportId == reportId && x.Id == parameterId);
            var options = await reportParameterValuesService.GetDropdownValues(p.Name, showAllOption, selectedValue);

            if (options != null)
                return Result<List<SelectOption>>.Success(options);


            return Result<List<SelectOption>>.Failure("", 500);
        }
    }
}