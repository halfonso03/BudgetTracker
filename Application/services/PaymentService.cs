using System.Data.Common;
using Application.Core;
using Application.DTOs.Payment;
using Application.Interfaces;
using Domain;
using InternalVisibleTo;
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

        public async Task<Result<PaymentResponseDto>> GetPayment(int id)
        {
            var paymentFromDb = await _dbContext.Disbs
                                        .Include(x => x.CreatedBy)
                                        .Include(x => x.UpdatedBy)
                                        .Include(x => x.PostedBy)
                                        .FirstOrDefaultAsync(x => x.Id == id);

            if (paymentFromDb is null)
            {
                return Result<PaymentResponseDto>.Failure($"Reprogramming not found", 400);
            }

            try
            {
                var lineItems = await _dbContext.DisbLineItems
                                        .Include(x => x.UpdatedBy)
                                        .Include(x => x.Initiative)
                                        .Include(x => x.Grant)
                                        .Include(x => x.Category)
                                        .Include(x => x.Account)
                                        .Include(x => x.Payee)
                                        .Where(x => x.DisbId == id).ToListAsync();


                var keys = lineItems.Select(x => new { x.InitiativeId, x.GrantId, x.CategoryId, x.AccountId }).Distinct();

                var rowBalances = new List<PaymentBalanceResponseDto>();

                foreach (var key in keys)
                {

                    var remainingAmount = await _dbContext.BudgetLineItems
                                            .Where(x =>
                                                x.InitiativeId == key.InitiativeId &&
                                                x.GrantId == key.GrantId &&
                                                x.AccountId == key.AccountId)
                                            .SumAsync(x => x.Amount);

                    var account = await _dbContext.Accounts.SingleAsync(x => x.Id == key.AccountId);

                    rowBalances.Add(new PaymentBalanceResponseDto()
                    {
                        InitiativeId = key.InitiativeId,
                        GrantId = key.GrantId,
                        CategoryId = key.CategoryId,
                        AccountId = key.AccountId,
                        AccountName = account.Name,
                        RemainingAmount = remainingAmount
                    });
                }


                var response = new PaymentResponseDto
                {
                    RowBalances = rowBalances,
                    Id = paymentFromDb.Id,
                    Year = lineItems.First().Year,
                    Justification = paymentFromDb.Justification,
                    CreatedBy = $"{paymentFromDb.CreatedBy!.FirstName} {paymentFromDb.CreatedBy!.LastName}",
                    CreateDate = paymentFromDb.CreatedDate,
                    CreatedById = paymentFromDb.CreatedById,
                    UpdateDate = paymentFromDb.UpdateDate,
                    UpdatedById = paymentFromDb.UpdatedById,
                    Posted = paymentFromDb.Posted,
                    PostedBy = paymentFromDb.PostedBy != null ? paymentFromDb.PostedBy.FirstName[0].ToString() + paymentFromDb.PostedBy.LastName : "",
                    PostedDate = paymentFromDb.PostedDate,
                    PostedById = paymentFromDb.PostedById,
                    LineItems = [.. lineItems.Select(x =>
                        new PaymentLineItemResponseDto
                        {
                            Comment = x.Comment,
                            RowId = x.RowId,
                            InitiativeId = x.InitiativeId,
                            GrantId = x.GrantId,
                            AccountId = x.AccountId,
                            CategoryId = x.CategoryId,
                            PaymentAmount = x.Amount,
                            PayeeName = x.Payee!.Name,
                            PayeeId = x.PayeeId,
                            InitiativeName = x.Initiative!.Name,
                            GrantName = x.Grant!.Name,
                            CategoryName = x.Category!.Name,
                            AccountName = x.Account!.Name,
                            Year = x.Year,
                            CheckNumber = x.CheckNumber,
                            InvoiceDate = x.InvoiceDate,
                            InvoiceNumber = x.InvoiceNumber
                        })]
                };

                return Result<PaymentResponseDto>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<PaymentResponseDto>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
        }

        public async Task<Result<int>> CreatePayment(CreatePaymentRequestDto disbRequestDto)
        {
            var newId = 0;

            await using var transaction = await _dbContext.Database.BeginTransactionAsync();


            decimal? totalRequested = await CheckForOverBudgetRequest(disbRequestDto.LineItems);

            if (totalRequested is not null)
            {
                throw new Exception($"Total amount requested ${totalRequested} exceeds the amount available for this initiative/grant/account.");
            }


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
                        PayeeId = x.PayeeId,
                        CheckNumber = x.CheckNumber,
                        InvoiceDate = x.InvoiceDate,
                        InvoiceNumber = x.InvoiceNumber
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

        public async Task<Result<Unit>> UpdatePayment(UpdatePaymentRequestDto disbRequestDto)
        {
            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var disbFromDb = await _dbContext.Disbs.FirstOrDefaultAsync(x => x.Id == disbRequestDto.Id);

                if (disbFromDb is null)
                {
                    return Result<Unit>.Failure($"Disb not found", 400);
                }

                if (disbFromDb.Posted)
                {
                    throw new Exception($"Disb has already been posted");
                }

                decimal? totalRequested = await CheckForOverBudgetRequest(disbRequestDto.LineItems);

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
                            lineFromDb.CheckNumber = req.CheckNumber;
                            lineFromDb.InvoiceDate = req.InvoiceDate;
                            lineFromDb.InvoiceNumber = req.InvoiceNumber;
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
                            Comment = string.IsNullOrEmpty(req.Comment) ? null : req.Comment.Trim(),
                            CheckNumber = req.CheckNumber,
                            InvoiceDate = req.InvoiceDate,
                            InvoiceNumber = req.InvoiceNumber,
                        }
                    ;

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

        private async Task<decimal?> CheckForOverBudgetRequest(List<PaymentRequestLineItemDto> lineItems)
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
                    Amount = -1 * line.Amount,
                    ItemType = Globals.ITEM_TYPE_PAYMENT,
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

        public async Task<Result<PaymentResponseDto>> DuplicatePayment(int id, int userId)
        {
            var repro = await _dbContext.Disbs.FirstOrDefaultAsync(x => x.Id == id);

            if (repro == null) return Result<PaymentResponseDto>.Failure("", 404);

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

                var user = await _dbContext.Users.FirstAsync(x => x.Id == userId);
                var loginid = $"{user.FirstName} {user.LastName}";

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

                var rowBalances = new List<PaymentBalanceResponseDto>();

                foreach (var key in keys)
                {
                    // var balances = await _budgetService.GetBalancesForCategory(key.InitiativeId, key.GrantId, key.CategoryId);

                    // rowBalances.Add(new PaymentBalanceResponseDto()
                    // {
                    //     Key = new()
                    //     {
                    //         InitiativeId = key.InitiativeId,
                    //         GrantId = key.GrantId,
                    //         CategoryId = key.CategoryId
                    //     },
                    //     Balances = [.. balances.Select(x => Balance.Create(x.AccountId, x.RemainingAmount, x.AccountName))]
                    // });
                }

                var response = new PaymentResponseDto
                {
                    Id = newDisb.Id,
                    Justification = newDisb.Justification,
                    CreateDate = newDisb.CreatedDate,
                    CreatedById = newDisb.CreatedById,
                    CreatedBy = loginid,
                    Year = newDisb.Year,
                    Posted = false,
                    RowBalances = rowBalances,
                    LineItems = [.. disbLineItems.Select(x => new PaymentLineItemResponseDto
                    {
                        RowId = x.RowId,
                        Year = x.Year,
                        InitiativeId = x.InitiativeId,
                        GrantId = x.GrantId,
                        AccountId = x.AccountId,
                        CategoryId = x.CategoryId,
                        PaymentAmount = x.Amount,
                        InitiativeName = x.Initiative!.Name,
                        GrantName = x.Grant!.Name,
                        AccountName = x.Account!.Name,
                        CategoryName = x.Category!.Name,
                        PayeeName = x.Payee!.Name,
                        PayeeId = x.PayeeId,
                        Comment = x.Comment,
                        InvoiceDate = x.InvoiceDate,
                        InvoiceNumber = x.InvoiceNumber,
                        CheckNumber = x.CheckNumber
                    })]
                };

                return Result<PaymentResponseDto>.Success(response);

            }
            catch (DbException ex)
            {
                return Result<PaymentResponseDto>.Failure($"DB Error: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 500);
            }
            catch (Exception ex)
            {
                return Result<PaymentResponseDto>.Failure(ex.Message, 500);
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