using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Budgets;
using Application.DTOs.Disb;
using Application.Interfaces;
using Application.services;
using Azure.Core.GeoJson;
using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Persistence;

namespace Application.Services
{
    public class DisbService(AppDbContext _dbContext, IBudgetService _budgetService)
    {
        public async Task<Result<DisbResponseDto>> GetDisb(int id)
        {
            var reproFromDb = await _dbContext.Disbs
                                        .Include(x => x.CreatedBy)
                                        .Include(x => x.UpdatedBy)
                                        .Include(x => x.PostedBy)
                                        .FirstOrDefaultAsync(x => x.Id == id);

            if (reproFromDb is null)
            {
                return Result<DisbResponseDto>.Failure($"Reprogramming not found", 400);
            }

            try
            {
                var lineItems = await _dbContext.DisbLineItems
                                        .Include(x => x.UpdatedBy)
                                        .Include(x => x.Initiative)
                                        .Include(x => x.Grant)
                                        .Include(x => x.Category)
                                        .Include(x => x.Account)
                                        .Where(x => x.DisbId == id).ToListAsync();


                var keys = lineItems.Select(x => new { x.InitiativeId, x.GrantId, x.CategoryId }).Distinct();

                var rowBalances = new List<DisbBalanceResponseDto>();

                foreach (var key in keys)
                {
                    var balances = await _budgetService.GetBalancesForCategory(key.InitiativeId, key.GrantId, key.CategoryId);

                    rowBalances.Add(new DisbBalanceResponseDto()
                    {
                        Key = new()
                        {
                            InitiativeId = key.InitiativeId,
                            GrantId = key.GrantId,
                            CategoryId = key.CategoryId
                        },
                        Balances = [.. balances.Select(x => Balance.Create(x.AccountId, x.CurrentAmount, x.RemainingAmount, x.AccountName))]
                    });
                }


                var response = new DisbResponseDto
                {
                    RowBalances = rowBalances,
                    Id = reproFromDb.Id,
                    Year = lineItems.First().Year,
                    Justification = reproFromDb.Justification,
                    CreatedBy = reproFromDb.CreatedBy!.WindowsLogin,
                    CreateDate = reproFromDb.CreatedDate,
                    CreatedById = reproFromDb.CreatedById,
                    UpdateDate = reproFromDb.UpdateDate,
                    UpdatedById = reproFromDb.UpdatedById,
                    Posted = reproFromDb.Posted,
                    PostedBy = reproFromDb.PostedBy != null ? reproFromDb.PostedBy.WindowsLogin : "",
                    PostedDate = reproFromDb.PostedDate,
                    PostedById = reproFromDb.PostedById,
                    LineItems = [.. lineItems.Select(x =>
                        new DisbLineItemResponseDto
                        {
                            Comment = x.Comment,
                            RowId = x.RowId,
                            InitiativeId = x.InitiativeId,
                            GrantId = x.GrantId,
                            AccountId = x.AccountId,
                            CategoryId = x.CategoryId,
                            Amount = x.Amount,
                            PayeeName = x.Payee!.Name,
                            InitiativeName = x.Initiative!.Name,
                            GrantName = x.Grant!.Name,
                            CategoryName = x.Category!.Name,
                            AccountName = x.Account!.Name,
                            Year = x.Year,
                        })]
                };

                return Result<DisbResponseDto>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<DisbResponseDto>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
        }

        public async Task<Result<int>> CreateDisb(CreateDisbRequestDto disbRequestDto)
        {
            var newId = 0;

            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var grant = await _dbContext.Grants.FirstAsync(x => x.Id == disbRequestDto.LineItems.First().GrantId);

                var newDisb = new Disb()
                {
                    Id = 0,
                    Amount = disbRequestDto.LineItems.Sum(x => x.Amount),
                    CreatedById = disbRequestDto.CreatedById,
                    Year = grant.Year,
                    CreatedDate = DateTime.Now,
                    Justification = disbRequestDto.Justification,
                    Posted = disbRequestDto.Posted,
                    PostedById = disbRequestDto.Posted ? disbRequestDto.CreatedById : null,
                    PostedDate = disbRequestDto.Posted ? DateTime.Now : null,
                    Items = [.. disbRequestDto.LineItems.Select(x => new DisbLineItem
                    {
                        DisbId = 0,
                        EntryDate = DateTime.Now,
                        InitiativeId = x.InitiativeId,
                        GrantId = x.GrantId,
                        AccountId = x.AccountId,
                        Amount = x.Amount,
                        CategoryId = x.CategoryId,
                        RowId = x.RowId,
                        Year = grant.Year,
                        Comment = x.Comment,
                        BudgetLineItemId = null,
                        PayeeId = x.PayeeId
                    })]
                };

                _dbContext.Disbs.Add(newDisb);

                await _dbContext.SaveChangesAsync();

                if (newDisb.Posted)
                {
                    await PostDisb(newDisb.Items, newDisb.Id, disbRequestDto.CreatedById);
                }

                newId = newDisb.Id;

                await transaction.CommitAsync();
            }
            catch (DbException ex)
            {
                await transaction.RollbackAsync();
                return Result<int>.Failure($"DB Error: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<int>.Failure($"Error: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }

            return Result<int>.Success(newId);
        }

        public async Task<Result<Unit>> UpdateDisb(UpdateDisbRequestDto disbRequestDto)
        {
            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var disbFromDb = await _dbContext.Disbs.FirstOrDefaultAsync(x => x.Id == disbRequestDto.Id);

                if (disbFromDb is null)
                {
                    return Result<Unit>.Failure($"Disb not found", 400);
                }

                if (disbRequestDto.Posted && disbFromDb.Posted)
                {
                    throw new Exception($"Disb has already been posted");
                }

                decimal? totalRequested = await ValidateLineItems(disbRequestDto.LineItems);

                if (totalRequested is not null)
                {
                    throw new Exception($"Total amount requested ${totalRequested} exceeds the amount available for this initiative/grant/account.");
                }


                var grant = await _dbContext.Grants.FirstAsync(x => x.Id == disbRequestDto.LineItems.First().GrantId);

                disbFromDb.Amount = disbRequestDto.LineItems.Sum(x => x.Amount);
                disbFromDb.Justification = disbRequestDto.Justification;
                disbFromDb.UpdateDate = DateTime.Now;
                disbFromDb.UpdatedById = disbRequestDto.UpdatedById;

                if (disbRequestDto.Posted && disbFromDb.Posted == false)
                {
                    disbFromDb.PostedById = disbRequestDto.UpdatedById;
                    disbFromDb.PostedDate = DateTime.Now;
                }

                // unposting, only for testing purposes
                if (!disbRequestDto.Posted && disbFromDb.Posted)
                {
                    disbFromDb.PostedById = null;
                    disbFromDb.PostedDate = null;
                }

                disbFromDb.Posted = disbRequestDto.Posted;

                var lineItemsFromDb = await _dbContext.DisbLineItems.Where(x => x.DisbId == disbRequestDto.Id).ToListAsync();

                var db_count = lineItemsFromDb.Count;
                var dto_count = disbRequestDto.LineItems.Count;

                foreach (var req in disbRequestDto.LineItems)
                {
                    //  update existing records
                    if (lineItemsFromDb.Any(x => x.RowId == req.RowId))
                    {
                        var lineFromDb = lineItemsFromDb.First(x => x.RowId == req.RowId);

                        if (lineFromDb.Amount != req.Amount ||
                            lineFromDb.InitiativeId != req.InitiativeId ||
                            lineFromDb.GrantId != req.GrantId ||
                            lineFromDb.AccountId != req.AccountId ||
                            lineFromDb.PayeeId != req.PayeeId ||
                            lineFromDb.Comment != req.Comment)
                        {
                            lineFromDb.UpdateDate = DateTime.Now;
                            lineFromDb.UpdatedById = disbRequestDto.UpdatedById;
                            lineFromDb.Amount = req.Amount;
                            lineFromDb.InitiativeId = req.InitiativeId;
                            lineFromDb.GrantId = req.GrantId;
                            lineFromDb.AccountId = req.AccountId;
                            lineFromDb.CategoryId = req.CategoryId;
                            lineFromDb.PayeeId = req.PayeeId;
                            lineFromDb.Comment = string.IsNullOrEmpty(req.Comment) ? null
                            : req.Comment.Trim();
                        }
                    }
                    else
                    {
                        // add new records
                        var newLineItem = new DisbLineItem
                        {
                            Id = 0,
                            RowId = req.RowId,
                            DisbId = disbRequestDto.Id,
                            InitiativeId = req.InitiativeId,
                            GrantId = req.GrantId,
                            AccountId = req.AccountId,
                            PayeeId = req.PayeeId,
                            Amount = req.Amount,
                            Year = grant.Year,
                            EntryDate = DateTime.Now,
                            CategoryId = req.CategoryId,
                            Comment = string.IsNullOrEmpty(req.Comment) ? null
                            : req.Comment.Trim()
                        };

                        _dbContext.DisbLineItems.Add(newLineItem);
                    }
                }

                if (disbFromDb.Items.Count > disbRequestDto.LineItems.Count)
                {
                    var deleted = disbFromDb.Items.Skip(disbRequestDto.LineItems.Count).Take(1000);

                    foreach (var d in deleted)
                    {
                        _dbContext.DisbLineItems.Remove(d);
                    }
                }


                if (disbRequestDto.Posted)
                {
                    var disbLineItems =
                        disbRequestDto.LineItems.Select(x => new DisbLineItem
                        {
                            RowId = x.RowId,
                            DisbId = disbRequestDto.Id,
                            Year = grant.Year,
                            InitiativeId = x.InitiativeId,
                            GrantId = x.GrantId,
                            AccountId = x.AccountId,
                            CategoryId = x.CategoryId,
                            PayeeId = x.PayeeId,
                            Amount = x.Amount,
                            EntryDate = DateTime.Now,

                        })
                        .ToList();

                    await PostDisb(disbLineItems, disbRequestDto.Id, disbRequestDto.UpdatedById);
                }


                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbException ex)
            {
                await transaction.RollbackAsync();
                return Result<Unit>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<Unit>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }

            return Result<Unit>.Success(Unit.Value);
        }

