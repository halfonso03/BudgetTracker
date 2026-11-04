
namespace Application.DTOs.Payment
{
    public class PaymentSearchParams
    {
        public PaymentSearchStatus Status { get; set; }
        public required int Year { get; set; }
        // public List<PaymentSearchBudgetHeader>? PaymentSearchBudgetHeaders { get; set; } = null;
    }


    public class PaymentSearchBudgetHeader
    {
        public int InitiativeId { get; set; }
        public int GrantId { get; set; }
        public int AccountId { get; set; }

        public override string ToString()
        {
            return $"{InitiativeId} {GrantId} {AccountId}";
        }
    }

    public enum PaymentSearchStatus
    {
        ALL = 0,
        SAVED,
        POSTED
    }

    // public enum AmountComparer
    // {
    //     None,
    //     GreaterThan,
    //     LessThan,
    //     EqualTo
    // }


}