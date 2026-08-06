using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.DTOs.Budgets;
using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.services
{
    public class BudgetService(AppDbContext _dbContext) : IBudgetService
    {
        private List<Account>? _accounts;

        public async Task<BudgetDto> GetBudget(int initiativeId, int grantId)
        {
            var budgetLineItemsFromDb = await _dbContext
                        .BudgetLineItems
                            .Include(x => x.Initiative)
                            .Include(x => x.Grant)
                            .Include(x => x.Account)
                            .ThenInclude(y => y!.Category!)
                        .Where(x => x.InitiativeId == initiativeId
                            && x.GrantId == grantId)
                        .ToListAsync();

            var lineItems = budgetLineItemsFromDb
                        .Select(x =>
                            BudgetLineItemDto.Create
                                (x.GrantId,
                                x.InitiativeId,
                                x.AccountId,
                                x.Account!.Name,
                                x.Amount,
                                x.Account!.Category!.Id,
                                x.ItemType,
                                x.Account.Number,
                                "",
                                CategoryDto.Create(x.Account.CategoryId, x.Account.Category.Name)))
                    .ToList();


            var i = budgetLineItemsFromDb.First().Initiative!;
            var g = budgetLineItemsFromDb.First().Grant!;

            var comments = await _dbContext.BudgetComments.Where(x => x.InitiativeId == initiativeId && x.GrantId == grantId).ToListAsync();

            var result = new BudgetDto
            {
                Grant = GrantDto.Create(g.Id, g.Name, g.StartDate, g.EndDate, g.Fiduciary),
                Initiative = InitiativeDto.Create(i.Id, i.Name),
                InitiativeId = i.Id,
                GrantId = g.Id,
                Year = g.Year,
                AccountBalances = CreatePivotedBalances(lineItems, comments)
            };

            return result;
        }

        public async Task<List<BudgetDto>> GetBudgetsForYear(int year)
        {
            var budgetBase = (from b in _dbContext.BudgetLineItems
                              join g in _dbContext.Grants on b.GrantId equals g.Id
                              join i in _dbContext.Initiatives on b.InitiativeId equals i.Id
                              join a in _dbContext.Accounts.Include(x => x.Category) on b.AccountId equals a.Id
                              group b by new
                              {
                                  b.InitiativeId,
                                  initiative_name = i.Name,
                                  b.GrantId,
                                  grant_name = g.Name,
                                  g.StartDate,
                                  g.EndDate,
                                  g.Fiduciary,
                                  g.StartDate.Year
                              } into grp
                              where grp.Key.StartDate.Year == year
                              select new
                              {
                                  Grant = GrantDto.Create(grp.Key.GrantId, grp.Key.grant_name, grp.Key.StartDate, grp.Key.EndDate, grp.Key.Fiduciary),
                                  Initiative = InitiativeDto.Create(grp.Key.InitiativeId, grp.Key.initiative_name),
                                  grp.Key.InitiativeId,
                                  grp.Key.GrantId,
                                  grp.Key.Year,
                                  LineItems =
                                     grp.Select(x => new BudgetLineItemDto
                                     {
                                         InitiativeId = grp.Key.InitiativeId,
                                         GrantId = grp.Key.GrantId,
                                         Amount = x.Amount,
                                         AccountId = x.AccountId,
                                         ItemType = x.ItemType,
                                         Name = x.Account!.Name,
                                         Category = CategoryDto.Create(x.Account.Category!.Id, x.Account.Category.Name),
                                         CategoryId = x.Account.CategoryId
                                     }).ToList()
                              }).ToList();


            var result = from a in budgetBase
                         select new BudgetDto
                         {
                             GrantId = a.GrantId,
                             Grant = a.Grant,
                             InitiativeId = a.InitiativeId,
                             Initiative = a.Initiative,
                             Year = a.Year,
                             AccountBalances = CreatePivotedBalances([.. a.LineItems])
                         };

            return [.. result];
        }

        private List<AccountBalancesDto> CreatePivotedBalances(List<BudgetLineItemDto> items, List<BudgetComment>? comments = null)
        {
            _accounts ??= [.. _dbContext.Accounts.Include(x => x.Category)];

            var baseItems = (from a in _accounts
                             select new AccountBalancesDto
                             {
                                 AccountId = a.Id,
                                 Name = a.Name,
                                 AccountNumber = a.Number,
                                 CategoryId = a.CategoryId,
                                 Amount = items.Where(x => x.ItemType == "B" && x.AccountId == a.Id).Sum(x => x.Amount),
                                 SpentAmount = items.Where(x => x.ItemType == "D" && x.AccountId == a.Id).Sum(x => x.Amount),
                                 CurrentAmount = items.Where(x => (x.ItemType == "R" || x.ItemType == "B") && x.AccountId == a.Id).Sum(x => x.Amount),
                                 Category = CategoryDto.CreateFromDomain(_accounts.First(x => x.CategoryId == a.CategoryId).Category),
                                 CommentCount = comments != null ? comments.Count(x => x.AccountId == a.Id) : 0
                             }).ToList();


            return baseItems;
        }
    }
}