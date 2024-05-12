using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.Inventory.Command.AddNewCardStorage;

public class AddNewCardStorageCommandHandler(ICardStorageRepository cardStorageRepository) : ICommandHandler<AddNewCardStorageCommand, Result>
{
    public async Task<Result> Handle(AddNewCardStorageCommand request, CancellationToken cancellationToken)
    {
        cardStorageRepository.InsertRange(request.CardStorages);
        await Task.CompletedTask;
        return Result.Success();
    }
}
