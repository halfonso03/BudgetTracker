using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class ListExtensions
    {
        public static void AddIfTrue<T>(this List<T> items, T newItem, bool add)
        {
            if (add)
            {
                items.Add(newItem);
            }
        }
    }
}