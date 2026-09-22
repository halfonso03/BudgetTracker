using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.DTOs.Budgets;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class DisbService(AppDbContext _dbContext) : IDisbService
    {
        public async Task<List<TransactionResponseDto>> GetLineItemsForAccount(int initiativeId, int grantId, int accountId)
        {
            var query = await (from b in _dbContext.BudgetLineItems
                               join r in _dbContext.DisbLineItems on b.Id equals r.BudgetLineItemId
                               where b.InitiativeId == initiativeId && b.GrantId == grantId && b.AccountId == accountId
                               && b.ItemType == Globals.ITEM_TYPE_DISB
                               select TransactionResponseDto.Create(r.Id, b.ItemType, b.CreateDate, b.Amount))
                        .ToListAsync();

            return [.. query.OrderBy(x => x.PostedDate)];
        }
    }
}