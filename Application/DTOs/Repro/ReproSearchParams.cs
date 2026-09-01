using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ReproSearchParams
    {
        public required int Year { get; set; }
        [JsonPropertyName("initiativeIds")]
        public List<int>? InitiativeIds { get; set; } = [];
        public List<int>? GrantIds { get; set; } = [];
        public List<int>? AccountIds { get; set; } = [];
        public ReproSearchStatus Status { get; set; }
    }


    public enum ReproSearchStatus
    {
        ALL,
        SAVED,
        POSTED
    }

    public class IdSearch
    {
        public int Id { get; set; }
    }
}