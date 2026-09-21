using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Exceptions
{
    public class ReportException(string message, string message2 = "") : Exception(message)
    {
        public string? InnerExceptionMessage { get; } = message2;

        public static ReportException CreateReportException(string message, string innerExceptionMessage)
        {
            return new ReportException(message, innerExceptionMessage);
        }
    }
}