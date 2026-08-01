using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Application.Budgets.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class BudgetController(AppDbContext _dbContext) : BaseApiController
    {

        [HttpGet("GetBudgetSummary")]
        public async Task<IActionResult> GetBudgetSummary(int year)
        {

            var items = (from b in _dbContext.BudgetLineItems.Include(x => x.Account)
                         join g in _dbContext.Grants on b.GrantId equals g.Id
                         join i in _dbContext.Initiatives on b.InitiativeId equals i.Id
                         join a in _dbContext.Accounts.Include(x => x.Category) on b.AccountId equals a.Id
                         where g.StartDate.Year == year
                         select new { b.ItemType, b.Amount, fiduciary = g.Fiduciary, g.StartDate, g.EndDate, b.AccountId, b.InitiativeId, b.GrantId, grant_name = g.Name, account_name = a.Name, year = g.Year, initiative_name = i.Name })
                        .ToList();


            var budget = (from b in items
                          group b by new
                          {
                              initiativeId = b.InitiativeId,
                              b.initiative_name,
                              grant_id = b.GrantId,
                              b.grant_name,
                              start_date = b.StartDate,
                              end_date = b.EndDate,
                              b.fiduciary,
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
                                       Name = x.account_name
                                   })
                                 .ToList()
                          });

            return Ok(budget);
        }

    }
}