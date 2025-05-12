using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppProject.Data;
using AppProject.Models;

namespace AppProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CabinsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CabinsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Henter alle kabiner i systemet.
        /// </summary>
        /// <returns>Alle kabiner i systemet</returns> 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CabinDto>>> GetCabins()
        {
            var cabins = await _context.CabinCategories
                .Include(c => c.Options)
                .Select(c => new CabinDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ImagePath = c.ImagePath,
                    Description = c.Description,
                    Options = c.Options.Select(o => new CabinOptionDto
                    {
                        Type = o.Type,
                        Price = o.Price
                    }).ToList()
                })
                .ToListAsync();

            return Ok(cabins);
        }

        /// <summary>
        ///  Henter en spesifikk kabin basert på ID.
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>Kabin med gitt id</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<CabinDto>> GetCabin(int id)
        {
            var cabin = await _context.CabinCategories
                .Include(c => c.Options)
                .Where(c => c.Id == id)
                .Select(c => new CabinDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ImagePath = c.ImagePath,
                    Description = c.Description,
                    Options = c.Options.Select(o => new CabinOptionDto
                    {
                        Type = o.Type,
                        Price = o.Price
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (cabin == null)
                return NotFound();

            return Ok(cabin);
        }
    }
}
