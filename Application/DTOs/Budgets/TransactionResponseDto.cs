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
                if (ItemType == Globals.ITEM_TYPE_BUDGET) return "Allocated";
                if (ItemType == Globals.ITEM_TYPE_REPRO) return "Reprogramming";
                if (ItemType == Globals.ITEM_TYPE_PAYMENT) return PayeeName ?? "";
                return "";
            }
        }
        public string? PayeeName { get; set; }
        public required DateTime PostedDate { get; set; }
        public required decimal Amount { get; set; } = 0;
        public static TransactionResponseDto Create(int id, string itemType, DateTime postedDate, decimal amount, string payeeName = "")
        {
            return new TransactionResponseDto
            {
                Id = id,
                Amount = amount,
                PostedDate = postedDate,
                ItemType = itemType,
                PayeeName = payeeName
            };
        }
    }
}