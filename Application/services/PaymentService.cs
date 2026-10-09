using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Payment;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class PaymentService(AppDbContext _dbContext)
    {
        public async Task<Result<List<PaymentCategoryBalanceDto>>> GetAvailableBalancesForCategory(int initiativeId, int grantId, int categoryId)
        {
            var accounts = _dbContext.Accounts.AsNoTracking().Where(x => x.CategoryId == categoryId).Select(x => x).ToList();

            var initiative = await _dbContext.Initiatives.FirstAsync(x => x.Id == initiativeId);
            var grant = await _dbContext.Grants.FirstAsync(x => x.Id == grantId);
            var category = await _dbContext.Categories.FirstAsync(x => x.Id == categoryId);

            var lineItems = await (from b in _dbContext.BudgetLineItems
                                   join a in _dbContext.Accounts on b.AccountId equals a.Id
                                   where b.InitiativeId == initiativeId &&
                                       b.GrantId == grantId &&
                                       b.AccountId == a.Id &&
                                       a.CategoryId == categoryId
                                   group b by new { id = a.Id, name = a.Name, itemtype = b.ItemType, c_id = a.CategoryId } into catBal
                                   select new
                                   {
                                       accountId = catBal.Key.id,
                                       accountName = catBal.Key.name,
                                       categoryId = catBal.Key.c_id,
                                       catBal.Key.itemtype,
                                       amount = catBal.Sum(x => x.Amount)
                                   }
                    )
                   .ToListAsync();

            var currentAmounts = from l in lineItems
                                 group l by new { l.accountId, l.accountName } into catBal
                                 select new
                                 {
                                     catBal.Key,
                                     amount = catBal.Sum(x => x.amount)
                                 };

            var currentAmount_WithAccounts = from a in accounts
                                             join b in currentAmounts on a.Id equals b.Key.accountId into itemsGroup
                                             from subItems in itemsGroup.DefaultIfEmpty()
                                             orderby a.Name
                                             select new
                                             {
                                                 accountId = a.Id,
                                                 accountName = a.Name,
                                                 categoryId = a.CategoryId,
                                                 currentAmount = subItems != null ? subItems.amount : 0,
                                             };

            var remainingAmounts = from l in lineItems
                                   group l by new { l.accountId, l.accountName } into catBal
                                   select new
                                   {
                                       key = catBal.Key,
                                       amount = catBal.Sum(x => x.amount)
                                   };

            var query = from c in currentAmount_WithAccounts
                        join r in remainingAmounts on c.accountId equals r.key.accountId into itemsGroup
                        from subItems in itemsGroup.DefaultIfEmpty()
                        select new
                        {
                            c,
                            remainingAmount = subItems != null ? subItems.amount : 0,
                        };

            var result = (from q in query
                          select PaymentCategoryBalanceDto.Create(
                            initiativeId, grantId, q.c.accountId, q.c.categoryId, q.c.accountName, q.c.currentAmount,
                            initiative.Name, grant.Name, category.Name)
                        ).ToList();

            return Result<List<PaymentCategoryBalanceDto>>.Success(result);
        }
    }
}