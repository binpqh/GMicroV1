using System.ComponentModel.DataAnnotations.Schema;
using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Events;

namespace AsimKiosk.Domain.Entities;

[Table("LocalSimConfig")]
public class LocalSimConfig : AggregateRoot , ISoftDeletableEntity, IAuditableEntity
{
    public string UserName { get; set; } = string.Empty;//"vendertest@asimgroup.vn"; // username
    public string Password { get; set; } = string.Empty;//"Asim@2023";// password
    public string GrantType { get; set; } = string.Empty;//"password"; // grant_type
    public string ClientId { get; set; } = string.Empty;//"vender-tgdd"; // client_id
    public string ClientSecret { get; set; } = string.Empty;//"3cfece07-4371-4f96-8a29-3cd80a230f7d"; // client_secret
    public string Scope { get; set; } = string.Empty;//"openid"; // scope
    public string Realm { get; set; } = string.Empty;//"LocalShop"; // realm
    public string AuthUrl { get; set; } = string.Empty;
    public string BussUrl { get; set; } = string.Empty;
    public string Status { get; set; } = ActiveStatus.Inactive.ToString();
    public string GroupId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedOn { get; set;}
    public DateTime? ModifiedOn { get; set; }
    public LocalSimConfig Create(LocalSimConfig localSimConfig, string createBy)
    {
        localSimConfig.AddDomainEvent(new LocalSimAPICreatedDomainEvent(localSimConfig,createBy));
        return localSimConfig;
    }
    public void Update(LocalSimConfig localSimConfig, string updateBy)
    {
        localSimConfig.AddDomainEvent(new LocalSimAPIUpdatedDomainEvent(localSimConfig, updateBy));
    }
}