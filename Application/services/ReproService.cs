using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Repro;
using Application.Interfaces;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class ReproService(AppDbContext _dbContext, IBudgetService _budgetService) : IReproService
    {
        public async Task<Result<ReproResponseDto>> GetRepro(int id)
        {
            var reproFromDb = await _dbContext.Repros
                                        .Include(x => x.CreatedBy)
                                        .Include(x => x.UpdatedBy)
                                        .Include(x => x.PostedBy)
                                        .FirstOrDefaultAsync(x => x.Id == id);

            if (reproFromDb is null)
            {
                return Result<ReproResponseDto>.Failure($"Reprogramming not found", 400);
            }

            try
            {
                var lineItems = await _dbContext.ReproLineItems
                                        .Include(x => x.UpdatedBy)
                                        .Include(x => x.Initiative)
                                        .Include(x => x.Grant)
                                        .Include(x => x.Category)
                                        .Include(x => x.Account)
                                        .Where(x => x.ReproId == id).ToListAsync();


                var keys = lineItems.Select(x => new { x.InitiativeId, x.GrantId, x.CategoryId }).Distinct();

                var rowBalances = new List<BalancesResponseDto>();

                foreach (var key in keys)
                {
                    var balances = await _budgetService.GetAccountBalancesForCategory(key.InitiativeId, key.GrantId, key.CategoryId);
                    rowBalances.Add(new BalancesResponseDto()
                    {
                        Key = new()
                        {
                            InitiativeId = key.InitiativeId,
                            GrantId = key.GrantId,
                            CategoryId = key.CategoryId
                        },
                        Balances = [.. balances.Select(x => new BalancesResponseDto.Balance1 { AccountId = x.AccountId, CurrentAmount = x.CurrentAmount, Name = x.Name })]
                    });
                }


                var response = new ReproResponseDto
                {
                    RowBalances = rowBalances,
                    Id = reproFromDb.Id,
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
                        new ReproLineItemResponseDto
                        {
                            Comment = x.Comment,
                            RowId = x.RowId,
                            InitiativeId = x.InitiativeId,
                            GrantId = x.GrantId,
                            AccountId = x.AccountId,
                            CategoryId = x.CategoryId,
                            Increase = x.Increase ?? 0,
                            Decrease = x.Decrease ?? 0,
                            InitiativeName = x.Initiative!.Name,
                            GrantName = x.Grant!.Name,
                            CategoryName = x.Category!.Name,
                            AccountName = x.Account!.Name,
                            Year = x.Year
                        })]
                };

                return Result<ReproResponseDto>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<ReproResponseDto>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
        }

        public async Task<Result<int>> CreateRepro(CreateReproRequestDto reproRequestDto)
        {

            var newId = 0;

            try
            {
                var grant = await _dbContext.Grants.FirstAsync(x => x.Id == reproRequestDto.LineItems.First().GrantId);

                var newRepro = new Repro()
                {
                    Id = 0,
                    Amount = reproRequestDto.LineItems.Sum(x => x.Increase),
                    CreatedById = reproRequestDto.CreatedById,
                    CreatedDate = DateTime.Now,
                    Justification = reproRequestDto.Justification,
                    Posted = reproRequestDto.Posted,
                    PostedById = reproRequestDto.Posted ? reproRequestDto.CreatedById : null,
                    PostedDate = reproRequestDto.Posted ? DateTime.Now : null,
                    Items = [.. reproRequestDto.LineItems.Select(x => new ReproLineItem
                    {
                        ReproId = 0,
                        EntryDate = DateTime.Now,
                        InitiativeId = x.InitiativeId,
                        GrantId = x.GrantId,
                        AccountId = x.AccountId,
                        Increase = x.Increase,
                        Decrease = x.Decrease,
                        CategoryId = x.CategoryId,
                        RowId = x.RowId,
                        Year = grant.Year,
                        Comment = x.Comment
                    })]
                };

                _dbContext.Repros.Add(newRepro);


                if (newRepro.Posted)
                {
                    foreach (var line in newRepro.Items)
                    {
                        var amount = 0M;

                        if (line.Increase > 0)
                        {
                            amount = Convert.ToDecimal(line.Increase ?? 0M);
                        }
                        else if (line.Decrease > 0)
                        {
                            amount = Convert.ToDecimal(line.Decrease ?? 0M) * -1;
                        }
                        else
                        {
                            throw new Exception($"Error in {nameof(CreateRepro)}. Increase and decrease are both zero.");
                        }

                        var budgetLineItem = new BudgetLineItem
                        {
                            Id = 0,
                            InitiativeId = line.InitiativeId,
                            GrantId = line.GrantId,
                            AccountId = line.AccountId,
                            Amount = amount,
                            ItemType = "R",
                            CreateDate = DateTime.Now,
                            CreatedBy = reproRequestDto.CreatedById
                        };

                        _dbContext.BudgetLineItems.Add(budgetLineItem);
                    }

                }

                await _dbContext.SaveChangesAsync();

                newId = newRepro.Id;
            }
            catch (DbException ex)
            {
                return Result<int>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
            catch (Exception ex)
            {
                return Result<int>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }

            return Result<int>.Success(newId);
        }

        public async Task<Result<Unit>> UpdateRepro(UpdateReproRequestDto reproRequestDto)
        {
            try
            {
                var reproFromDb = await _dbContext.Repros.FirstOrDefaultAsync(x => x.Id == reproRequestDto.Id);

                if (reproFromDb is null)
                {
                    return Result<Unit>.Failure($"Repro not found", 400);
                }

                var grant = await _dbContext.Grants.FirstAsync(x => x.Id == reproRequestDto.LineItems.First().GrantId);



                reproFromDb.Amount = reproRequestDto.LineItems.Sum(x => x.Increase);
                reproFromDb.Justification = reproRequestDto.Justification;
                reproFromDb.UpdateDate = DateTime.Now;
                reproFromDb.UpdatedById = reproRequestDto.UpdatedById;

                if (reproRequestDto.Posted && reproFromDb.Posted == false)
                {
                    reproFromDb.PostedById = reproRequestDto.UpdatedById;
                    reproFromDb.PostedDate = DateTime.Now;
                }

                // unposting, only for testing purposes

                if (!reproRequestDto.Posted && reproFromDb.Posted)
                {
                    reproFromDb.PostedById = null;
                    reproFromDb.PostedDate = null;
                }

                reproFromDb.Posted = reproRequestDto.Posted;


                var lineItemsFromDb = await _dbContext.ReproLineItems.Where(x => x.ReproId == reproRequestDto.Id).ToListAsync();

                var db_count = lineItemsFromDb.Count;
                var dto_count = reproRequestDto.LineItems.Count;

                foreach (var req in reproRequestDto.LineItems)
                {
                    //  update existing records
                    if (lineItemsFromDb.Any(x => x.RowId == req.RowId))
                    {
                        var lineFromDb = lineItemsFromDb.First(x => x.RowId == req.RowId);

                        if (lineFromDb.Increase != req.Increase ||
                            lineFromDb.Decrease != req.Decrease ||
                            lineFromDb.InitiativeId != req.InitiativeId ||
                            lineFromDb.GrantId != req.GrantId ||
                            lineFromDb.AccountId != req.AccountId ||
                            lineFromDb.Comment != req.Comment)
                        {
                            lineFromDb.UpdateDate = DateTime.Now;
                            lineFromDb.UpdatedById = reproRequestDto.UpdatedById;
                            lineFromDb.Increase = req.Increase;
                            lineFromDb.Decrease = req.Decrease;
                            lineFromDb.InitiativeId = req.InitiativeId;
                            lineFromDb.GrantId = req.GrantId;
                            lineFromDb.AccountId = req.AccountId;
                            lineFromDb.CategoryId = req.CategoryId;
                            lineFromDb.Comment = string.IsNullOrEmpty(req.Comment) ? null
                            : req.Comment.Trim();
                        }
                    }
                    else
                    {
                        // add new records
                        var newLineItem = new ReproLineItem
                        {
                            Id = 0,
                            RowId = req.RowId,
                            ReproId = reproRequestDto.Id,
                            InitiativeId = req.InitiativeId,
                            GrantId = req.GrantId,
                            AccountId = req.AccountId,
                            Increase = req.Increase,
                            Decrease = req.Decrease,
                            Year = grant.Year,
                            EntryDate = DateTime.Now,
                            CategoryId = req.CategoryId,
                            Comment = string.IsNullOrEmpty(req.Comment) ? null
                            : req.Comment.Trim()
                        };

                        _dbContext.ReproLineItems.Add(newLineItem);
                    }
                }

                if (reproFromDb.Items.Count > reproRequestDto.LineItems.Count)
                {
                    var deleted = reproFromDb.Items.Skip(reproRequestDto.LineItems.Count).Take(1000);

                    foreach (var d in deleted)
                    {
                        _dbContext.ReproLineItems.Remove(d);
                    }
                }


                if (reproRequestDto.Posted)
                {
                    foreach (var line in reproRequestDto.LineItems)
                    {
                        var amount = 0M;

                        if (line.Increase > 0)
                        {
                            amount = line.Increase;
                        }
                        else if (line.Decrease > 0)
                        {
                            amount = line.Decrease * -1;
                        }
                        else
                        {
                            throw new Exception($"Error in {nameof(CreateRepro)}. Increase and decrease are both zero.");
                        }

                        var budgetLineItem = new BudgetLineItem
                        {
                            Id = 0,
                            InitiativeId = line.InitiativeId,
                            GrantId = line.GrantId,
                            AccountId = line.AccountId,
                            Amount = amount,
                            ItemType = "R",
                            CreateDate = DateTime.Now,
                            CreatedBy = reproRequestDto.UpdatedById
                        };

                        _dbContext.BudgetLineItems.Add(budgetLineItem);
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

        public async Task<Result<Unit>> DeleteRepro(int id)
        {

            var repro = await _dbContext.Repros.FirstOrDefaultAsync(x => x.Id == id);

            if (repro is null) return Result<Unit>.Failure("Repro not found", 404);

            var items = await _dbContext.ReproLineItems.Where(x => x.ReproId == id).ToListAsync();

            try
            {
                foreach (var item in items)
                {
                    _dbContext.ReproLineItems.Remove(item);
                }

                _dbContext.Repros.Remove(repro);

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


    }
}