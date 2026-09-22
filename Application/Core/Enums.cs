using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class Enums
    {
        public enum AmountType
        {
            CurrentAmount,
            RemainingAmount
        }
        public enum ReportExportFormat
        {
            PDF,
            WORD,
            WORD97,
            EXCEL,
            EXCELOPENXML,
        }

        public enum BudgetType
        {
            Approved = 1,
            Current = 2,
            Remaining = 3
        }
      
    }
}