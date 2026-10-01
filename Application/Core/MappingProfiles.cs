using Application.DTOs.Payees;
using AutoMapper;
using Domain.Views;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<PayeeSummary, PayeeSearchPayeeResponseDto>();
        }
    }
}