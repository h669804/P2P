using System.ComponentModel.DataAnnotations.Schema;
namespace AppProject.Models
{
    [Table("passengers", Schema = "mobileapp")]
    public class Passenger
    {
        [Column("passengerid")]
        public int PassengerID {get; set; }
        [Column("name")]
        public string Name {get; set; }
        [Column("email")]
        public string Email {get; set; }
        [Column("phone")]
        public string phone {get; set; }
    }
}