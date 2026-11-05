using System.Data.Common;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using Application.Core;
using Application.DTOs;
using Application.DTOs.Payment;
using Application.Extensions;
using Application.Interfaces;
using Application.PaginationHelpers;
using Domain;
using InternalVisibleTo;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
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
                return Result<PaymentResponseDto>.Failure($"Payment not found", 400);
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



                var payeeIds = lineItems.Select(x => x.PayeeId).Distinct().ToList();


                var summaries = await _dbContext.PayeeSummaries
                            .Where(x => payeeIds.Contains(x.Id))
                            .Select(x => new
                            {
                                x.Id,
                                x.LastPaymentDate,
                                x.NumberOfPayments
                            })
                            .ToListAsync();


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
                            PaymentLineItemId  = x.Id,
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
                            InvoiceNumber = x.InvoiceNumber,
                            LastPaymentDate = summaries.SingleOrDefault(y => y.Id == x.PayeeId)?.LastPaymentDate,
                            NumberOfPayments = summaries.SingleOrDefault(y => y.Id == x.PayeeId)?.NumberOfPayments,
                            PaymentNumber = x.PaymentNumber
                        })]
                };

                return Result<PaymentResponseDto>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<PaymentResponseDto>.Failure($"{ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
        }

        public async Task<Result<CreatePaymentResponseDto>> CreatePayment(CreatePaymentRequestDto disbRequestDto)
        {
            var newId = 0;
            var rowIdsResponse = new List<int>();
            var paymentNumbersResponse = new List<int>();

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
                        InvoiceNumber = x.InvoiceNumber,
                        InvoiceDate = x.InvoiceDate,
                        CheckNumber = x.CheckNumber,

                    })]
                };

                var payeeIds = disbRequestDto.LineItems.Select(x => x.PayeeId).Distinct().ToList();
                var payeePayments = await _dbContext.DisbLineItems
                                    .Where(x => payeeIds.Contains(x.PayeeId) && x.BudgetLineItemId != null)
                                    .GroupBy(x => x.PayeeId)
                                    .Select(x => new PayeePaymentCount
                                    {
                                        PaymentCount = x.Count(),
                                        PayeeId = x.Key
                                    })
                                    .ToListAsync();

                UpdatePaymentNumbers(newDisb.Items, payeePayments);


                _dbContext.Disbs.Add(newDisb);

                await _dbContext.SaveChangesAsync();

                if (newDisb.Posted)
                {
                    await PostDisb(disbRequestDto.LineItems, newDisb.Id, disbRequestDto.CreatedById);
                }

                newId = newDisb.Id;

                await transaction.CommitAsync();

                rowIdsResponse = [.. newDisb.Items.OrderBy(x => x.RowId).Select(x => x.Id)];
                paymentNumbersResponse = [.. newDisb.Items.OrderBy(x => x.RowId).Select(x => x.PaymentNumber)];
            }
            catch (DbException ex)
            {
                await transaction.RollbackAsync();
                return Result<CreatePaymentResponseDto>.Failure($"DB Error: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<CreatePaymentResponseDto>.Failure($"Error: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }

            return Result<CreatePaymentResponseDto>.Success(CreatePaymentResponseDto.Create(newId, rowIdsResponse, paymentNumbersResponse));
        }

        private static void UpdatePaymentNumbers(IList<DisbLineItem> items, List<PayeePaymentCount> payeePaymentCounts)
        {
            // payeeId, paymentNo
            var usedNos = new Dictionary<int, int>();

            foreach (var p in items.Select(x => x.PayeeId).Distinct())
            {
                usedNos[p] = payeePaymentCounts.Any(x => x.PayeeId == p)
                            ? payeePaymentCounts.First(x => x.PayeeId == p).PaymentCount + 1
                            : 1;
            }

            foreach (var line in items.OrderBy(x => x.RowId))
            {
                if (usedNos.TryGetValue(line.PayeeId, out int value))
                {
                    line.PaymentNumber = value;
                    usedNos[line.PayeeId] = value + 1;
                }
            }
        }

        public async Task<Result<UpdatePaymentResponseDto>> UpdatePayment(UpdatePaymentRequestDto disbRequestDto)
        {
            var rowIdsResponse = new List<int>();
            var paymentNumbersResponse = new List<int>();
            var allLines = new List<DisbLineItem>();

            await using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var disbFromDb = await _dbContext.Disbs.FirstOrDefaultAsync(x => x.Id == disbRequestDto.Id);

                if (disbFromDb is null)
                {
                    return Result<UpdatePaymentResponseDto>.Failure($"Disb not found", 400);
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

                foreach (var req in disbRequestDto.LineItems)
                {
                    if (lineItemsFromDb.Any(x => x.RowId == req.RowId))
                    {
                        var lineFromDb = lineItemsFromDb.First(x => x.RowId == req.RowId);

                        if (lineFromDb.Amount != req.Amount ||
                            lineFromDb.InitiativeId != req.InitiativeId ||
                            lineFromDb.GrantId != req.GrantId ||
                            lineFromDb.AccountId != req.AccountId ||
                            lineFromDb.PayeeId != req.PayeeId ||
                            lineFromDb.Comment != req.Comment ||
                            lineFromDb.InvoiceNumber != req.InvoiceNumber ||
                            lineFromDb.InvoiceDate != req.InvoiceDate ||
                            lineFromDb.CheckNumber != req.CheckNumber)
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
                            lineFromDb.CheckNumber = req.CheckNumber;
                            lineFromDb.InvoiceDate = req.InvoiceDate;
                            lineFromDb.InvoiceNumber = req.InvoiceNumber;
                        }

                        allLines.Add(lineFromDb);
                    }
                    else
                    {
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
                            InvoiceNumber = req.InvoiceNumber,
                            InvoiceDate = req.InvoiceDate,
                            CheckNumber = req.CheckNumber,
                        };

                        allLines.Add(newLineItem);

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


                var payeeIds = disbRequestDto.LineItems.Select(x => x.PayeeId).Distinct().ToList();
                var payeePayments = await _dbContext.DisbLineItems
                                    .Where(x => payeeIds.Contains(x.PayeeId) && x.BudgetLineItemId != null)
                                    .GroupBy(x => x.PayeeId)
                                    .Select(x => new PayeePaymentCount
                                    {
                                        PaymentCount = x.Count(),
                                        PayeeId = x.Key
                                    })
                                    .ToListAsync();

                UpdatePaymentNumbers(allLines, payeePayments);


                if (disbRequestDto.Posted)
                {
                    await PostDisb(disbRequestDto.LineItems, disbRequestDto.Id, disbRequestDto.UpdatedById);
                }
                else
                {
                    await _dbContext.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                rowIdsResponse = [.. disbFromDb.Items.OrderBy(x => x.RowId).Select(x => x.Id)];
                paymentNumbersResponse = [.. disbFromDb.Items.OrderBy(x => x.RowId).Select(x => x.PaymentNumber)];
            }
            catch (DbException ex)
            {
                await transaction.RollbackAsync();
                return Result<UpdatePaymentResponseDto>.Failure($"UpdatePayment: DbException: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return Result<UpdatePaymentResponseDto>.Failure($"UpdatePayment: Exception: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 400);
            }

            return Result<UpdatePaymentResponseDto>.Success(UpdatePaymentResponseDto.Create(disbRequestDto.Id, rowIdsResponse, paymentNumbersResponse));
        }

        public async Task<Result<Unit>> UpdateInvoice(UpdateInvoiceRequestDto updateInvoiceRequest)
        {
            try
            {

                var payment = await _dbContext.DisbLineItems.SingleOrDefaultAsync(x => x.Id == updateInvoiceRequest.PaymentLineItemId);

                if (payment != null)
                {
                    payment.InvoiceDate = updateInvoiceRequest.InvoiceDate;
                    payment.InvoiceNumber = updateInvoiceRequest.InvoiceNumber;
                    payment.CheckNumber = updateInvoiceRequest.CheckNumber;

                    await _dbContext.SaveChangesAsync();

                    return Result<Unit>.Success(Unit.Value);
                }
                else
                {
                    return Result<Unit>.Failure("Payment not found", 404);
                }

            }
            catch (DbException ex)
            {
                return Result<Unit>.Failure($"DB Error: {ex.Message}. Inner Ex: {ex.InnerException?.Message}", 500);

            }
            catch (Exception ex)
            {
                return Result<Unit>.Failure(ex.Message, 500);

            }

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

        private async Task PostDisb(IList<PaymentRequestLineItemDto> items, int disbId, int userId)
        {
            var postedBudgetLineItems = new List<BudgetLineItem>();

            var disbLines = await _dbContext.DisbLineItems.Where(x => x.DisbId == disbId).Select(x => x).ToListAsync();

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
                    Year = disbLines.First().Year,
                    AdditionalInformation = $"Payment to Payee Id {line.PayeeId}."
                };

                postedBudgetLineItems.Add(budgetLineItem);

                _dbContext.BudgetLineItems.Add(budgetLineItem);
            }

            await _dbContext.SaveChangesAsync();



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
                        BudgetLineItemId = null,
                    })]
                };


                var payeeIds = newDisb.Items.Select(x => x.PayeeId).Distinct().ToList();
                var payeePayments = await _dbContext.DisbLineItems
                                    .Where(x => payeeIds.Contains(x.PayeeId) && x.BudgetLineItemId != null)
                                    .GroupBy(x => x.PayeeId)
                                    .Select(x => new PayeePaymentCount
                                    {
                                        PayeeId = x.Key,
                                        PaymentCount = x.Count()
                                    })
                                    .ToListAsync();

                UpdatePaymentNumbers(newDisb.Items, payeePayments);

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
                        PaymentLineItemId = x.Id,
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
                        CheckNumber = x.CheckNumber,
                        PaymentNumber = x.PaymentNumber
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

        public async Task<Result<PaymentSearchResponseDto>> Search(PaymentSearchRequestDto searchParams,
                            PaginationParams paginationParams, string sortBy)
        {
            var disbLineItems = _dbContext.DisbLineItems
                                    .Where(x => x.Year == searchParams.Year)
                                    .AsQueryable();

            if (searchParams.PayeeIds?.Count > 0)
            {
                disbLineItems = disbLineItems.Where(x => searchParams.PayeeIds.Contains(x.PayeeId));
            }

            if (searchParams.InitiativeIds?.Count > 0)
            {
                disbLineItems = disbLineItems.Where(x => searchParams.InitiativeIds.Contains(x.InitiativeId));
            }
            if (searchParams.GrantIds?.Count > 0)
            {
                disbLineItems = disbLineItems.Where(x => searchParams.GrantIds.Contains(x.GrantId));
            }
            if (searchParams.AccountIds?.Count > 0)
            {
                disbLineItems = disbLineItems.Where(x => searchParams.AccountIds.Contains(x.AccountId));
            }



            if (searchParams.Status != PaymentSearchStatus.ALL)
            {
                if (searchParams.Status == PaymentSearchStatus.SAVED)
                {
                    disbLineItems = disbLineItems.Where(x => x.BudgetLineItemId == null);
                }
                else
                {
                    disbLineItems = disbLineItems.Where(x => x.BudgetLineItemId != null);
                }
            }

            // var lineItemIdsByBudget = new List<int>();

            // if (searchParams.PaymentSearchBudgetHeaders != null)
            // {
            //     var ids1 = searchParams.PaymentSearchBudgetHeaders.Select(x => x.InitiativeId);
            //     var ids2 = searchParams.PaymentSearchBudgetHeaders.Select(x => x.GrantId);

            //     List<(int InitiativeId, int GrantId, int AccountId)> Tuples = [];

            //     foreach (var (InitiativeId, GrantId, AccountId) in searchParams.PaymentSearchBudgetHeaders.Select(x => (x.InitiativeId, x.GrantId, x.AccountId)).ToList())
            //     {
            //         Tuples.Add((InitiativeId, GrantId, AccountId));
            //     }

            //     lineItemIdsByBudget = [.. disbLineItems.AsEnumerable().Join(Tuples.AsEnumerable(),
            //                 r => new { r.InitiativeId, r.GrantId, r.AccountId },
            //                 t => new { t.InitiativeId, t.GrantId, t.AccountId },
            //                 (r, t) =>
            //                     r.Id
            //                 )];
            // }

            // if (lineItemIdsByBudget.Count > 0)
            // {
            //     disbLineItems = disbLineItems.Where(x => lineItemIdsByBudget.Contains(x.Id));
            // }

            var lineItemIds = await disbLineItems.Select(x => x.Id).ToListAsync();

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            var paymentLineItemResponses = _dbContext.DisbLineItems
                                    .Include(x => x.Initiative)
                                    .Include(x => x.Grant)
                                    .Include(x => x.Account)
                                    .Include(x => x.Category)
                                    .Include(x => x.Payee)
                                    .Include(x => x.Disb)
                                        .ThenInclude(y => y.PostedBy)
                                    .Where(x => lineItemIds.Contains(x.Id))
                                    .Select(y => new
                                    {
                                        y,
                                        postedBy = y.Disb!.Posted == true ? y.Disb.PostedBy : null,
                                    }).AsQueryable();
#pragma warning restore CS8602 // Dereference of a possibly null reference.


            var paymentsList = await paymentLineItemResponses
                                        .Select(y => new PaymentSearchResponseLineItemDto
                                        {
                                            PaymentId = y.y.DisbId,
                                            PaymentLineItemId = y.y.Id,
                                            PaymentNumber = y.y.PaymentNumber,
                                            Year = y.y.Year,
                                            InitiativeName = y.y.Initiative!.Name,
                                            GrantName = y.y.Grant!.Name,
                                            CategoryName = y.y.Category!.Name,
                                            AccountName = y.y.Account!.Name,
                                            PayeeName = y.y.Payee!.Name,
                                            InvoiceNumber = y.y.InvoiceNumber,
                                            InvoiceDate = y.y.InvoiceDate,
                                            CheckNumber = y.y.CheckNumber,
                                            Amount = y.y.Amount,
                                            PostedBy = y.postedBy != null ? $"{y.postedBy!.FirstName} {y.postedBy!.LastName}" : string.Empty,
                                            StatusSort = y.postedBy != null ? 1 : 2,
                                            PostedDate = y.y.Disb!.PostedDate,
                                        }).ToListAsync();


            var sorted = sortBy switch
            {
                "ID" => paymentsList.OrderBy(x => x.PaymentId),
                "IDdesc" => paymentsList.OrderByDescending(x => x.PaymentId).ThenByDescending(x => x.PayeeName),
                "PAYMENTNUMBER" => paymentsList.OrderBy(x => x.PaymentNumber).ThenBy(x => x.PayeeName),
                "PAYMENTNUMBERdesc" => paymentsList.OrderByDescending(x => x.PaymentNumber).ThenByDescending(x => x.PayeeName),
                "PAYEE" => paymentsList.OrderBy(x => x.PayeeName),
                "PAYEEdesc" => paymentsList.OrderByDescending(x => x.PayeeName),
                "AMOUNT" => paymentsList.OrderBy(x => x.Amount).ThenBy(x => x.PayeeName),
                "AMOUNTdesc" => paymentsList.OrderByDescending(x => x.Amount).ThenByDescending(x => x.PayeeName),
                "INVOICENUMBER" => paymentsList.OrderBy(x => x.InvoiceNumber),
                "INVOICENUMBERdesc" => paymentsList.OrderByDescending(x => x.InvoiceNumber),
                "INVOICEDATE" => paymentsList.OrderBy(x => x.InvoiceDate).ThenBy(x => x.PayeeName),
                "INVOICEDATEdesc" => paymentsList.OrderByDescending(x => x.InvoiceDate).ThenByDescending(x => x.PayeeName),
                "CHECKNUMBER" => paymentsList.OrderBy(x => x.CheckNumber),
                "CHECKNUMBERdesc" => paymentsList.OrderByDescending(x => x.CheckNumber),
                "POSTEDBY" => paymentsList.OrderBy(x => x.PostedBy).ThenBy(x => x.PayeeName),
                "POSTEDBYdesc" => paymentsList.OrderByDescending(x => x.PostedBy).ThenByDescending(x => x.PayeeName),
                "POSTEDDATE" => paymentsList.OrderBy(x => x.PostedDate).ThenBy(x => x.PayeeName),
                "POSTEDDATEdesc" => paymentsList.OrderByDescending(x => x.PostedDate).ThenByDescending(x => x.PayeeName),
                "STATUS" => paymentsList.OrderBy(x => x.StatusSort).ThenBy(x => x.PayeeName),
                "STATUSdesc" => paymentsList.OrderByDescending(x => x.StatusSort).ThenByDescending(x => x.PayeeName),
                "INITIATIVE" => paymentsList.OrderBy(x => x.InitiativeName).ThenBy(x => x.PayeeName),
                "INITIATIVEdesc" => paymentsList.OrderByDescending(x => x.InitiativeName).ThenByDescending(x => x.PayeeName),
                "AWARD" => paymentsList.OrderBy(x => x.GrantName).ThenBy(x => x.PayeeName),
                "AWARDdesc" => paymentsList.OrderByDescending(x => x.GrantName).ThenByDescending(x => x.PayeeName),
                "ACCOUNT" => paymentsList.OrderBy(x => x.AccountName).ThenBy(x => x.PayeeName),
                "ACCOUNTdesc" => paymentsList.OrderByDescending(x => x.AccountName).ThenByDescending(x => x.PayeeName),
                _ => paymentsList.OrderBy(x => x.PaymentNumber)
            };


            var pagedItemsList =
                           PagedList<PaymentSearchResponseLineItemDto>.ToPagedList(sorted.AsQueryable(), paginationParams.PageNumber, paginationParams.PageSize);

            var result = new PaymentSearchResponseDto
            {
                Items = pagedItemsList,
                ItemCount = pagedItemsList.Metadata.TotalCount,
                MetaData = pagedItemsList.Metadata
            };

            return Result<PaymentSearchResponseDto>.Success(result);
        }

        public async Task<Result<List<PaymentSearchBudgetParamResponseDto>>> GetBudgetsForSearch(int year)
        {

            var result = _dbContext.DisbLineItems
                                .Join(_dbContext.Initiatives,
                                    d => d.InitiativeId,
                                    i => i.Id,
                                    (d, i) =>
                                    new
                                    {
                                        d.InitiativeId,
                                        d.GrantId,
                                        d.AccountId,
                                        InitiativeName = i.Name
                                    }
                                )
                                .Join(_dbContext.Grants,
                                    d => d.GrantId,
                                    g => g.Id,
                                    (d, g) =>
                                    new
                                    {
                                        d.InitiativeId,
                                        d.InitiativeName,
                                        d.GrantId,
                                        GrantName = g.Name,
                                        d.AccountId,
                                        g.Year
                                    })
                                .Join(_dbContext.Accounts,
                                d => d.AccountId,
                                a => a.Id,
                                (d, g) =>
                                new
                                {
                                    d.InitiativeId,
                                    d.InitiativeName,
                                    d.GrantId,
                                    d.GrantName,
                                    d.AccountId,
                                    AccountName = g.Name,
                                    d.Year
                                })
                                .Where(x => x.Year == year)
                                .Select(x => new PaymentSearchBudgetParamResponseDto
                                {
                                    InitiativeId = x.InitiativeId,
                                    InitiativeName = x.InitiativeName,
                                    GrantId = x.GrantId,
                                    GrantName = x.GrantName,
                                    AccountId = x.AccountId,
                                    AccountName = x.AccountName
                                })
                                .Distinct()
                                .ToList();

            return Result<List<PaymentSearchBudgetParamResponseDto>>.Success(result);
        }

        public async Task<Result<Unit>> DeletePayment(int paymentLineItemId)
        {
            var disbLIneItem = await _dbContext.DisbLineItems.SingleOrDefaultAsync(x => x.Id == paymentLineItemId);

            if (disbLIneItem is null) return Result<Unit>.Failure("Payment Item not found", 404);

            var disb = await _dbContext.Disbs.Include(x => x.Items).Where(x => x.Id == disbLIneItem.DisbId).FirstAsync();

            try
            {
                var itemCount = disb.Items.Count;

                if (itemCount == 1)
                {
                    _dbContext.Disbs.Remove(disb);
                }
                else
                {
                    _dbContext.DisbLineItems.Remove(disbLIneItem);
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

        private class PayeePaymentCount
        {
            public int PayeeId { get; set; }
            public int PaymentCount { get; set; }
        }

    }
}