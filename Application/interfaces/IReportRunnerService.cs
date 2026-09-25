using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Reporting;

namespace Application.Interfaces
{
    public interface IReportRunnerService
    {
        Task<FileResult<byte[]>> RunReport(RunReportRequestDto runReportRequestDto);
    }
}