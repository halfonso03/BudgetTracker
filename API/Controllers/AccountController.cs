using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController(SignInManager<ApplicationUser> signInManager, RoleManager<ApplicationRole> roleManager, UserManager<ApplicationUser> userManager) : BaseApiController
    {

        [HttpPost("login-user")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 1. Find user by email
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Return a generic message to prevent user enumeration attacks
                return Unauthorized(new { message = "Invalid email or password." });
            }

            signInManager.AuthenticationScheme = IdentityConstants.ApplicationScheme;


            // 2. Check password and handle lockout policies securely via SignInManager

            // lockoutOnFailure: true protects against brute-force attacks
            var result = await signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                // 3. Return safe user data (avoid returning the raw EF Core entity with password hashes)


                var claimsPrincipal = await signInManager.CreateUserPrincipalAsync(user);

                // FIX: Configure cookie behavior explicitly so it persists across reloads
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true, // <-- Crucial! Tell the browser to save the cookie on disk, not just RAM
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60)
                };
    

                await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, claimsPrincipal, authProperties);

                var roles = await userManager.GetRolesAsync(user);

                var safeUserResponse = new UserLoginResponseDto
                {
                    Id = user.Id,
                    Email = user!.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = [.. roles]
                };

                return Ok(safeUserResponse);
            }

            if (result.IsLockedOut)
            {
                return StatusCode(StatusCodes.Status423Locked, new { message = "Account locked out due to multiple failed login attempts. Please try again later." });
            }

            if (result.IsNotAllowed)
            {
                return Unauthorized(new { message = "Sign in is not allowed. Please confirm your email." });
            }

            // Default fallback for incorrect password
            return Unauthorized(new { message = "Invalid email or password." });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new ApplicationUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName
            };

            var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                // await SendConfirmationEmailAsync(user, registerDto.Email);

                return Ok();
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        // [HttpGet("me")]
        // public IActionResult GetCurrentUser()
        // {
        //     return Ok(new { Username = User!.Identity!.Name });
        // }

        [HttpGet("user-info")]
        public async Task<ActionResult<UserInfoResponseDto>> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            var roles = await userManager.GetRolesAsync(user);

            return Ok(new UserInfoResponseDto
            {
                Email = user.Email!,
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = [.. roles]
            });
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();

            return NoContent();
        }

        [HttpPost("addRoles")]
        [AllowAnonymous]
        public async Task<ActionResult> Admin()
        {
            var user = await signInManager.UserManager.GetUserAsync(User);

            var role = await roleManager.FindByNameAsync("ADMIN");
            if (role == null)
            {

            }


            return NoContent();
        }
    }
}