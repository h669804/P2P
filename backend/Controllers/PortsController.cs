using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AppProject.Data;
using AppProject.Models;

namespace AppProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PortsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PortsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Henter alle havner i systemet.
        /// </summary>
        /// <returns>Alle havner i systemet</returns> 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Port>>> GetPorts()
        {
            return await _context.Ports.ToListAsync();
        }

        /// <summary>
        ///  Henter en spesifikk havn basert på ID.
        /// </summary>
        /// <param name="id">id</param>
        /// <returns>Havn med gitt id</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Port>> GetPort(int id)
        {
            var port = await _context.Ports.FindAsync(id);
            if (port == null)
            {
                return NotFound();
            }
            return port;
        }

        /// <summary>
        /// Oppretter en ny havn.
        /// </summary>
        /// <param name="port">Havn informasjon</param>
        /// <returns>svar på sukseè eller ikke</returns> 
        [HttpPost]
        public async Task<ActionResult<Port>> CreatePort(Port port)
        {
            _context.Ports.Add(port);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPort), new { id = port.PortID }, port);
        }

        /// <summary>
        /// Oppdaterer en eksisterende havn.
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="port">Havn som skal endres</param>
        /// <returns>Svar på sukseè eller ikke</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePort(int id, Port port)
        {
            if (id != port.PortID)
            {
                return BadRequest();
            }

            _context.Entry(port).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Ports.Any(e => e.PortID == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        /// <summary>
        /// Sletter en eksisterende havn.
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns>Svar på sukseè eller ikke</returns> 
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePort(int id)
        {
            var port = await _context.Ports.FindAsync(id);
            if (port == null)
            {
                return NotFound();
            }

            _context.Ports.Remove(port);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}