        private async Task<decimal?> ValidateLineItems(List<DisbRequestLineItemDto> lineItems)
        {
            var requested = from x in lineItems
                            group x by new { x.InitiativeId, x.GrantId, x.AccountId } into grp
                            select new
                            {
                                grp.Key.InitiativeId,
                                grp.Key.GrantId,
                                grp.Key.AccountId,
                                totalRequested = Convert.ToDecimal(grp.Sum(x => x.Amount))
                            };


            foreach (var item in requested)
            {
                var available = await _dbContext.BudgetLineItems
                                        .Where(x => x.InitiativeId == item.InitiativeId &&
                                           x.GrantId == item.GrantId &&
                                           x.AccountId == item.AccountId)
                                        .SumAsync(x => x.Amount);

                if (item.totalRequested > available)
                {
                    return item.totalRequested;
                }
            }

            return null;
        }

        private async Task<bool> PostDisb(IList<DisbLineItem> items, int disbId, int userId)
        {

            var postedBudgetLineItems = new List<BudgetLineItem>();

            foreach (var line in items)
            {
                // check if there is more than the reduction amount
                if (line.Amount < 0)
                {
                    var availableForAccount = _dbContext.BudgetLineItems
                                                   .Where(x => x.InitiativeId == line.InitiativeId
                                                        && x.GrantId == line.GrantId
                                                        && x.AccountId == line.AccountId)
                                                    .Sum(x => x.Amount);

                    if (availableForAccount - Math.Abs(line.Amount) < 0)
                    {
                        throw new Exception("Account being reduced by more that is available.");
                    }
                }

                var budgetLineItem = new BudgetLineItem
                {
                    Id = 0,
                    InitiativeId = line.InitiativeId,
                    GrantId = line.GrantId,
                    AccountId = line.AccountId,
                    Amount = line.Amount,
                    ItemType = Globals.ITEM_TYPE_DISB,
                    CreateDate = DateTime.Now,
                    CreatedBy = userId,
                    Year = line.Year,
                    AdditionalInformation = $"Payment to Payee Id {line.PayeeId}"
                };

                postedBudgetLineItems.Add(budgetLineItem);

                _dbContext.BudgetLineItems.Add(budgetLineItem);
            }

            await _dbContext.SaveChangesAsync();



            var disbLines = await _dbContext.DisbLineItems.Where(x => x.DisbId == disbId).Select(x => x).ToListAsync();

            var counter = 0;

            foreach (var item in postedBudgetLineItems.OrderBy(x => x.Id))
            {
                disbLines[counter].BudgetLineItemId = item.Id;
                counter += 1;
            }

            await _dbContext.SaveChangesAsync();


            var checkDisbLines = await _dbContext.DisbLineItems.Where(x => x.DisbId == disbId).Select(x => x).ToListAsync();

            foreach (var line in checkDisbLines)
            {
                if (line.BudgetLineItemId is null)
                {
                    throw new Exception("One or more posted disb lines was not updated with the new budget line item id.");
                }
            }

            return true;
        }

