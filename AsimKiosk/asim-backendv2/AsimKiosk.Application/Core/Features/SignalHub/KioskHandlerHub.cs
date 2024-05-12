using AsimKiosk.Application.Core.Features.SignalHub.Command.ProvideSecretKeyForKiosk;
using AsimKiosk.Application.Core.Features.Users.Queries.GetUserById;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.ValueObject;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using AsimKiosk.Application.Core.Features.SignalHub.Command.LogProcessOrder;
using AsimKiosk.Application.Core.Features.KioskApplication.Command.LogErrorAPIForKioskApp;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using AsimKiosk.Application.Core.Features.SignalHub.Query.GetKioskByDeviceId;
using AsimKiosk.Application.Core.Features.LogPeripherals.Command.CreateLogPrinter;
using AsimKiosk.Contracts.LogPeripherals;
using AsimKiosk.Application.Core.Features.SignalHub.Command.ProcessOutCard;
using AsimKiosk.Application.Core.Features.SignalHub.Command.OrderFailure;
using AsimKiosk.Application.Core.Features.Payment.Command.PaymentSucceed;
using AsimKiosk.Domain.Entities;
using static AsimKiosk.Domain.Core.Errors.DomainErrors;

namespace AsimKiosk.Application.Core.Features.SignalHub;
public class KioskHub(IMediator mediator, ILogger<KioskHub> logger) : Hub, IKioskHub
{
    private static void TimerCallback(string connectionId)
    {
        var currentClient = _anonymousClients.FirstOrDefault(e => e.ConnectionId == connectionId);
        if (currentClient != null)
        {
            currentClient.Abort();
            _anonymousClients.Remove(currentClient);
        }
    }

    /// <summary>
    /// List contains information's kiosk has connected.
    /// </summary>
    // private readonly List<ClientInfo> _listDeviceInfo = []; //HubCallerContext
    private static readonly List<HubCallerContext> _anonymousClients = [];
    private static readonly ConcurrentDictionary<string, ClientInfo> _clientContexts = new();

    public override async Task OnConnectedAsync()
    {
        var queries = Context.GetHttpContext().Request.Query;
        var deviceId = queries["deviceId"].ToString().Trim();
        var userId = queries["userId"].ToString().Trim();
        bool isKiosk = false;
        bool isMonitor = false;
        // monitor
        if (!string.IsNullOrEmpty(userId))
        {
            var result = await HandleUserConnection(userId);
            if (result)
            {
                logger.LogInformation($"Client {Context.ConnectionId} connected! with user {userId}");
                isMonitor = true;
            }
        }
        // device
        else
        {
            isKiosk = true;
            await HandleDeviceConnection(deviceId);
        }


        if (isKiosk || isMonitor)
        {
            await base.OnConnectedAsync();
            return;
        }

        Context.Abort();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var allContext = _clientContexts.Select(e =>
        {
            return new
            {
                ConnectionId = e.Value.Context.ConnectionId,
                DeviceId = e.Key
            };
        }).ToList();

        var client = allContext.FirstOrDefault(e => e.ConnectionId == Context.ConnectionId);
        if (client != null)
        {
            _clientContexts.TryRemove(client.DeviceId, out ClientInfo? deviceInfo);
            logger.LogInformation("[KIOSK HUB] Removed connection with device " + client.DeviceId);

            if (deviceInfo != null && deviceInfo.IsKiosk)
            {
                if (!string.IsNullOrEmpty(deviceInfo.GroupId))
                {
                    // await Clients
                    //     .Group(deviceInfo.GroupId)
                    //     .SendAsync("receiveKiosksOnline", GetKiosksInGroup(deviceInfo.GroupId));
                    _ = SendEventToGroupAsync(
                         deviceInfo.GroupId,
                         "receiveKiosksOnline", GetKiosksInGroup(deviceInfo.GroupId) ?? []
                         );
                }
                // await Clients.Group("Admin").SendAsync("receiveKiosksOnline", GetKiosks());
                _ = SendEventToGroupAsync(
                      "Admin",
                      "receiveKiosksOnline", GetKiosks() ?? []
                      );
            }
        }

        await base.OnDisconnectedAsync(exception);
        logger.LogInformation($"[KIOSK HUB] Client {Context.ConnectionId} Disconnected!");
    }

