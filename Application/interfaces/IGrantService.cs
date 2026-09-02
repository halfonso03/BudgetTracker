using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Budgets;
using Application.DTOs.Common;

namespace Application.Interfaces
{
    public interface IGrantService
    {
        Task<List<GrantDto>> GetAllGrants();
        Task<List<GrantDto>> GetGrants(int year);
    }
}