        public async Task<Result<DisbResponseDto>> DuplicateRepro(int id, int userId)
        {
            var repro = await _dbContext.Disbs.FirstOrDefaultAsync(x => x.Id == id);

            if (repro == null) return Result<DisbResponseDto>.Failure("", 404);

            var disbLineItems = await _dbContext.DisbLineItems
                                                .Include(x => x.Initiative)
                                                .Include(x => x.Grant)
                                                .Include(x => x.Account)
                                                .Include(x => x.Category)
                                                .Include(x => x.Payee)
                                                .Where(x => x.DisbId == id)
                                                .ToListAsync();
            try
            {
                var grant = await _dbContext.Grants.FirstAsync(x => x.Id == disbLineItems.First().GrantId);
                var loginid = await _dbContext.AuthorizedUsers.FirstAsync(x => x.Id == userId);

                var newDisb = new Disb()
                {
                    Id = 0,
                    Amount = Convert.ToDecimal(disbLineItems.Sum(x => x.Amount)),
                    CreatedById = userId,
                    Year = grant.Year,
                    CreatedDate = DateTime.Now,
                    Justification = repro.Justification,
                    Posted = false,
                    Items = [.. disbLineItems.Select(x => new DisbLineItem
                    {
                        DisbId = 0,
                        EntryDate = DateTime.Now,
                        InitiativeId = x.InitiativeId,
                        GrantId = x.GrantId,
                        AccountId = x.AccountId,
                        Amount = x.Amount,
                        CategoryId = x.CategoryId,
                        RowId = x.RowId,
                        Year = grant.Year,
                        PayeeId = x.PayeeId,
                        Comment = x.Comment,
                        BudgetLineItemId = null
                    })]
                };

                _dbContext.Disbs.Add(newDisb);

                await _dbContext.SaveChangesAsync();

                var keys = disbLineItems.Select(x => new { x.InitiativeId, x.GrantId, x.CategoryId }).Distinct();

                var rowBalances = new List<DisbBalanceResponseDto>();

                foreach (var key in keys)
                {
                    var balances = await _budgetService.GetBalancesForCategory(key.InitiativeId, key.GrantId, key.CategoryId);

                    rowBalances.Add(new DisbBalanceResponseDto()
                    {
                        Key = new()
                        {
                            InitiativeId = key.InitiativeId,
                            GrantId = key.GrantId,
                            CategoryId = key.CategoryId
                        },
                        Balances = [.. balances.Select(x => Balance.Create(x.AccountId, x.CurrentAmount, x.RemainingAmount, x.AccountName))]
                    });
                }

                var response = new DisbResponseDto
                {
                    Id = newDisb.Id,
                    Justification = newDisb.Justification,
                    CreateDate = newDisb.CreatedDate,
                    CreatedById = newDisb.CreatedById,
                    CreatedBy = loginid.WindowsLogin,
                    Year = newDisb.Year,
                    Posted = false,
                    RowBalances = rowBalances,
                    LineItems = [.. disbLineItems.Select(x => new DisbLineItemResponseDto
                    {
                        RowId = x.RowId,
                        Year = x.Year,
                        InitiativeId = x.InitiativeId,
                        GrantId = x.GrantId,
                        AccountId = x.AccountId,
                        CategoryId = x.CategoryId,
                        Amount = x.Amount,
                        InitiativeName = x.Initiative!.Name,
                        GrantName = x.Grant!.Name,
                        AccountName = x.Account!.Name,
                        CategoryName = x.Category!.Name,
                        PayeeName = x.Payee!.Name,
                        Comment = x.Comment
                    })]
                };

                return Result<DisbResponseDto>.Success(response);

            }
            catch (DbException ex)
            {
                return Result<DisbResponseDto>.Failure($"DB Error: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 500);
            }
            catch (Exception ex)
            {
                return Result<DisbResponseDto>.Failure(ex.Message, 500);
            }
        }

        // public async Task<List<TransactionResponseDto>> GetLineItemsForAccount(int initiativeId, int grantId, int accountId)
        // {
        //     var query = await (from b in _dbContext.BudgetLineItems
        //                        join r in _dbContext.DisbLineItems on b.Id equals r.BudgetLineItemId
        //                        where b.InitiativeId == initiativeId && b.GrantId == grantId && b.AccountId == accountId
        //                        && b.ItemType == Globals.ITEM_TYPE_DISB
        //                        select TransactionResponseDto.Create(r.Id, b.ItemType, b.CreateDate, b.Amount))
        //                 .ToListAsync();

        //     return [.. query.OrderBy(x => x.PostedDate)];
        // }
    }
}