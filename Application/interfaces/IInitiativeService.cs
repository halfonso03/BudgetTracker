using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Budgets.DTOs;

namespace Application.interfaces
{
    public interface IInitiativeService
    {
        Task<List<InitiativeDto>> GetInitiatives();
    }
}