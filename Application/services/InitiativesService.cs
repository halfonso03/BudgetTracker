using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Budgets.DTOs;
using Application.interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.services
{
    public class InitiativesService(AppDbContext _dbContext) : IInitiativeService
    {
        public async Task<List<InitiativeDto>> GetInitiatives()
        {
            var initiatives = await _dbContext.Initiatives.OrderBy(x => x.Name).ToListAsync();

            return initiatives.Select(x => InitiativeDto.Create(x.Id, x.Name)).ToList();
        }
    }
}