using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Budgets;

namespace Application.Interfaces
{
    public interface IDisbService
    {
        Task<List<TransactionResponseDto>> GetLineItemsForAccount(int initiativeId, int grantId, int accountId);
    }
}