    #region HubMethod
    public async Task RefreshKioskAsync(string deviceId)
    {
        _clientContexts.TryGetValue(deviceId, out ClientInfo? clientInfo);
        if (clientInfo is not null)
        {
            await clientInfo.Client.SendAsync("onRefresh");
        }
    }
    public async Task InvokeWorkingStateKioskAsync(string deviceId, WorkingState state)
    {
        logger.LogInformation($"[KIOSK]: {deviceId}, WorkingState {state.ToString()}");
        _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
        if (deviceInfo is not null)
        {
            deviceInfo.State = state;
            if (_clientContexts.TryUpdate(deviceId, deviceInfo, deviceInfo))
            {
                if (GetCurrentAdminConnectedAsync())
                {
                    await SendKioskOnlineToGroup("Admin");
                };
                GetCurrentUserInGroupConnectedAsync().ForEach(async groupId =>
                {
                    await SendKioskOnlineToGroup(groupId);
                });
            }
        }
    }
    private async Task SendKioskOnlineToGroup(string groupId)
    {
        if (groupId == "Admin")
        {
            await Clients
                    .Group(groupId)
                    .SendAsync("receiveKiosksOnline", GetKiosks());
        }
        else
        {
            var res = GetKiosksInGroup(groupId);
            if (res is not null && res.Count > 0)
            {
                await Clients
                        .Group(groupId)
                        .SendAsync("receiveKiosksOnline", res);
            }
        }
    }
    public async Task ReactiveKioskAsync(string deviceId)
    {
        _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
        if (deviceInfo != null)
        {
            await deviceInfo.Client.SendAsync("onActive");
            logger.LogInformation($"[Server invoke] Active kiosk : {deviceId}");
        }
    }
    public async Task ProcessOutCard(string orderCode, bool isSuccess, int currentSlot, string? serialNumber, bool isCompleted)
    {
        logger.LogInformation($"[Receive from kiosk app] Order code : {orderCode}, isSuccess {isSuccess}, Current Slot: {currentSlot}, Serial number :{serialNumber}, IsCompleted {isSuccess}");
        var res = await mediator.Send(new ProcessOutCardCommand(orderCode, isSuccess, currentSlot, serialNumber, isCompleted));
        logger.LogInformation($"[Handled success :{res.IsSuccess}] Order code : {orderCode}, isSuccess {isSuccess}, Current Slot: {currentSlot}, Serial number :{serialNumber}, IsCompleted {isSuccess}");
        if (res.IsFailure)
        {
            await mediator.Send(new LogAPICommand(new Contracts.LogAPI.LogAPIRequest
            {
                ErrorCodeFromServer = "ProcessOutCard failed",
                Desc = res.Error.Message,
                JsonData = $"SignalHub - Method : ProcessOutCard - Input : orderCode : {orderCode}, isSuccess : {isSuccess}, currentSlot: {currentSlot}, serialNumber : {serialNumber}, isCompleted : {isCompleted}"
            }));
        }
    }
    public async Task CancelOrder(string orderCode)
    {
        await mediator.Send(new OrderFailureCommand(orderCode));
    }
    public async Task AddOrderLog(OrderLogRequest req)
    {
        logger.LogInformation($"[KIOSK HUB] Add order log with order Id {req.orderCode}, extDevice {req.extDeviceCode}");

        var res = await mediator.Send(new LogProcessOrderCommand(req));

        if (res.IsFailure)
        {
            await mediator.Send(new LogAPICommand(new Contracts.LogAPI.LogAPIRequest
            {
                ErrorCodeFromServer = "Log process failed",
                Desc = res.Error.Message,
                JsonData = $"SignalHub - Method : AddOrderLog - Input : orderCode : {req.orderCode}, message : {req.message}, extDeviceCode : {req.extDeviceCode}"
            }));
        }
    }
    public async Task HandleErrorEvent(string deviceId, string errorCode)
    {
        if (errorCode == "LOWPAPER")
        {
            var logPhe = await mediator.Send(new CreateLogPrinterCommand(new LogPrinterRequest() { WarningPaper = true, DeviceId = deviceId }));
            if (logPhe.IsFailure)
            {
                await mediator.Send(new LogAPICommand(new Contracts.LogAPI.LogAPIRequest
                {
                    ErrorCodeFromServer = "Log process failed",
                    JsonData = $"SignalHub-Method : CreateTicket Error : KioskId : {deviceId},errorCode {errorCode} ",
                    Desc = "Error CreatetickecCommand"
                }));
            }
        }
        // var req = new MaintenanceRequest(errorCode, deviceId);
        // var res = await mediator.Send(new CreateTicketCommand(req));

    }
    public async Task SendSecretKey(string deviceId)
    {
        var result = await mediator.Send(new ProvideSecretKeyForKioskCommand(deviceId));
        if (result.IsSuccess)
        {
            _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
            if (deviceInfo is null)
            {
                logger.LogError("[KIOSK HUB] Not found kiosk with device id " + deviceId);
                return;
            }
            await deviceInfo.Client.SendAsync("onReceiveKey", result.Value);
            deviceInfo.IsApproved = true;
            var anonymousClient = _anonymousClients.FirstOrDefault(e => e.ConnectionId == deviceInfo.Context.ConnectionId);
            if (anonymousClient != null) _anonymousClients.Remove(anonymousClient);
        }
    }
    public async Task SendSecretKeyV2(string deviceId, string secret)
    {
        _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
        if (deviceInfo is null)
        {
            logger.LogError("[KIOSK HUB] Not found kiosk with device id " + secret);
            return;
        }
        await deviceInfo.Client.SendAsync("onReceiveKey", secret);
        deviceInfo.IsApproved = true;
        var anonymousClient = _anonymousClients.FirstOrDefault(e => e.ConnectionId == deviceInfo.Context.ConnectionId);
        if (anonymousClient != null) _anonymousClients.Remove(anonymousClient);
    }
    public async Task KioskOnline()
    {
        var userId = GetUserIdWithConnectionId();
        if (!string.IsNullOrEmpty(userId))
        {
            var user = await mediator.Send(new GetUserByIdQuery(userId));
            if (user.Value.Role == UserRole.Administrator.ToString())
            {
                await Clients
                    .Caller
                    .SendAsync("receiveKiosksOnline", GetKiosks());
            }
            else
            {
                await Clients
                    .Caller
                    .SendAsync("receiveKiosksOnline", GetKiosksInGroup(user.Value.GroupId));
            }
        }
    }
    public async Task InvokeReboot(string deviceId)
    {
        // await Clients.Client(GetConnectionIdWithDeviceId(deviceId)).SendAsync("onReboot");
        _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
        if (deviceInfo != null)
        {
            await deviceInfo.Client.SendAsync("onReboot");
            logger.LogInformation($"[Server invoke] Reboot kiosk : {deviceId}");
        }
    }
    public async Task NotifyResultTransaction(string deviceId, string orderCode, string transactionNumber, bool isSuccess)
    {
        var data = new { OrderCode = orderCode, IsSuccess = isSuccess, TransactionNumber = transactionNumber };
        var json = JsonSerializer.Serialize(data);
        _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
        //  logger.LogInformation($"[Server send Result transaction] Device ID : {deviceId}, Order code : {orderCode}, Transaction number : {transactionNumber}, Result : {isSuccess}");
        if (deviceInfo != null)
        {
            await deviceInfo.Client.SendAsync("notifyResultTransaction", json);
            logger.LogInformation($"[Server send Result transaction] Device ID : {deviceId}, Order code : {orderCode}, Transaction number : {transactionNumber}, Result : {isSuccess}");
        }
        if (!isSuccess)
        {
            await mediator.Send(new OrderFailureCommand(orderCode));
        }
        else
        {
            await mediator.Send(new PaymentSucceedCommand(orderCode));
        }
        // await Clients
        //     .Client(GetConnectionIdWithDeviceId(deviceId))
        //     .SendAsync("notifyResultTransaction", json);
    }
    public async Task NotifyPeripheralToMonitor(
        string deviceId,
        Dictionary<string, int> peripheralStatus
    )
    {
        var kiosk = await mediator.Send(new GetKioskByDeviceIdQuery(deviceId));
        string kioskName = kiosk.Value.Name ?? "Demo";
        var data = new
        {
            KioskName = kioskName,
            Peripheral = peripheralStatus
        };
        var json = JsonSerializer.Serialize(data);
        // await Clients.Group(kiosk.Value.GroupId).SendAsync("PeripheralStatus", json);
        _ = SendEventToGroupAsync<string?>(
                     kiosk.Value.GroupId,
                     "PeripheralStatus", json
                     );
        if (peripheralStatus.All(p => p.Value != 0))
        {
            // await Clients.Client(GetConnectionIdWithDeviceId(deviceId)).SendAsync("Maintaince");
            _clientContexts.TryGetValue(deviceId, out ClientInfo? hubCaller);
            if (hubCaller != null)
            {
                await hubCaller.Client.SendAsync("Maintaince");
            }
        }
    }

