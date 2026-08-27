using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Budgets;
using Application.DTOs.Common;
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
                            BudgetLineItemResponseDto.Create
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

            var comments = await _dbContext.BudgetComments
                .Include(x => x.EntryPerson)
                .Where(x => x.InitiativeId == initiativeId && x.GrantId == grantId)
                .ToListAsync();

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
                                     grp.Select(x => new BudgetLineItemResponseDto
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

        private List<AccountBalancesDto> CreatePivotedBalances(List<BudgetLineItemResponseDto> items, List<BudgetComment>? comments = null)
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
                                 HasRepro = items.Any(x => x.ItemType == "R" && x.AccountId == a.Id),
                                 Category = CategoryDto.CreateFromDomain(_accounts.First(x => x.CategoryId == a.CategoryId).Category),
                                 Comment = CreateCommentDto(a.Id, comments)
                             }).ToList();

            return baseItems;
        }

        public static CommentDto? CreateCommentDto(int accountId, List<BudgetComment>? comments = null)
        {
            var comment = comments?.FirstOrDefault(x => x.AccountId == accountId);
            if (comment is not null)
            {
                return CommentDto.Create(
                    comment.Id,
                    comment.Text,
                    comment.EntryDate,
                    comment.EntryPerson?.Id.ToString() ?? "",
                    comment.UpdateDate,
                    comment.UpdatePerson?.Id.ToString() ?? null);
            }
            return null;
        }

        public async Task<Result<Unit>> CreateBudget(CreateBudgetRequestDto createBudgetDto)
        {
            var initiativeId = createBudgetDto.LineItems.First().InitiativeId;
            var grantId = createBudgetDto.LineItems.First().GrantId;

            // check if budget records already exist for the initiative and grant
            if (_dbContext.BudgetLineItems.Any(x =>
                x.InitiativeId == initiativeId &&
                x.GrantId == grantId &&
                x.ItemType == "B"))
            {
                return Result<Unit>.Failure("A budget for the initiative and grant already exists", 400);
            }

            try
            {
                _dbContext.BudgetLineItems.AddRange(createBudgetDto.LineItems.Select(x => new BudgetLineItem
                {
                    Id = 0,
                    InitiativeId = x.InitiativeId,
                    GrantId = x.GrantId,
                    AccountId = x.AccountId,
                    Amount = x.Amount,
                    ItemType = "B",
                    CreateDate = DateTime.Now,
                    CreatedBy = createBudgetDto.CreatedBy
                }));

                _dbContext.BudgetComments.AddRange(createBudgetDto.Comments
                    .Where(x => !string.IsNullOrEmpty(x.Text))
                    .Select(x => new BudgetComment
                    {
                        Id = 0,
                        AccountId = x.AccountId,
                        InitiativeId = initiativeId,
                        GrantId = grantId,
                        Text = x.Text,
                        EntryDate = DateTime.Now,
                        EntryPersonId = createBudgetDto.CreatedBy
                    }));

                await _dbContext.SaveChangesAsync();
            }
            catch (DbException ex)
            {
                return Result<Unit>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
            catch (Exception ex)
            {
                return Result<Unit>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }

            return Result<Unit>.Success(Unit.Value);
        }

        public async Task<Result<Unit>> UpdateBudget(UpdateBudgetRequestDto updateBudgetDto)
        {
            try
            {
                var initiativeId = updateBudgetDto.InitiativeId;
                var grantId = updateBudgetDto.GrantId;

                if (!await _dbContext.BudgetLineItems.AnyAsync(x => x.InitiativeId == initiativeId && x.GrantId == grantId))
                {
                    return Result<Unit>.Failure("Budget does not exist.", 400);
                }

                var lineItemsFromDb = await _dbContext.BudgetLineItems.Where(x => x.InitiativeId == initiativeId &&
                    x.GrantId == grantId &&
                    x.ItemType == "B")
                    .ToListAsync();

                // zero out records from db that are not present in the LineItems list
                var deletedAccounts = from db in lineItemsFromDb
                                      join req in updateBudgetDto.LineItems
                                      on db.AccountId equals req.AccountId into itemsGroup
                                      from subItems in itemsGroup.DefaultIfEmpty()
                                      where subItems is null
                                      select db.AccountId;

                foreach (var accountId in deletedAccounts)
                {
                    var itemFromDb = lineItemsFromDb.First(x => x.AccountId == accountId);
                    itemFromDb.Amount = 0;
                    itemFromDb.UpdateDate = DateTime.Now;
                    itemFromDb.UpdatedBy = updateBudgetDto.UpdatedBy;
                }

                foreach (var u in updateBudgetDto.LineItems)
                {
                    //  update existing records
                    if (lineItemsFromDb.Any(x => x.AccountId == u.AccountId))
                    {
                        if (lineItemsFromDb.First(x => x.AccountId == u.AccountId).Amount != u.Amount)
                        {
                            var accountFromDb = lineItemsFromDb.First(x => x.AccountId == u.AccountId);
                            accountFromDb.Amount = u.Amount;
                            accountFromDb.UpdateDate = DateTime.Now;
                            accountFromDb.UpdatedBy = updateBudgetDto.UpdatedBy;
                        }
                    }
                    else
                    {
                        // add new records
                        var newLineItem = new BudgetLineItem
                        {
                            Id = 0,
                            InitiativeId = u.InitiativeId,
                            GrantId = u.GrantId,
                            AccountId = u.AccountId,
                            Amount = u.Amount,
                            ItemType = "B",
                            CreateDate = DateTime.Now,
                            CreatedBy = updateBudgetDto.UpdatedBy
                        };

                        _dbContext.BudgetLineItems.Add(newLineItem);
                    }
                }

                await _dbContext.SaveChangesAsync();
            }
            catch (DbException ex)
            {
                return Result<Unit>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
            catch (Exception ex)
            {
                return Result<Unit>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }

            return Result<Unit>.Success(Unit.Value);
        }

        public async Task<List<AccountCurrentAmountDto>> GetAccountBalancesForCategory(int initiativeId, int grantId, int categoryId)
        {
            var acounts = _dbContext.Accounts.AsNoTracking().Where(x => x.CategoryId == categoryId).Select(x => x).ToList();

            var initiative = await _dbContext.Initiatives.FirstAsync(x => x.Id == initiativeId);
            var grant = await _dbContext.Grants.FirstAsync(x => x.Id == grantId);
            var category = await _dbContext.Categories.FirstAsync(x => x.Id == categoryId);


            var balances = await (from b in _dbContext.BudgetLineItems
                                  join a in _dbContext.Accounts on b.AccountId equals a.Id
                                  where b.InitiativeId == initiativeId &&
                                      b.GrantId == grantId &&
                                      b.AccountId == a.Id &&
                                      a.CategoryId == categoryId &&
                                      (b.ItemType == "B" || b.ItemType == "R")
                                  group b by new { id = a.Id, name = a.Name } into catBal
                                  orderby catBal.Key.name
                                  select
                                      AccountCurrentAmountDto.Create(initiativeId, grantId,
                                           catBal.Key.id, catBal.Key.name, catBal.Sum(x => x.Amount))
                            )
                           .ToListAsync();

            balances = [.. from a in acounts join
                        b in balances on a.Id equals b.AccountId into itemsGroup
                        from subItems in itemsGroup.DefaultIfEmpty()
                        orderby a.Name
                        select AccountCurrentAmountDto.Create(initiativeId,
                                    grantId,
                                    a.Id,
                                    a.Name,
                                    subItems != null ? subItems.CurrentAmount : 0,
                                    initiative.Name,
                                    grant.Name,
                                    category.Name)
                        ];

            return balances;
        }

        public async Task<List<TransactionResponseDto>> GetLineItemsForAccount(int initiativeId, int grantId, int accountId)
        {
            var lineItems = await _dbContext.BudgetLineItems
                .Where(x => x.InitiativeId == initiativeId && x.GrantId == grantId && x.AccountId == accountId)
                .Select(x => TransactionResponseDto.Create(x.Id, x.ItemType, x.CreateDate, x.Amount))
                .ToListAsync();
                
            return lineItems;
        }
    }
}