using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs;
using Application.DTOs.Repro;
using Application.PaginationHelpers;

namespace Application.Interfaces
{
    public interface IReproService
    {

        Task<Result<ReproResponseDto>> GetRepro(int id);
        Task<Result<int>> CreateRepro(CreateReproRequestDto reproRequestDto);
        Task<Result<Unit>> DeleteRepro(int id);
        Task<Result<Unit>> UpdateRepro(UpdateReproRequestDto reproRequestDto);
        Task<Result<ReproSearchResponseDto>> Search(ReproSearchParams searchParams, PaginationParams paginationParams);
    }
}