    public async Task NotifyInventoriesToMonitor(
        string deviceId,
        Dictionary<int, int> inventoriesStatus
    )
    {
        var kiosk = await mediator.Send(new GetKioskByDeviceIdQuery(deviceId));
        var data = new
        {
            KioskName = kiosk.Value.Name,
            Inventories = inventoriesStatus
        };
        var json = JsonSerializer.Serialize(data);
        // await Clients.Group(kiosk.Value.GroupId).SendAsync("InventoriesStatus", json);
        _ = SendEventToGroupAsync<string?>(
                    kiosk.Value.GroupId,
                    "InventoriesStatus", json
                    );
        if (inventoriesStatus.All(i => i.Value < 5))
        {
            // await Clients.Client(GetConnectionIdWithDeviceId(deviceId)).SendAsync("Maintaince");
            _clientContexts.TryGetValue(deviceId, out ClientInfo? hubCaller);
            if (hubCaller != null)
            {
                await hubCaller.Client.SendAsync("Maintaince");
            }
        }
    }
    public async Task OpenLockAsync(string deviceId)
    {
        _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
        if (deviceInfo != null)
        {
            await deviceInfo.Client.SendAsync("onOpenLock");
            logger.LogInformation($"[Server invoke Open lock action] Open locker for device : {deviceId}");
            return;
        }
        logger.LogWarning("Not found device {deviceId} to open lock ...", deviceId);
    }
    public async Task InacitveKiosk(string deviceId)
    {
        _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
        if (deviceInfo != null)
        {
            await deviceInfo.Client.SendAsync("onInactive");
            logger.LogInformation($"[Server invoke disable kiosk action] Disable kiosk with device ID: {deviceId}");
            return;
        }
    }
    #endregion

