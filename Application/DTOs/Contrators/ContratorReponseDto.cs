using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.DTOs.Vendors
{
    public class ContratorReponseDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Email { get; set; } = "";
        public int AccountId { get; set; }
        public bool IsActive { get; set; }

        public static ContratorReponseDto Create(int id, string firstName, string lastName, string email, int accountId, bool isActive)
        {
            return new ContratorReponseDto
            {
                Id = id,
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                AccountId = accountId,
                IsActive = isActive
            };
        }
    }
}