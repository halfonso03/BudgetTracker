using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.Common;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GrantController(IGrantService _grantService) : ControllerBase
    {

        [HttpGet("{year}")]
        public async Task<IActionResult> Get(int year)
        {
            var grants = await _grantService.GetGrants(year);

            return Ok(grants);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            List<GrantDto> grants = await _grantService.GetAllGrants();

            return Ok(grants);
        }
    }
}