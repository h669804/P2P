using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
namespace AppProject.Models
{
    [Table("bookings", Schema = "mobileapp")]
    public class Booking
    {
        [Column("bookingid")]
        public int BookingID {get; set; }
        [Column("passengerid")]
        public int PassengerID {get; set; }
        [Column("routeid")]
        public int RouteID {get; set; }
        [Column("tickets")]
        public int Tickets {get; set; }
        [Column("price")]
        public double Price {get; set; }
        [Column("bookingdate")]
        public DateTime BookingDate {get; set; }

    }
}