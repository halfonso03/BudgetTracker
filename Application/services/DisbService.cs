using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Budgets;
using Application.DTOs.Disb;
using Application.Interfaces;
using Azure.Core.GeoJson;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class DisbService(AppDbContext _dbContext)
    {
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
                    Year = line.Year
                };

                postedBudgetLineItems.Add(budgetLineItem);

                _dbContext.BudgetLineItems.Add(budgetLineItem);
            }

            await _dbContext.SaveChangesAsync();

            foreach (var item in postedBudgetLineItems)
            {
                var disbLine = _dbContext.DisbLineItems.Single(x => x.DisbId == disbId
                                        && x.InitiativeId == item.InitiativeId
                                        && x.GrantId == item.GrantId
                                        && x.AccountId == item.AccountId);

                disbLine.BudgetLineItemId = item.Id;
            }

            await _dbContext.SaveChangesAsync();

            var checkDisbLines = _dbContext.DisbLineItems.Where(x => x.DisbId == disbId);

            foreach (var line in checkDisbLines)
            {
                if (line.BudgetLineItemId is null)
                {
                    throw new Exception("One or more posted disb lines was not updated with the new budget line item id.");
                }
            }

            return true;
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