using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs.Reporting
{
    public class SelectOption
    {
        public int Id { get; set; }
        public required string Text { get; set; }
        public required bool Selected { get; set; }
    }
}