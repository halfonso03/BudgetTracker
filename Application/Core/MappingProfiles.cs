using Application.DTOs.Payees;
using Application.DTOs.Vendors;
using AutoMapper;
using Domain.Views;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<VendorSummary, VendorSearchPayeeResponseDto>();
        }
    }
}