    #region HelperMethod
    private async Task<bool> HandleUserConnection(string userId)
    {
        _clientContexts.TryRemove(userId, out ClientInfo? hubCaller);
        if (hubCaller != null)
        {
            hubCaller.Context.Abort();
        }
        var user = await mediator.Send(new GetUserByIdQuery(userId));
        if (user.HasNoValue)
        {
            logger.LogWarning($"[Monitor Hub] Reject connection from user {userId}");
            return false;
        }
        switch (user.Value.Role)
        {
            case "Administrator":
                AddAdminToGroup(user.Value.Id, user.Value.UserName);
                return true;
            case "ManagerGroup":
                AddUserToGroup(user.Value.GroupName, userId, user.Value.Id);
                return true;
            case "User":
                if (!string.IsNullOrEmpty(user.Value.GroupName))
                {
                    AddUserToGroup(user.Value.GroupName, userId, user.Value.UserName);
                }
                else
                {
                    AddUserNoGroupToHub(user.Value.Id, user.Value.UserName);
                }
                return true;
            default:
                logger.LogWarning($"[Monitor Hub] Not found role from user {userId}");
                return false;
        }
    }
    private async Task HandleDeviceConnection(string deviceId)
    {
        _clientContexts.TryGetValue(deviceId, out ClientInfo? hubCaller);
        if (hubCaller != null)
        {
            logger.LogInformation($"[Kiosk Hub] Reject connection from other device with same id {deviceId}");
            Context.Abort();
            return;
        }

        var kiosk = await mediator.Send(new GetKioskByDeviceIdQuery(deviceId));
        int timeoutMilliseconds = 1000 * 60 * 1;
        var connectionId = Context.ConnectionId;
        if (kiosk.HasNoValue)
        {
            logger.LogInformation($"[Kiosk Hub] Not Found device with id {deviceId}");
            AddKioskToHub(deviceId);

            _anonymousClients.Add(Context);
            Timer timer = new Timer(state => TimerCallback(connectionId), null, timeoutMilliseconds, Timeout.Infinite);

        }
        else
        {
            bool isActive = kiosk.Value.Status == ActiveStatus.Active.ToString();
            logger.LogInformation($"[Kiosk Hub] Found device with id {deviceId} and status is {isActive}");
            AddKioskToGroup(string.IsNullOrEmpty(kiosk.Value.GroupId) ? "NoGroup" : kiosk.Value.GroupId, deviceId, kiosk.Value.Name, isActive);
            //If this kiosk has been actived before but it's client-ip changed we have to inactive it and approve it again.
            if (!isActive)
            {
                _anonymousClients.Add(Context);
                Timer timer = new Timer(state => TimerCallback(connectionId), null, timeoutMilliseconds, Timeout.Infinite);
            }
            if (isActive)
            {
                logger.LogInformation($"[Kiosk Hub] Send secret key to device {deviceId}");
                await SendSecretKey(deviceId);
            }
            // await Clients
            //     .Group(kiosk.Value.GroupId)
            //     .SendAsync("receiveKiosksOnline", GetKiosksInGroup(kiosk.Value.GroupId));
            _ = SendEventToGroupAsync(
                  kiosk.Value.GroupId,
                   "receiveKiosksOnline", GetKiosksInGroup(kiosk.Value.GroupId) ?? []
                   );
        }
        // await Clients.Group("Admin").SendAsync("receiveKiosksOnline", GetKiosks());
        _ = SendEventToGroupAsync("Admin", "receiveKiosksOnline", GetKiosks() ?? []);
    }

