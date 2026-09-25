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
    public class ReportRunnerService(string reportServerUserName,
                    string reportServerPassword,
                    string reportServerIP,
                    string reportServerUrl) : IReportRunnerService
    {
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
                        [.. runReportRequestDto.Parameters.Select(x => Helpers.CreateReportParameter(x.Name, x.Value))],
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





    }
}