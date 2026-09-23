using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Application.DTOs.Reporting;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class Selection
    {
        public required string Value { get; set; }
    }

    public class ReportParameterValuesService(AppDbContext dbContext)
    {

        private readonly Dictionary<string, Func<Selection?, Task<List<SelectOption>?>>> values = new()
        {
            {
                ReportParameterGlobalNames.YEAR,
                async selection => {
                    var years = await dbContext
                                    .Grants
                                    .Select(x => x.Year)
                                    .ToListAsync();

                    return [.. years.OrderByDescending(x => x).Distinct().Select(x =>
                                        new SelectOption { Id = x, Text = x.ToString(), Selected = false })];
                }
            },
            {
                ReportParameterGlobalNames.INITIATIVES,
                async selection => {
                    var data = await dbContext
                                    .Initiatives
                                    .ToListAsync();

                    return [.. data.Select(x =>
                                        new SelectOption { Id = x.Id, Text = x.Name, Selected = false })];
                }
            },
            {
                ReportParameterGlobalNames.GRANTS,
                async selection => {
                    try
                    {
                        var selectedValue = selection?.Value != null
                                    ? Convert.ToInt32(selection.Value)
                                    : dbContext.Grants.Select(x => x.StartDate)
                                                    .OrderByDescending(x => x)
                                                    .First().Year;

                        var data = await dbContext
                                        .Grants
                                        .Where(x => x.StartDate.Year == selectedValue)
                                        .ToListAsync();

                        return [.. data.Select(x =>
                                            new SelectOption { Id = x.Id, Text = x.Name, Selected = false })];
                    }
                    catch (Exception ex)
                    {

                        Console.WriteLine(ex.Message);
                        return null;
                    }

                }
            }
        };

        public async Task<List<SelectOption>?> GetDropdownValues(string parameterName, bool showAllOption, string? selectedValue = null)
        {



            var options = await values[parameterName](selectedValue == null
                    ? null
                    : new Selection { Value = selectedValue });

            if (showAllOption && options != null)
            {
                options.Insert(0, new SelectOption { Id = 0, Selected = true, Text = "All" });
            }

            return options;
        }
    }
}