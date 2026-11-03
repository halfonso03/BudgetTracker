namespace Application.DTOs.Payment
{
    public class UpdatePaymentResponseDto
    {
        public required int NewId { get; set; }
        public required List<int> RowIds { get; set; }
        public required List<int> PaymentNumbers { get; set; }
        public static UpdatePaymentResponseDto Create(int newId, List<int> rowsIds, List<int> paymentNumbers) => new()
        {
            NewId = newId,
            RowIds = rowsIds,
            PaymentNumbers = paymentNumbers
        };
    }
}