    // mấy cái hàm dưới này gộp lại viết gọn lại được mà  ?
    // chưa tới hôm siêng :v
    private void AddKioskToHub(string deviceId)
    {
        _clientContexts.TryAdd(deviceId,
            new ClientInfo
            {
                Id = deviceId,
                Context = Context,
                IsKiosk = true,
                Client = Clients.Client(Context.ConnectionId)
            }
        );
    }

    private void AddKioskToGroup(
        string? groupId,
        string deviceId,
        string kioskName,
        bool isApproved
    )
    {
        _clientContexts.TryAdd(deviceId,
            new ClientInfo
            {
                Id = deviceId,
                Name = kioskName,
                Context = Context,
                GroupId = groupId ?? "NoGroup",
                IsApproved = isApproved,
                IsKiosk = true,
                Client = Clients.Client(Context.ConnectionId)
            }
        );
        // await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
    }

    private void AddUserToGroup(string groupId, string userId, string userName)
    {
        _clientContexts.TryAdd(userId,
            new ClientInfo
            {
                Id = userId,
                Name = userName,
                Context = Context,
                GroupId = groupId,
                Client = Clients.Client(Context.ConnectionId)
            }
        );
        Groups.AddToGroupAsync(Context.ConnectionId, groupId);
    }

    private void AddUserNoGroupToHub(string userId, string userName)
    {
        _clientContexts.TryAdd(userId,
            new ClientInfo
            {
                GroupId = "NoGroup",
                Id = userId,
                Name = userName,
                Context = Context,
                Client = Clients.Client(Context.ConnectionId)
            }
        );
    }

    private void AddAdminToGroup(string userId, string userName)
    {
        _clientContexts.TryAdd(userId,
              new ClientInfo
              {
                  GroupId = "Admin",
                  Id = userId,
                  Name = userName,
                  Context = Context,
                  Client = Clients.Client(Context.ConnectionId)
              }
          );
        Groups.AddToGroupAsync(Context.ConnectionId, "Admin");
    }

    private string GetConnectionIdWithDeviceId(string deviceId)
    {
        _clientContexts.TryGetValue(deviceId, out ClientInfo? deviceInfo);
        return deviceInfo is null ? string.Empty : deviceInfo.Context.ConnectionId;
    }

