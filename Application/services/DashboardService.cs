using Application.Core;
using Domain;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public class DashboardService
    {

        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Executes the stored procedure to retrieve combined burn-rate, runway, and surplus metrics.
        /// </summary>
        /// <param name="hidtaId">The HIDTA ID filter.</param>
        /// <param name="year">The fiscal year filter.</param>
        /// <returns>A list of BudgetSurplusBurnRateDto records.</returns>
        public async Task<Result<List<BudgetSurplusAndBurnRateDto>>> GetBudgetSurplusBurnRateReportAsync(int hidtaId, int year)
        {
            var result = await _context.Database
                .SqlQueryRaw<BudgetSurplusAndBurnRateDto>(
                    "EXEC dbo.usp_GetBudgetSurplusBurnRateReport @hidtaid = {0}, @year = {1}",
                    hidtaId, year
                )
                .ToListAsync();


            return Result<List<BudgetSurplusAndBurnRateDto>>.Success(result);
        }

        public async Task<Result<List<BudgetSurplusAndBurnRateByAccountDto>>> GetBudgetSurplusBurnRateReportByAccountAsync(int initiativeId, int grantId)
        {
            var result = await _context.Database
                .SqlQueryRaw<BudgetSurplusAndBurnRateByAccountDto>(
                    "EXEC dbo.usp_GetBudgetSurplusBurnRateReportByAccount @initiativeId = {0}, @grantId = {1}",
                    initiativeId, grantId
                )
                .ToListAsync();


            return Result<List<BudgetSurplusAndBurnRateByAccountDto>>.Success(result);
        }
    }

}