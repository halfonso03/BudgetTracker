using Application.DTOs.Reporting;

namespace Application.Interfaces
{
    public interface IReportParameterValuesService
    {
        Task<List<SelectOption>?> GetDropdownValues(string parameterName, bool showAllOption, string? selectedValue = null);
    }
}