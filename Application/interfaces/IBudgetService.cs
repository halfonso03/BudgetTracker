using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Budgets;

namespace Application.Interfaces
{
    public interface IBudgetService
    {
        Task<List<BudgetDto>> GetBudgetsForYear(int year);
        Task<BudgetDto> GetBudget(int initiativeId, int grantId);
        Task<Result<Unit>> CreateBudget(CreateBudgetRequestDto createBudgetDtos);
        Task<Result<Unit>> UpdateBudget(UpdateBudgetRequestDto updateBudgetDto);
    }
}