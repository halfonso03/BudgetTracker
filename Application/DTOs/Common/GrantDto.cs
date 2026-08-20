using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Application.DTOs.Common
{
    public class GrantDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public int Year => StartDate.Year;
        public required string Fiduciary { get; set; }

        public static GrantDto Create(int id, string name, DateTime startDate, DateTime endDate, string fiduciary)
        {
            return new GrantDto
            {
                Id = id,
                Name = name,
                StartDate = startDate,
                EndDate = endDate,
                Fiduciary = fiduciary
            };
        }
    }
}