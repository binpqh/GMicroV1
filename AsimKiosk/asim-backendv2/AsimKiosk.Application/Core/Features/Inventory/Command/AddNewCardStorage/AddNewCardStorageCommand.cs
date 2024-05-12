using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.AddNewCardStorage;

public class AddNewCardStorageCommand(List<CardStorage> cardStorages) : ICommand<Result>
{
    public List<CardStorage> CardStorages { get; set; } = cardStorages;
}
