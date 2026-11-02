namespace Application.DTOs.Payment
{
    public class CreatePaymentResponseDto
    {
        public required int NewId { get; set; }
        public required List<int> RowIds { get; set; }
        public static CreatePaymentResponseDto Create(int newId, List<int> rowsIds) => new()
        {
            NewId = newId,
            RowIds = rowsIds
        };
    }
}