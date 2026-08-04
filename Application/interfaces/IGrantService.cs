using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Budgets.DTOs;

namespace Application.interfaces
{
    public interface IGrantService
    {
        Task<List<GrantDto>> GetGrants(int year);
    }
}