namespace LiveStreamAPI6.Dtos
{
    public class CommentDto
    {
        public string RoomId { get; set; }
        public string Username { get; set; }
        public string NoiDung { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public string DisplayName { get; set; }
    }
}
