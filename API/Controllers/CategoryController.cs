using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController(ICategoryService _categoryService) : ControllerBase
    {
        public async Task<IActionResult> GetCategoriesAndAccounts()
        {
            return Ok(await _categoryService.GetCategoriesAndAccounts());
        }
    }
}