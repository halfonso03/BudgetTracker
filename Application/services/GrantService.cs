using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Budgets;
using Application.DTOs.Common;
using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.services
{
    public class GrantService(AppDbContext _dbContext) : IGrantService
    {
        public async Task<List<GrantDto>> GetAllGrants()
        {
            var grants = await _dbContext.Grants.ToListAsync();

            return [.. grants.Select(x => CreateGrantDto(x))];
        }

        public async Task<List<GrantDto>> GetGrants(int year)
        {
            var grants = await _dbContext.Grants.Where(g => g.StartDate.Year == year).ToListAsync();

            return [.. grants.Select(x => CreateGrantDto(x))];
        }
        private static GrantDto CreateGrantDto(Grant grant)
        {
            return GrantDto.Create(grant.Id, grant.Name, grant.StartDate, grant.EndDate, grant.Fiduciary);
        }
    }
}