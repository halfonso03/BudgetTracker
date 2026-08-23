using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs.Repro;

namespace Application.Interfaces
{
    public interface IReproService
    {

        Task<Result<ReproResponseDto>> GetRepro(int id);
        Task<Result<int>> CreateRepro(CreateReproRequestDto reproRequestDto);
        Task<Result<Unit>> DeleteRepro(int id);
        Task<Result<Unit>> UpdateRepro(UpdateReproRequestDto reproRequestDto);
    }
}