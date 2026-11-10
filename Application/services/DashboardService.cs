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
        public async Task<Result<List<BudgetSurplusBurnRateDto>>> GetBudgetSurplusBurnRateReportAsync(int hidtaId, int year)
        {
            // Define SQL parameters safely to protect against SQL Injection
            var parameters = new[]
            {
                new SqlParameter("@hidtaid", hidtaId),
                new SqlParameter("@year", year)
            };

            // Call the stored procedure and map the output to your DTO
            // Note: Ensure BudgetSurplusBurnRateDto is registered in your DbContext as a Keyless Entity Type (.HasNoKey())
            // var result = await _context.Set<BudgetSurplusBurnRateDto>()
            //     .FromSqlRaw("EXEC dbo.usp_GetBudgetSurplusBurnRateReport @hidtaid = @hidtaid, @year = @year", parameters)
            //     .ToListAsync();

            var result = await _context.Database
                .SqlQueryRaw<BudgetSurplusBurnRateDto>(
                    "EXEC dbo.usp_GetBudgetSurplusBurnRateReport @hidtaid = {0}, @year = {1}",
                    hidtaId,year
                )
                .ToListAsync(); 


            return Result<List<BudgetSurplusBurnRateDto>>.Success(result);
        }
    }

}