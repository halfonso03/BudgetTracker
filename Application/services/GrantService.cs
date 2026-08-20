using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Budgets;
using Application.DTOs.Common;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.services
{
    public class GrantService(AppDbContext _dbContext) : IGrantService
    {
        public async Task<List<GrantDto>> GetGrants(int year)
        {
            var grants = await _dbContext.Grants.Where(g => g.StartDate.Year == year).ToListAsync();

            return grants.Select(x => GrantDto.Create(x.Id, x.Name, x.StartDate, x.EndDate, x.Fiduciary)).ToList();
        }
    }
}