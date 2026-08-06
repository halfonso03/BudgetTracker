using Application.DTOs.Budgets;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class CategoriesService(AppDbContext _dbContext) : ICategoryService
    {
        public async Task<List<CategoryDto>> GetCategoriesAndAccounts()
        {
            return await _dbContext.Categories
                    .AsNoTracking()
                    .Select(c => CategoryDto.Create(
                        c.Id,
                        c.Name,
                        c.Accounts.Select(a => AccountDto.Create(a.Id, a.Name, a.Number, a.CategoryId)).ToList()
                    )) // 2. Projects directly to DTOs in SQL, fetching only required columns
                    .ToListAsync();
        }
    }
}