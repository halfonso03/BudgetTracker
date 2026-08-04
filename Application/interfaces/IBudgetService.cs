using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Budgets.DTOs;

namespace Application.interfaces
{
    public interface IBudgetService
    {
        Task<List<BudgetDto>> GetBudgets(int year, int initiativeId = 0);

        Task<BudgetDto> GetBudget(int initiativeId, int grantId);
    }
}