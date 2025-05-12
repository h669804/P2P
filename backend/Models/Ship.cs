using System.ComponentModel.DataAnnotations.Schema;
namespace AppProject.Models
{
    [Table("ships", Schema = "mobileapp")]
    public class Ship{
        [Column("shipid")]
        public int ShipID {get; set; }
       [Column("name")]
        public string Name {get; set; }
        [Column("capacity")]
        public int capacity {get; set; }
    }
}