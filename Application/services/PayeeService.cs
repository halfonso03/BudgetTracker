using System.ComponentModel;
using System.Drawing;
using Application.Core;
using Application.DTOs.Payee;
using Application.DTOs.Payees;
using Application.PaginationHelpers;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class PayeeService(AppDbContext dbContext, IMapper mapper)
    {
        public async Task<Result<Unit>> CreatePayee(CreatePayeeRequestDto createPayeeRequestDto)
        {
            try
            {
                var payee = new Payee()
                {
                    Id = 0,
                    PayeeTypeId = (PayeeType)createPayeeRequestDto.PayeeTypeId,
                    AdditionalInformation = createPayeeRequestDto.AdditionalInformation?.Trim(),
                    IsActive = createPayeeRequestDto.IsActive,
                    AccountId = createPayeeRequestDto.AccountId,
                    Name = createPayeeRequestDto.Name
                };

                dbContext.Payees.Add(payee);
                await dbContext.SaveChangesAsync();

                return Result<Unit>.Success(Unit.Value);
            }
            catch (Exception ex)
            {

                return Result<Unit>.Failure(ex.Message, 500);
            }
        }

        public async Task<Result<Unit>> UpdatePayee(UpdatePayeeRequestDto updatePayeeRequestDto)
        {

            try
            {
                var payee = await dbContext.Payees.SingleOrDefaultAsync(x => x.Id == updatePayeeRequestDto.Id);

                if (payee == null) return Result<Unit>.Failure("", 404);

                payee.AdditionalInformation = updatePayeeRequestDto.AdditionalInformation?.Trim();
                payee.PayeeTypeId = (PayeeType)updatePayeeRequestDto.PayeeTypeId;
                payee.IsActive = updatePayeeRequestDto.IsActive;
                payee.AccountId = updatePayeeRequestDto.AccountId;
                payee.Name = updatePayeeRequestDto.Name;

                await dbContext.SaveChangesAsync();

                return Result<Unit>.Success(Unit.Value);
            }
            catch (Exception ex)
            {

                return Result<Unit>.Failure(ex.Message, 500);
            }
        }

        public async Task<Result<PaymentSearchResponseDto>> GetPayeePayments(int payeeId, PaginationParams paginationParams, string sortBy)
        {

            var paymentsQuery = await (from d in dbContext.Disbs
                                       join l in dbContext.DisbLineItems on d.Id equals l.DisbId
                                       join u in dbContext.Users on d.PostedById equals u.Id
                                       join i in dbContext.Initiatives on l.InitiativeId equals i.Id
                                       join g in dbContext.Grants on l.GrantId equals g.Id
                                       where d.Posted == true
                                       && l.PayeeId == payeeId
                                       select new PayeePaymentResponseDto
                                       {
                                           Id = d.Id,
                                           Amount = l.Amount,
                                           PostedBy = u.FirstName[0].ToString().ToLower() + u.LastName.ToLower(),
                                           PostedDate = Convert.ToDateTime(d.PostedDate),
                                           Year = l.Year,
                                           Initiative = i.Name,
                                           Grant = g.Name
                                       }).ToListAsync();



            var paymentsQuerySorted = sortBy switch
            {
                "ID" => paymentsQuery.OrderBy(x => x.Id),
                "IDdesc" => paymentsQuery.OrderByDescending(x => x.Id),
                "YEAR" => paymentsQuery.OrderBy(x => x.Year),
                "YEARdesc" => paymentsQuery.OrderByDescending(x => x.Year),
                "INITIATIVE" => paymentsQuery.OrderBy(x => x.Initiative),
                "INITIATIVEdesc" => paymentsQuery.OrderByDescending(x => x.Initiative),
                "GRANT" => paymentsQuery.OrderBy(x => x.Grant),
                "GRANTdesc" => paymentsQuery.OrderByDescending(x => x.Grant),
                "AMOUNT" => paymentsQuery.OrderBy(x => x.Amount),
                "AMOUNTdesc" => paymentsQuery.OrderByDescending(x => x.Amount),
                "POSTEDDATE" => paymentsQuery.OrderBy(x => x.PostedDate),
                "POSTEDDATEdesc" => paymentsQuery.OrderByDescending(x => x.PostedDate),
                "POSTEDBY" => paymentsQuery.OrderBy(x => x.PostedBy),
                "POSTEDBYdesc" => paymentsQuery.OrderByDescending(x => x.PostedBy),
                _ => paymentsQuery.OrderBy(x => x.Id)
            };


            var pagedItemsList =
                       PagedList<PayeePaymentResponseDto>.ToPagedList(paymentsQuerySorted.AsQueryable(), paginationParams.PageNumber, paginationParams.PageSize);



            var response = new PaymentSearchResponseDto
            {
                Items = pagedItemsList,
                MetaData = pagedItemsList.Metadata,
                ItemCount = pagedItemsList.Metadata.TotalCount
            };

            return Result<PaymentSearchResponseDto>.Success(response);
        }

        public async Task<Result<PayeePaymentStatsDto?>> GetPayeePaymentSummary(int payeeId)
        {
            var paymentsQuery = await (from d in dbContext.Disbs
                                       join l in dbContext.DisbLineItems on d.Id equals l.DisbId
                                       where d.Posted == true
                                       && l.PayeeId == payeeId
                                       group new { l.Amount, d.PostedDate } by l.PayeeId into grp
                                       select new PayeePaymentStatsDto
                                       {
                                           AveragePayment = grp.Average(x => x.Amount),
                                           LastPaymentDate = grp.Max(x => x.PostedDate),
                                           HighestPayment = grp.Max(x => x.Amount),
                                           LowestPayment = grp.Min(x => x.Amount),
                                           LastPaymentAmount = grp.First(x => x.PostedDate == grp.Max(x => x.PostedDate)).Amount

                                       }).SingleOrDefaultAsync();

            return Result<PayeePaymentStatsDto?>.Success(paymentsQuery ?? new PayeePaymentStatsDto());
        }

        public async Task<Result<PayeeSearchResponseDto>> GetPayees(PaginationParams paginationParams, string searchTerm, string sortBy)
        {

            var payeeSummaries = dbContext.PayeeSummaries;

            var payeesSummariesSorted = sortBy switch
            {
                "NAME" => payeeSummaries.OrderBy(x => x.Name),
                "NAMEdesc" => payeeSummaries.OrderByDescending(x => x.Name),
                "TOTALPAID" => payeeSummaries.OrderBy(x => x.TotalPaid),
                "TOTALPAIDdesc" => payeeSummaries.OrderByDescending(x => x.TotalPaid),
                "DAYSSINCELASTPAYMENT" => payeeSummaries.OrderBy(x => x.DaysSinceLastPayment),
                "DAYSSINCELASTPAYMENTdesc" => payeeSummaries.OrderByDescending(x => x.DaysSinceLastPayment),
                "LASTPAYMENTAMOUNT" => payeeSummaries.OrderBy(x => x.LastPaymentAmount),
                "LASTPAYMENTAMOUNTdesc" => payeeSummaries.OrderByDescending(x => x.LastPaymentAmount),
                "LASTPAYMENTDATE" => payeeSummaries.OrderBy(x => x.LastPaymentDate),
                "LASTPAYMENTDATEdesc" => payeeSummaries.OrderByDescending(x => x.LastPaymentDate),
                "ACCOUNT" => payeeSummaries.OrderBy(x => x.AccountName),
                "ACCOUNTdesc" => payeeSummaries.OrderByDescending(x => x.AccountName),
                "ISACTIVE" => payeeSummaries.OrderBy(x => x.IsActive),
                "ISACTIVEdesc" => payeeSummaries.OrderByDescending(x => x.IsActive),
                _ => payeeSummaries.OrderBy(x => x.Id)
            };

            var payeesQueryResult = await payeesSummariesSorted.ToListAsync();

            var mapped = mapper.Map<List<PayeeSearchPayeeResponseDto>>(payeesQueryResult);

            var pagedItemsList =
                       PagedList<PayeeSearchPayeeResponseDto>.ToPagedList(mapped.AsQueryable(), paginationParams.PageNumber, paginationParams.PageSize);


            var result = new PayeeSearchResponseDto
            {
                Items = pagedItemsList,
                ItemCount = pagedItemsList.Metadata.TotalCount,
                MetaData = pagedItemsList.Metadata
            };

            return Result<PayeeSearchResponseDto>.Success(result);
        }



        // public async Task<Result<List<PayeeResponseDto>>> GetPayeesForAccount(int accountId)
        // {
        //     var vendors = await dbContext.Payees.Where(x => x.AccountId == accountId).ToListAsync();
        //     var response = vendors.Select(x => PayeeResponseDto.Create(x.Id, x.Name, x.AccountId, x.IsActive)).ToList();
        //     return Result<List<PayeeResponseDto>>
        //             .Success(response);
        // }
    }
}