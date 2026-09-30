using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoryController(ICategoryService _categoryService) : BaseApiController
    {
        [HttpGet()]
        public async Task<IActionResult> GetCategoriesAndAccounts()
        {
            return Ok(await _categoryService.GetCategoriesAndAccounts());
        }

        [HttpGet("{categoryId}")]
        public async Task<IActionResult> GetCategoriesAndAccounts(int categoryId)
        {
            return Ok(await _categoryService.GetAccountsForCategories(categoryId));
        }
    }
}