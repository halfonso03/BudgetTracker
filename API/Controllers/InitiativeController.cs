using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InitiativeController (IInitiativeService _initiativeService) : ControllerBase
    {
        public async Task<IActionResult> Get()
        {
            var inits = await _initiativeService.GetInitiatives();

            return Ok(inits);
        }
    }
}