    private string GetUserIdWithConnectionId()
        => _clientContexts.Values
                .Where(ld => ld.Context.ConnectionId == Context.ConnectionId && !ld.IsKiosk)
                .Select(ld => ld.Id)
                .FirstOrDefault(string.Empty);


    private List<KioskOnlineResponse>? GetKiosksInGroup(string groupId) =>
        _clientContexts.Values
            .Where(g => g.GroupId == groupId && g.IsKiosk)
            .Select(g => new KioskOnlineResponse { DeviceId = g.Id, IsApproved = g.IsApproved, State = g.State })
            .ToList();

    private List<KioskOnlineResponse>? GetKiosks() =>
        _clientContexts.Values
            .Where(g => g.IsKiosk)
            .Select(g => new KioskOnlineResponse { DeviceId = g.Id, IsApproved = g.IsApproved, State = g.State })
            .ToList();

    private static async Task SendEventToGroupAsync<T>(string groupName, string eventName, T body)
    {
        Task[] tasks = [];
        foreach (var item in _clientContexts.Where(e => e.Value.GroupId == groupName).ToArray())
        {
            Task task = item.Value.Client.SendAsync(eventName, body);
            _ = tasks.Append(task);
        }

        await Task.WhenAll(tasks);
    }
    private static async Task SendEventToUserAssignedAsync<T>(string userId, string eventName, T body)
    {
        Task[] tasks = [];
        foreach (var item in _clientContexts.Where(e => e.Value.Id == userId).ToArray())
        {
            Task task = item.Value.Client.SendAsync(eventName, body);
            _ = tasks.Append(task);
        }

        await Task.WhenAll(tasks);
    }

    private static async Task SendEventToGroupUserAsync<T>(string groupName, string eventName, T body)
    {
        Task[] tasks = [];
        foreach (var item in _clientContexts.Where(e => e.Value.GroupId == groupName && e.Value.IsKiosk == false).ToArray())
        {
            Task task = item.Value.Client.SendAsync(eventName, body);
            _ = tasks.Append(task);
        }

        await Task.WhenAll(tasks);
    }
    //Send to all user include administator
    private static async Task SendEventToEveryUserAsync<T>( string eventName, T body)
    {
        Task[] tasks = [];
        foreach (var item in _clientContexts.Where(e => e.Value.IsKiosk == false).ToArray())
        {
            Task task = item.Value.Client.SendAsync(eventName, body);
            _ = tasks.Append(task);
        }

        await Task.WhenAll(tasks);
    }
    private static bool GetCurrentAdminConnectedAsync()
    {
        //Author : Bin Pham
        return _clientContexts.Any(e => e.Value.IsKiosk == false && e.Value.GroupId == "Admin");
    }
    private static List<string> GetCurrentUserInGroupConnectedAsync()
    {
        //Author : Bin Pham
        return _clientContexts.DistinctBy(e => e.Value.GroupId).Where(e => e.Value.IsKiosk == false && !string.IsNullOrEmpty(e.Value.GroupId) && e.Value.GroupId != "Admin").Select(e => e.Value.GroupId).ToList();
    }

