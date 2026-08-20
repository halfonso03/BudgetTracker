using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
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
    public class ReproService(AppDbContext _dbContext) : IReproService
    {
        public async Task<Result<Unit>> CreateRepro(CreateReproRequestDto reproRequestDto)
        {
            try
            {
                var grant = await _dbContext.Grants.FirstAsync(x => x.Id == reproRequestDto.LineItems.First().GrantId);

                var newRepro = new Repro()
                {
                    Id = 0,
                    Amount = reproRequestDto.LineItems.Sum(x => x.Increase),
                    CreatedById = reproRequestDto.CreatedBy,
                    CreatedDate = DateTime.Now,
                    Justification = reproRequestDto.Justification,
                    Posted = reproRequestDto.Posted,
                    PostedById = reproRequestDto.PostedBy,
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
                        Year = grant.Year
                    })]
                };

                await _dbContext.SaveChangesAsync();
            }
            catch (DbException ex)
            {
                return Result<Unit>.Failure(ex.Message, 400);
            }
            catch (Exception ex)
            {
                return Result<Unit>.Failure(ex.Message, 400);
            }

            return Result<Unit>.Success(Unit.Value);




        }
    }
}