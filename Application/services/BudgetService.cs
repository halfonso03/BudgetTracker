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
    public class BudgetService(AppDbContext _dbContext) : IBudgetService
    {

        public IQueryable<BudgetDto> BudgetQueryBase()
        {
            var summaries = from b in _dbContext.BudgetLineItems.Include(x => x.Account)
                            join g in _dbContext.Grants on b.GrantId equals g.Id
                            join i in _dbContext.Initiatives on b.InitiativeId equals i.Id
                            join a in _dbContext.Accounts.Include(x => x.Category) on b.AccountId equals a.Id
                            let summary = new
                            {
                                b.ItemType,
                                b.Amount,
                                fiduciary = g.Fiduciary,
                                g.StartDate,
                                g.EndDate,
                                b.AccountId,
                                b.InitiativeId,
                                b.GrantId,
                                grant_name = g.Name,
                                account = a,
                                year = g.Year,
                                initiative_name = i.Name
                            }
                            group b by new
                            {
                                initiativeId = b.InitiativeId,
                                summary.initiative_name,
                                grant_id = b.GrantId,
                                summary.grant_name,
                                start_date = summary.StartDate,
                                end_date = summary.EndDate,
                                summary.fiduciary,
                            } into grp
                            select new BudgetDto
                            {
                                Grant = GrantDto.Create(grp.Key.grant_id, grp.Key.grant_name, grp.Key.start_date, grp.Key.end_date, grp.Key.fiduciary),
                                Initiative = InitiativeDto.Create(grp.Key.initiativeId, grp.Key.initiative_name),
                                InitiativeId = grp.Key.initiativeId,
                                GrantId = grp.Key.grant_id,
                                Items =
                                     grp.Select(x => new BudgetLineItemDto
                                     {
                                         Amount = x.Amount,
                                         AccountId = x.AccountId,
                                         Comment = "comment",
                                         ItemType = x.ItemType,
                                         Name = x.Account!.Name,
                                         CategoryId = x.Account.CategoryId,
                                         Category = CategoryDto.Create(x.Account.Category!.Id, x.Account.Category.Name)
                                     })
                            };

            return summaries;
        }

        public async Task<BudgetDto> GetBudget(int initiativeId, int grantId)
        {

            var budgetBase = BudgetQueryBase();

            var result = await (from b in budgetBase
                                where b.InitiativeId == initiativeId && b.GrantId == grantId
                                select b).ToListAsync();

            return result.First();

        }
        
        public async Task<List<BudgetDto>> GetBudgets(int year, int initiativeId = 0)
        {
            var summaries = from b in _dbContext.BudgetLineItems.Include(x => x.Account)
                            join g in _dbContext.Grants on b.GrantId equals g.Id
                            join i in _dbContext.Initiatives on b.InitiativeId equals i.Id
                            join a in _dbContext.Accounts.Include(x => x.Category) on b.AccountId equals a.Id
                            where g.StartDate.Year == year && i.Id == (initiativeId == 0 ? i.Id : initiativeId)
                            let summary = new
                            {
                                b.ItemType,
                                b.Amount,
                                fiduciary = g.Fiduciary,
                                g.StartDate,
                                g.EndDate,
                                b.AccountId,
                                b.InitiativeId,
                                b.GrantId,
                                grant_name = g.Name,
                                account = a,
                                year = g.Year,
                                initiative_name = i.Name
                            }
                            group b by new
                            {
                                initiativeId = b.InitiativeId,
                                summary.initiative_name,
                                grant_id = b.GrantId,
                                summary.grant_name,
                                start_date = summary.StartDate,
                                end_date = summary.EndDate,
                                summary.fiduciary,
                            } into grp
                            select new BudgetDto
                            {
                                Grant = GrantDto.Create(grp.Key.grant_id, grp.Key.grant_name, grp.Key.start_date, grp.Key.end_date, grp.Key.fiduciary),
                                Initiative = InitiativeDto.Create(grp.Key.initiativeId, grp.Key.initiative_name),
                                InitiativeId = grp.Key.initiativeId,
                                GrantId = grp.Key.grant_id,
                                Items =
                                     grp.Select(x => new BudgetLineItemDto
                                     {
                                         Amount = x.Amount,
                                         AccountId = x.AccountId,
                                         Comment = "comment",
                                         ItemType = x.ItemType,
                                         Name = x.Account!.Name,
                                         Category = CategoryDto.Create(x.Account.Category!.Id, x.Account.Category.Name),
                                         CategoryId = x.Account.CategoryId
                                     }).ToList()
                            };

            List<BudgetDto> t = await summaries.ToListAsync();

            return t;
        }
    }
}