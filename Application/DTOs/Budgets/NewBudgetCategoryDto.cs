namespace Application.DTOs.Budgets
{
    public class NewBudgetCategoryDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public List<NewBudgetAmountDto> Accounts { get; set; } = [];

        public static NewBudgetCategoryDto Create(int id, string name, List<NewBudgetAmountDto> accountDtos)
        {
            return new NewBudgetCategoryDto
            {
                Id = id,
                Name = name,
                Accounts = accountDtos
            };
        }
    }
}