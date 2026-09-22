using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Identity.Client;

namespace Application.DTOs.Repro
{
    public class ReproDuplicateRequestDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public override string ToString()
        {
            return Id.ToString() + " " + UserId.ToString();
        }
    }
}