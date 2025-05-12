using System.ComponentModel.DataAnnotations.Schema;
namespace AppProject.Models
{
    [Table("ports", Schema = "mobileapp")]
    public class Port
    {
        [Column("portid")]
        public int PortID { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("location")]
        public string? Location { get; set; }
    }
}