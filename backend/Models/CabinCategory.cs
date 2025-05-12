using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace AppProject.Models
{
    [Table("cabin_categories", Schema = "mobileapp")]
    public class CabinCategory
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("image_path")]
        public string ImagePath { get; set; }

        [Column("description")]
        public string Description { get; set; }

        public List<CabinOption> Options { get; set; }
    }
}
