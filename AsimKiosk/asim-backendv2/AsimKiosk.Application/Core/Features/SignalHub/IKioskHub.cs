using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Features.SignalHub;

public interface IKioskHub
{
    Task InvokeReboot(string deviceId);
    Task InacitveKiosk(string deviceId);
    Task NotifyResultTransaction(string deviceId, string orderCode, string transactionNumber, bool isSuccess);
    Task SendSecretKey(string deviceId);
    Task SendSecretKeyV2(string deviceId, string secret);
    Task OpenLockAsync(string deviceId);
    Task NotifyTicketAysnc(string? groupId,Domain.Entities.Notification whTicketId);
    Task NotifyPaymentConfigAysnc(Domain.Entities.Notification whTicketId);
    Task NotifyLocalSimConfigAysnc(Domain.Entities.Notification whTicketId);
    Task NotifyTicketAssignedAysnc(string userId, Domain.Entities.Notification whTicketId);
    Task NotifyBannerAdded(Domain.Entities.Notification notification);
    Task ReactiveKioskAsync(string deviceId);
    Task RefreshKioskAsync(string deviceId);
}
