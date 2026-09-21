using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Application.Core.Enums;

namespace Application.Core
{
    public class Helpers
    {
        public static string GetContentTypeFromRSFormat(ReportExportFormat format)
        {
            return format switch
            {
                //case "TEXT":
                //    return "text/plain";
                ReportExportFormat.PDF => "application/pdf",
                ReportExportFormat.WORD97 => "application/msword ",
                ReportExportFormat.WORD => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ReportExportFormat.EXCEL => "application/msexcel",
                ReportExportFormat.EXCELOPENXML => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                _ => "",
            };
        }

        public static string GetContentTypeFromFileExtension(string extension)
        {
            return extension switch
            {
                "txt" => "text/plain",
                "pdf" => "application/pdf",
                "doc" => "application/msword ",
                "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "xls" => "application/msexcel",
                "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "bmp" => "image/bmp",
                "gif" => "image/gif",
                "jpg" => "image/jpeg",
                "jpeg" => "image/jpeg",
                "zip" => "application/zip",
                "pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                _ => "",
            };
        }


        public static string GetFileExtensionFromContentType(ReportExportFormat exportFormat)
        {
            return exportFormat switch
            {
                //case "TEXT":
                //    return "text/plain";
                ReportExportFormat.PDF => "pdf",
                ReportExportFormat.WORD97 => "doc ",
                ReportExportFormat.WORD => "docx",
                ReportExportFormat.EXCEL => "xls",
                ReportExportFormat.EXCELOPENXML => "xlsx",
                _ => "",
            };
        }
    }
}