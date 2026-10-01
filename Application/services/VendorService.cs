using System.ComponentModel;
using System.Drawing;
using Application.Core;
using Application.DTOs.Payees;
using Application.PaginationHelpers;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class PayeeService(AppDbContext dbContext, IMapper mapper)
    {

        // public async Task<Result<List<PayeeResponseDto>>> GetAllPayees()
        // {
        //     var vendors = await dbContext.Payees.OrderBy(x => x.Name).ToListAsync();
        //     var response = vendors.Select(x => PayeeResponseDto.Create(x.Id, x.Name, x.AccountId, x.IsActive)).ToList();
        //     return Result<List<PayeeResponseDto>>
        //             .Success(response);
        // }

        public async Task<Result<PayeesSearchResponseDto>> GetPayees(PaginationParams paginationParams, string sortBy)
        {

            var vendorsSummaries = dbContext.PayeeSummaries;

            var vendorsSummariesSorted = sortBy switch
            {
                "NAME" => vendorsSummaries.OrderBy(x => x.Name),
                "NAMEdesc" => vendorsSummaries.OrderByDescending(x => x.Name),
                "DAYSSINCELASTPAYMENT" => vendorsSummaries.OrderBy(x => x.DaysSinceLastPayment),
                "DAYSSINCELASTPAYMENTdesc" => vendorsSummaries.OrderByDescending(x => x.DaysSinceLastPayment),
                "ACCOUNT" => vendorsSummaries.OrderBy(x => x.AccountName),
                "ACCOUNTdesc" => vendorsSummaries.OrderByDescending(x => x.AccountName),
                _ => vendorsSummaries.OrderBy(x => x.Id)
            };

            var vendorsQueryResult = await vendorsSummariesSorted.ToListAsync();

            var mapped = mapper.Map<List<PayeeSearchPayeeResponseDto>>(vendorsQueryResult);

            var pagedItemsList =
                       PagedList<PayeeSearchPayeeResponseDto>.ToPagedList(mapped.AsQueryable(), paginationParams.PageNumber, paginationParams.PageSize);


            var result = new PayeesSearchResponseDto
            {
                Items = pagedItemsList,
                ItemCount = pagedItemsList.Metadata.TotalCount,
                MetaData = pagedItemsList.Metadata
            };

            return Result<PayeesSearchResponseDto>.Success(result);
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