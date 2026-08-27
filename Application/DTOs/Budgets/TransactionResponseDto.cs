namespace Application.DTOs.Budgets
{
    public class TransactionResponseDto
    {
        public required int Id { get; set; }
        public required string ItemType { get; set; }
        public string TypeName
        {
            get
            {
                if (ItemType == "B") return "Budget";
                if (ItemType == "R") return "Reprogramming";
                if (ItemType == "D") return "Disbursement";
                return "";
            }
        }
        public required DateTime PostedDate { get; set; }
        public required decimal Amount { get; set; } = 0;
        public static TransactionResponseDto Create(int id, string itemType, DateTime postedDate, decimal amount)
        {
            return new TransactionResponseDto
            {
                Id = id,
                Amount = amount,
                PostedDate = postedDate,
                ItemType = itemType
            };
        }
    }
}