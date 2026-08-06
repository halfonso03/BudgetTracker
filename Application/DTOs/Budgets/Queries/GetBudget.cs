using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Application.DTOs.Budgets;
using Application.Core;
using MediatR;

namespace Application.Budgets.Queries
{
    public class GetBudget
    {
        public class Query : IRequest<Result<BudgetDto>>
        {

        }
    }
}