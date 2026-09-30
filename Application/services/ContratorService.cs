using Application.Core;
using Application.DTOs.Vendors;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class ContratorService(AppDbContext dbContext)
    {
        public async Task<Result<List<ContratorReponseDto>>> GetAllVendors()
        {
            var vendors = await dbContext.Contrators.OrderBy(x => x.LastName).ThenBy(x => x.FirstName).ToListAsync();
            var response = vendors.Select(x => ContratorReponseDto.Create(x.Id, x.FirstName, x.LastName, x.Email, x.AccountId, x.IsActive)).ToList();
            return Result<List<ContratorReponseDto>>
                    .Success(response);
        }

        public async Task<Result<List<ContratorReponseDto>>> GetVendorsForAccount(int accountId)
        {
            var vendors = await dbContext.Contrators.Where(x => x.AccountId == accountId).OrderBy(x => x.LastName).ThenBy(x => x.FirstName).ToListAsync();
            var response = vendors.Select(x => ContratorReponseDto.Create(x.Id, x.FirstName, x.LastName, x.Email, x.AccountId, x.IsActive)).ToList();
            return Result<List<ContratorReponseDto>>
                    .Success(response);
        }
    }
}