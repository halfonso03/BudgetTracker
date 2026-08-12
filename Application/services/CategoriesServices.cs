using Application.DTOs.Budgets;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class CategoriesService(AppDbContext _dbContext) : ICategoryService
    {
        public async Task<List<AccountDto>> GetAccountsForCategories(int categoryId)
        {
            return await _dbContext.Accounts
                    .AsNoTracking()
                    .Where(x => x.CategoryId == categoryId)
                    .Select(c => AccountDto.Create(
                        c.Id,
                        c.Name,
                        c.CategoryId,
                        c.Number
                    )) // 2. Projects directly to DTOs in SQL, fetching only required columns
                    .ToListAsync();
        }

        public async Task<List<CategoryDto>> GetCategoriesAndAccounts()
        {
            return await _dbContext.Categories
                    .AsNoTracking()
                    .Select(c => CategoryDto.Create(
                        c.Id,
                        c.Name,
                        c.Accounts.Select(a => AccountDto.Create(a.Id, a.Name, a.CategoryId, a.Number)).ToList()
                    )) // 2. Projects directly to DTOs in SQL, fetching only required columns
                    .ToListAsync();
        }
    }
}