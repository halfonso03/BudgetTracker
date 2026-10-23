// Controllers/UsersController.cs
using API.Controllers;
using Application.DTOs.Users;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
public class UsersController : BaseApiController
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<ActionResult<CreateUserResponseDto>> CreateUser([FromBody] CreateUserRequestDto request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        var response = new CreateUserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email!
        };

        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UpdateUserResponseDto>> UpdateUser(string id, [FromBody] UpdateUserRequestDto request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Email = request.Email;
        user.UserName = request.Email; // Keep username aligned with email if required

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        var response = new UpdateUserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email!
        };

        return Ok(response);
    }

    // Helper method for CreatedAtAction routing
    [HttpGet("{id}", Name = "GetUserById")]
    public async Task<ActionResult<UpdateUserResponseDto>> GetUserById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        return Ok(new UpdateUserResponseDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email!
        });
    }


    // Inside Controllers/UsersController.cs

    [HttpPost("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(string id, [FromBody] ResetPasswordRequestDto request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        // 1. Remove the old password (bypasses requirement for knowing the old password)
        var removePasswordResult = await _userManager.RemovePasswordAsync(user);
        if (!removePasswordResult.Succeeded)
        {
            foreach (var error in removePasswordResult.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        // 2. Add the new password provided by the admin
        var addPasswordResult = await _userManager.AddPasswordAsync(user, request.NewPassword);
        if (!addPasswordResult.Succeeded)
        {
            foreach (var error in addPasswordResult.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        // 3. Handle "Force Password Reset on Next Login" flag if implemented
        user.ForcePasswordChangeOnNextLogin = request.ForcePasswordChangeOnNextLogin;
        await _userManager.UpdateAsync(user);

        // Optional: Revoke current login sessions/tokens if using Refresh Tokens

        return Ok(new { message = "Password has been successfully reset." });
    }


    // Inside Controllers/UsersController.cs

    [HttpPatch("{id}/lockout")]
    public async Task<IActionResult> ToggleLockout(string id, [FromBody] ToggleLockoutRequestDto request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        // Ensure lockout is enabled for this user
        if (!await _userManager.GetLockoutEnabledAsync(user))
        {
            var enableLockoutResult = await _userManager.SetLockoutEnabledAsync(user, true);
            if (!enableLockoutResult.Succeeded)
            {
                foreach (var error in enableLockoutResult.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem(ModelState);
            }
        }

        // Set lockout end date: Far future for locking, null for unlocking
        DateTimeOffset? lockoutEnd = request.IsLocked
            ? DateTimeOffset.UtcNow.AddYears(100)
            : null;

        var result = await _userManager.SetLockoutEndDateAsync(user, lockoutEnd);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        var actionMessage = request.IsLocked ? "locked" : "unlocked";
        return Ok(new { message = $"User has been successfully {actionMessage}." });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserListItemDto>>> GetUsers()
    {
        var users = await _userManager.Users.ToListAsync();

        var userDtos = users.Select(u => new UserListItemDto
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.Email ?? string.Empty,
            LastLoginDate = u.LastLoginDate,
            IsLockoutEnabled = u.LockoutEnabled,
            AccessFailedCount = u.AccessFailedCount
        }).ToList();

        return Ok(userDtos);
    }
}