    public async Task NotifyTicketAysnc(string? groupId, Domain.Entities.Notification notification)
    {
        
        if (groupId is null)
        {
            await SendEventToEveryUserAsync("Notify", new
            {
                Id = notification.Id.ToString(),
                NotifyType = notification.NotifyType,
                IdNavigateChild = notification.IdNavigateChild,
                ParentNavigate = notification.ParentNavigate,
                Description = notification.Description,
                DescriptionVN = notification.DescriptionVN
            });
            logger.LogInformation($"đã send noti Type : {notification.NotifyType}; IdChild : {notification.IdNavigateChild}; ParentNavigate : {notification.ParentNavigate}; Desc : {notification.Description}");
        }
        else if (GetCurrentUserInGroupConnectedAsync().Contains(groupId))
        {
            if (GetCurrentAdminConnectedAsync())
            {
                await SendEventToGroupUserAsync("Admin", "Notify", new
                {
                    Id = notification.Id.ToString(),
                    NotifyType = notification.NotifyType,
                    IdNavigateChild = notification.IdNavigateChild,
                    ParentNavigate = notification.ParentNavigate,
                    Description = notification.Description,
                    DescriptionVN = notification.DescriptionVN,
                    GroupName = notification.GroupName
                });
                logger.LogInformation($"đã send noti Type : {notification.NotifyType}; IdChild : {notification.IdNavigateChild}; ParentNavigate : {notification.ParentNavigate}; Desc : {notification.Description}");
            }
            await SendEventToGroupUserAsync(groupId, "Notify", new
            {
                Id = notification.Id.ToString(),
                NotifyType = notification.NotifyType,
                IdNavigateChild = notification.IdNavigateChild,
                ParentNavigate = notification.ParentNavigate,
                Description = notification.Description,
                DescriptionVN = notification.DescriptionVN
            });
            logger.LogInformation($"đã send noti Type : {notification.NotifyType}; IdChild : {notification.IdNavigateChild}; ParentNavigate : {notification.ParentNavigate}; Desc : {notification.Description}");
        }
        
        

    }
    public async Task NotifyTicketAssignedAysnc(string userId, Domain.Entities.Notification notification)
    {
        await SendEventToUserAssignedAsync(userId, "Notify", new
        {
            Id = notification.Id.ToString(),
            NotifyType = notification.NotifyType,
            IdNavigateChild = notification.IdNavigateChild,
            ParentNavigate = notification.ParentNavigate,
            Description = notification.Description,
            DescriptionVN = notification.DescriptionVN
        });
        logger.LogInformation($"đã send noti Type : {notification.NotifyType}; IdChild : {notification.IdNavigateChild}; ParentNavigate : {notification.ParentNavigate}; Desc : {notification.Description}");
    }

    public async Task NotifyBannerAdded(Domain.Entities.Notification notification)
    {
        await SendEventToEveryUserAsync("Notify", new
        {
            Id = notification.Id.ToString(),
            NotifyType = notification.NotifyType,
            IdNavigateChild = notification.IdNavigateChild,
            ParentNavigate = notification.ParentNavigate,
            Description = notification.Description,
            DescriptionVN = notification.DescriptionVN
        });
        logger.LogInformation($"đã send noti Type : {notification.NotifyType}; IdChild : {notification.IdNavigateChild}; ParentNavigate : {notification.ParentNavigate}; Desc : {notification.Description}");
    }
    public async Task NotifyPaymentConfigAysnc(Domain.Entities.Notification notification)
    {
        await SendEventToEveryUserAsync("Notify", new
        {
            Id = notification.Id.ToString(),
            NotifyType = notification.NotifyType,
            IdNavigateChild = notification.IdNavigateChild,
            ParentNavigate = notification.ParentNavigate,
            Description = notification.Description,
            DescriptionVN = notification.DescriptionVN
        });
        logger.LogInformation($"đã send noti Type : {notification.NotifyType}; IdChild : {notification.IdNavigateChild}; ParentNavigate : {notification.ParentNavigate}; Desc : {notification.Description}");
    }
    public async Task NotifyLocalSimConfigAysnc(Domain.Entities.Notification notification)
    {
        await SendEventToEveryUserAsync("Notify", new
        {
            Id = notification.Id.ToString(),
            NotifyType = notification.NotifyType,
            IdNavigateChild = notification.IdNavigateChild,
            ParentNavigate = notification.ParentNavigate,
            Description = notification.Description,
            DescriptionVN = notification.DescriptionVN
        });
        logger.LogInformation($"đã send noti Type : {notification.NotifyType}; IdChild : {notification.IdNavigateChild}; ParentNavigate : {notification.ParentNavigate}; Desc : {notification.Description}");
    }
    #endregion
}

#region Type

public class KioskOnlineResponse
{
    public string DeviceId { get; set; } = string.Empty;
    public WorkingState State { get; set; }
    public bool IsApproved { get; set; } = false;
}

public class ClientInfo
{
    public string GroupId { get; set; } = string.Empty;
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public HubCallerContext Context { get; set; } = null!;
    public IClientProxy Client { get; set; } = null!;
    public WorkingState State { get; set; }
    public bool IsApproved { get; set; } = false;
    public bool IsKiosk { get; set; } = false;
}
public enum WorkingState
{
    Idle = 0,
    Busy = 1,
    Locked = -1
}
#endregion