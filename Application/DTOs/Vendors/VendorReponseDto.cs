using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.DTOs.Vendors
{
    public class VendorReponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public int AccountId { get; set; }
        public bool IsActive { get; set; }

        public static VendorReponseDto Create(int id, string name, int accountId, bool isActive)
        {
            return new VendorReponseDto
            {
                Id = id,
                Name = name,
                AccountId = accountId,
                IsActive = isActive
            };
        }
    }
}