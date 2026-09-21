using System.Net;
using System.ServiceModel;
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

        public async Task<byte[]> RunReport(string path, ParameterValue[]? parameters = null, ReportExportFormat exportFormat = ReportExportFormat.EXCELOPENXML)
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
                var taskLoadReport = await rsExec.LoadReportAsync(trusteduserHeader, path, null);

                var executionHeader = new ExecutionHeader
                {
                    ExecutionID = taskLoadReport.executionInfo.ExecutionID
                };

                //Set the parameteres asked for by the report
                //var reportParameters = taskLoadReport.Where(x => parameters.ContainsKey(x.Name)).Select(x => new ParameterValue() { Name = x.Name, Value = parameters[x.Name].ToString() }).ToArray();

                if (parameters != null && parameters.Length > 0)
                {
                    await rsExec.SetExecutionParametersAsync(
                        executionHeader,
                        trusteduserHeader,
                        parameters,
                        "en-us");
                }

                //run the report
                const string deviceInfo = @"<DeviceInfo><Toolbar>False</Toolbar></DeviceInfo>";
                var response = await rsExec.RenderAsync(new RenderRequest(executionHeader, trusteduserHeader, exportFormat.ToString(), deviceInfo));

                return response.Result;
            }
            catch (Exception ex)
            {
                throw ReportException.CreateReportException(ex.Message, ex.InnerException?.Message ?? "");
            }
        }

        public async Task<Report> GetReportInfo(int reportId)
        {
            return await _dbContext.Reports.FirstAsync(x => x.Id == reportId);
        }

        public async Task<List<Domain.ReportParameter>> GetReportParameters(int reportId)
        {
            return await _dbContext.ReportParameters.Where(x => x.ReportId == reportId).ToListAsync();
        }

    }
}