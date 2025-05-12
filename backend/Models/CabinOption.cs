using System.ComponentModel.DataAnnotations.Schema;

namespace AppProject.Models
{
    [Table("cabin_options", Schema = "mobileapp")]
    public class CabinOption
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("category_id")]
        public int CabinCategoryId { get; set; }

        [Column("type")]
        public string Type { get; set; }

        [Column("price")]
        public int Price { get; set; }

        public CabinCategory CabinCategory { get; set; }
    }
}
