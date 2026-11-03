namespace Application.DTOs.Payment
{
    public class UpdatePaymentResponseDto : PaymentResponseBaseDto
    {
          public static UpdatePaymentResponseDto Create(int newId, List<int> rowsIds, List<int> paymentNumbers) => new()
        {
            NewId = newId,
            RowIds = rowsIds,
            PaymentNumbers = paymentNumbers
        };
    }
}