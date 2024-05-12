namespace AsimKiosk.Contracts.User
{
    public class UserResponse
    {
        public string Id { get; set; } = null!;
        public string GroupId { get; set; } = null!;
        public string GroupName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string ActiveStatus { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string Role { get; set; } = null!;
        public DateTime ModifiedOnUtc { get; set; }
    }
    public class UserGroupResponse
    {
        public string Id { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string FullName { get; set; } = null!;
    }
    public class GetMeResponse
    {
        public string Id { get; set; } = null!;
        public string GroupName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string FullName { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}