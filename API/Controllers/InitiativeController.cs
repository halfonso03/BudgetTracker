using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class InitiativeController(IInitiativeService _initiativeService) : BaseApiController
    {
        public async Task<IActionResult> Get()
        {
            var inits = await _initiativeService.GetInitiatives();

            return Ok(inits);
        }
    }
}