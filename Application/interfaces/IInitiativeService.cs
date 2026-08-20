using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Budgets;
using Application.DTOs.Common;

namespace Application.Interfaces
{
    public interface IInitiativeService
    {
        Task<List<InitiativeDto>> GetInitiatives();
    }
}