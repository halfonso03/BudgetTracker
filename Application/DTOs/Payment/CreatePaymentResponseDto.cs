namespace Application.DTOs.Payment
{
    public class CreatePaymentResponseDto : PaymentResponseBaseDto
    {
        public static CreatePaymentResponseDto Create(int newId, List<int> rowsIds, List<int> paymentNumbers) => new()
        {
            NewId = newId,
            RowIds = rowsIds,
            PaymentNumbers = paymentNumbers
        };
    }
}