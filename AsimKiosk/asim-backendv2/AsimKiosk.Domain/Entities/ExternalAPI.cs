using AsimKiosk.Domain.Core.Abstractions;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace AsimKiosk.Domain.Entities;

[Table("ExternalAPI")]
public class ExternalAPI(string owner, string name, int requestType, int methodType, string baseUrl, string example)
    : AggregateRoot, IAuditableEntity
{
    public string Owner { get; set; } = owner;
    public string NameAPI { get; set; } = name;
    public RequestType RequestType { get; set; } = (RequestType)requestType;
    public MethodType Method { get; set; } = (MethodType)methodType;
    public bool IsPaymentAPI { get; set; } = false;
    public string BaseUrl { get; set; } = baseUrl;
    public string Example { get; set; } = example;
    public DateTime? ModifiedOn { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public static ExternalAPI Create(string owner, string name, int requestType, int methodType, string baseUrl, string example)
    {
        var endpoint = new ExternalAPI(owner, name, requestType, methodType, baseUrl, example);
        return endpoint;
    }
}