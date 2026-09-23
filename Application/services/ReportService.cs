using System.Net;
using System.ServiceModel;
using Application.Core;
using Application.DTOs.Reporting;
using Application.Exceptions;
using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using static Application.Core.Enums;

namespace Application.Services
{
    public class ReportService(AppDbContext _dbContext, string reportServerUserName, string reportServerPassword, string reportServerIP, string reportServerUrl) : IReportService
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
            var report = await _dbContext.Reports
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
                Parameters = report.Parameters?.Select(x => ReportParameterResponseDto.Create(x.Id, x.SortOrder, x.Name, x.ReportId, x.Label)).ToList()
            };

            return Result<ReportResponseDto>.Success(response);
        }

        public async Task<List<Domain.ReportParameter>> GetReportParameters(int reportId)
        {
            return await _dbContext.ReportParameters.Where(x => x.ReportId == reportId).ToListAsync();
        }

    }
}