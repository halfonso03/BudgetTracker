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
                ReportParameterValuesService reportParameterValuesService,
                string reportServerUserName,
                string reportServerPassword,
                string reportServerIP,
                string reportServerUrl) : IReportService
    {
        public ParameterValue CreateReportParameter(string astrName, string astrValue)
        {
            ParameterValue param = new()
            {
                Name = astrName
            };

            if (astrValue == null)
                return param;

            if (!string.IsNullOrEmpty(astrValue.Trim()))
            {
                param.Value = astrValue;
            }

            return param;
        }

        public async Task<FileResult<byte[]>> RunReport(RunReportRequestDto runReportRequestDto)
        {

            var binding = new BasicHttpBinding(BasicHttpSecurityMode.TransportCredentialOnly);
            binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.Ntlm;
            binding.MaxReceivedMessageSize = 10485760; //I wanted a 10MB size limit on response to allow for larger PDFs
            binding.SendTimeout = TimeSpan.FromSeconds(300);

            //Create the execution service SOAP Client
            var rsExec = new ReportExecutionServiceSoapClient(binding, new EndpointAddress(reportServerUrl));

            //Setup access credentials. I use windows credentials, yours may differ
            var clientCredentials = new NetworkCredential(
                reportServerUserName,
                reportServerPassword,
                reportServerIP);
            rsExec.ClientCredentials.Windows.AllowedImpersonationLevel = System.Security.Principal.TokenImpersonationLevel.Impersonation;
            rsExec.ClientCredentials.Windows.ClientCredential = clientCredentials;

            //This handles the problem of "Missing session identifier"
            //rsExec.Endpoint.EndpointBehaviors.Add( new ReportingServicesEndpointBehavior());

            TrustedUserHeader? trusteduserHeader = null;

            try
            {
                var taskLoadReport = await rsExec.LoadReportAsync(trusteduserHeader, runReportRequestDto.Path, null);

                var executionHeader = new ExecutionHeader
                {
                    ExecutionID = taskLoadReport.executionInfo.ExecutionID
                };

                //Set the parameteres asked for by the report
                //var reportParameters = taskLoadReport.Where(x => parameters.ContainsKey(x.Name)).Select(x => new ParameterValue() { Name = x.Name, Value = parameters[x.Name].ToString() }).ToArray();

                if (runReportRequestDto.Parameters != null && runReportRequestDto.Parameters.Count > 0)
                {
                    await rsExec.SetExecutionParametersAsync(
                        executionHeader,
                        trusteduserHeader,
                        [.. runReportRequestDto.Parameters.Select(x => CreateReportParameter(x.Name, x.Value))],
                        "en-us");
                }

                const string deviceInfo = @"<DeviceInfo><Toolbar>False</Toolbar></DeviceInfo>";
                var response = await rsExec.RenderAsync(new RenderRequest(executionHeader, trusteduserHeader, runReportRequestDto.Format.ToString(), deviceInfo));

                return FileResult<byte[]>.Success(
                    response.Result,
                    Helpers.GetContentTypeFromRSFormat(runReportRequestDto.Format),
                    runReportRequestDto.FileName);
            }
            catch (Exception ex)
            {
                throw ReportException.CreateReportException(ex.Message, ex.InnerException?.Message ?? "");
            }
        }

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