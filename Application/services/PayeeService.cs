using System.ComponentModel;
using System.Drawing;
using Application.Core;
using Application.DTOs.Payee;
using Application.DTOs.Payees;
using Application.PaginationHelpers;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class PayeeService(AppDbContext dbContext, IMapper mapper)
    {
        public async Task<Result<List<PayeePaymentResponseDto>>> GetPayeePayments(int payeeId, PaginationParams paginationParams, string sortBy)
        {

            var payments = await (from d in dbContext.Disbs
                                  join l in dbContext.DisbLineItems on d.Id equals l.DisbId
                                  join u in dbContext.Users on d.PostedById equals u.Id
                                  where d.Posted == true
                                  && l.PayeeId == payeeId
                                  select new PayeePaymentResponseDto
                                  {
                                      Id = d.Id,
                                      Amount = l.Amount,
                                      PostedBy = u.FirstName + " " + u.LastName,
                                      PostedDate = Convert.ToDateTime(d.PostedDate),
                                      Year = l.Year
                                  }).ToListAsync();

            return Result<List<PayeePaymentResponseDto>>.Success(payments);
        }

        // public async Task<Result<List<PayeeResponseDto>>> GetAllPayees()
        // {
        //     var vendors = await dbContext.Payees.OrderBy(x => x.Name).ToListAsync();
        //     var response = vendors.Select(x => PayeeResponseDto.Create(x.Id, x.Name, x.AccountId, x.IsActive)).ToList();
        //     return Result<List<PayeeResponseDto>>
        //             .Success(response);
        // }

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