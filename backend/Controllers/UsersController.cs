using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppProject.Data;
using AppProject.Models;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace AppProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Henter alle brukere i systemet.
        /// </summary>
        /// <returns>Liste med alle brukere i systemet</returns> 
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            // Return users without passwords
            return users.Select(u => new UserDto
            {
                UserID = u.UserId,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                CreatedAt = u.CreatedAt
            }).ToList();
        }
        /// <summary>
        /// Henter en spesifikk bruker basert på ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Bruker med gitt id</returns> 
        /// <remarks>kreves authentication</remarks> 
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            // Return user without password
            return new UserDto
            {
                UserID = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }

        /// <summary>
        /// Henter brukerens profil basert på token.
        /// Tokenet må inneholde brukerens ID i claims.
        /// </summary>
        /// <returns>bruker profil basert på token.</returns> 
        /// <remarks>kreves authentication</remarks>
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            // Get user id from the token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Invalid token");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return new UserDto
            {
                UserID = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }

        /// <summary>
        /// Registrerer en ny bruker.
        /// </summary>
        /// <param name="registerDto">Brukerinput</param>
        /// <returns>Ny registereringsDto</returns> 
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> RegisterUser(RegisterUserDto registerDto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("Email is already registered");
            }

            // Create user entity
            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                Password = HashPassword(registerDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Return user without password
            return CreatedAtAction(
                nameof(GetUser),
                new { id = user.UserId },
                new UserDto
                {
                    UserID = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt
                });
        }

        /// <summary>
        ///  Logger inn en bruker.
        /// </summary>
        /// <param name="loginDto">Login Credidentials</param>
        /// <returns>"Respons for forsøket</returns>
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !VerifyPassword(loginDto.Password, user.Password))
            {
                return Unauthorized("Invalid email or password");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Return user info and token
            return new LoginResponseDto
            {
                User = new UserDto
                {
                    UserID = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt
                },
                Token = token
            };
        }

        /// <summary>
        /// Oppdaterer en bruker.
        /// Krever at brukeren er logget inn og at de oppdaterer sin egen profil.
        /// </summary>
        /// <param name="id">Id til bruker</param>
        /// <param name="updateDto">Ny brukerinformasjon</param>
        /// <returns>Svar på sukseè eller ikke</returns>
        /// <remarks>kreves authentication</remarks>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateDto)
        {
            // Check if current user is updating their own profile
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId) || userId != id)
            {
                return Forbid("You can only update your own profile");
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            // Update user properties
            user.FirstName = updateDto.FirstName ?? user.FirstName;
            user.LastName = updateDto.LastName ?? user.LastName;

            // Only update email if it's provided and different
            if (!string.IsNullOrEmpty(updateDto.Email) && updateDto.Email != user.Email)
            {
                // Check if the new email is already taken by another user
                if (await _context.Users.AnyAsync(u => u.Email == updateDto.Email && u.UserId != id))
                {
                    return BadRequest("Email is already registered to another user");
                }
                user.Email = updateDto.Email;
            }

            // Update password if provided
            if (!string.IsNullOrEmpty(updateDto.Password))
            {
                user.Password = HashPassword(updateDto.Password);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Users.Any(e => e.UserId == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        /// <summary>
        /// Sletter en bruker.
        /// </summary>
        /// <param name="id">BrukerId</param>
        /// <returns>Svar på sukseè eller ikke</returns> 
        /// <remarks>kreves authentication</remarks>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(int id)
        {
            // Check if current user is deleting their own profile
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId) || userId != id)
            {
                return Forbid("You can only delete your own profile");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        #region Helper Methods

        /// <summary>
        /// Genererer en JWT token for brukeren.
        /// </summary>
        /// <param name="user">Bruker</param>
        /// <returns>String</returns>
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured")));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        ///  Hashing av passordet.
        /// </summary>
        /// <param name="password">Encodet passord</param>
        /// <returns>String med hashet passord</returns>
        /// <remarks>SHA256</remarks>
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        /// <summary>
        ///  Verifiserer passordet.
        /// </summary>
        /// <param name="password"> passord</param>
        /// <param name="hashedPassword">Hashet passord</param>
        /// <returns>Boolean</returns>
        private bool VerifyPassword(string password, string hashedPassword)
        {
            var hashedInputPassword = HashPassword(password);
            return hashedInputPassword == hashedPassword;
        }

        #endregion
    }

    #region DTOs


    #endregion
}