using Persistence;

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
                if (ItemType == Globals.ITEM_TYPE_BUDGET) return "Budget";
                if (ItemType == Globals.ITEM_TYPE_BUDGET) return "Reprogramming";
                if (ItemType == Globals.ITEM_TYPE_BUDGET) return "Disbursement";
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