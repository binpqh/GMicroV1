namespace AsimKiosk.Contracts.User.Authentication
{
    public class RegisterResponse
    {
        public string GroupName { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Fullname { get; set; } = null!;
    }
}