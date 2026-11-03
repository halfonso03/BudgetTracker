namespace Application.DTOs.Payment
{
    public class PaymentResponseBaseDto
    {
        public required int NewId { get; set; }
        public required List<int> RowIds { get; set; }
        public required List<int> PaymentNumbers { get; set; }      
    }
}