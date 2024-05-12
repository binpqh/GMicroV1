using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Events;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("User")]
public class User : AggregateRoot, IAuditableEntity, ISoftDeletableEntity
{
    public User(string username, string fullname, string email, string passwordHash, 
        string role,string salt, string phoneNumber, string address) : base()
    {
        //Ensure.NotEmpty(groupId, "The groupId field is required.", nameof(groupId));
        //Ensure.NotEmpty(username, "The username field is required.", nameof(username));
        //Ensure.NotEmpty(fullname, "The full name field is required.", nameof(fullname));
        //Ensure.NotEmpty(email, "The email field is required.", nameof(email));
        //Ensure.NotEmpty(passwordHash, "The password field is required", nameof(passwordHash));
        //Ensure.NotEmpty(phoneNumber, "The phonenumber field is required.", nameof(phoneNumber));
        //Ensure.NotEmpty(phoneNumber, "The address field is required.", nameof(address));
        Username = username;
        Fullname = fullname;
        Email = email;
        Role = role;
        Address = address;
        PhoneNumber = phoneNumber;
        Password = passwordHash;
        Salt = salt;
    }


    public string? GroupId { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string Fullname { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string Salt { get; set; }
    public string Role { get; set; }
    public string Status { get; set; } = ActiveStatus.Active.ToString();
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedOn { get; set; }

    public static User Create(string groupId, string username, string fullname, string email, string role ,string passwordHash, string salt, string phoneNumber, string address)
    {
        var user = new User(username, fullname, email,passwordHash,role ,salt, phoneNumber, address)
        {
            GroupId = groupId
        };
        user.AddDomainEvent(new UserCreatedDomainEvent(user));

        return user;
    }
}
