using Application.Core;
using Application.DTOs.Vendors;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class VendorService(AppDbContext dbContext)
    {
        public async Task<Result<List<VendorReponseDto>>> GetAllVendors()
        {
            var vendors = await dbContext.Vendors.OrderBy(x => x.Name).ToListAsync();
            var response = vendors.Select(x => VendorReponseDto.Create(x.Id, x.Name, x.AccountId, x.IsActive)).ToList();
            return Result<List<VendorReponseDto>>
                    .Success(response);
        }

        public async Task<Result<List<VendorReponseDto>>> GetVendorsForAccount(int accountId)
        {
            var vendors = await dbContext.Vendors.Where(x => x.AccountId == accountId).ToListAsync();
            var response = vendors.Select(x => VendorReponseDto.Create(x.Id, x.Name, x.AccountId, x.IsActive)).ToList();
            return Result<List<VendorReponseDto>>
                    .Success(response);
        }
    }
}