using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppProject.Data;
using AppProject.Models;

namespace AppProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShipsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShipsController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ship>>> GetShips()
        {
            return await _context.Ships.ToListAsync();
        }

        /// <summary>
        /// Henter en spesifikk båt basert på ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>båt med gitt id</returns> 

        [HttpGet("{id}")]
        public async Task<ActionResult<Ship>> GetShip(int id)
        {
            var ship = await _context.Ships.FindAsync(id);
            if (ship == null)
            {
                return NotFound();
            }
            return ship;
        }
    }
}