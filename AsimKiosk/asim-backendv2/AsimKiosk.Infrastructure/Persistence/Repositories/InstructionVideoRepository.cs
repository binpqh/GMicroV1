using AsimKiosk.Contracts.Kiosk.Config;
using AsimKiosk.Domain.Core.Data;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;
using AsimKiosk.Domain.Enums;
using AsimKiosk.Domain.Repositories;
using MongoFramework.Linq;

namespace AsimKiosk.Infrastructure.Persistence.Repositories;

internal class InstructionVideoRepository(IUnitOfWork unitOfWork) : GenericRepository<InstructionVideo>(unitOfWork), IInstructionVideoRepository
{
    public async Task<bool> AnyActiveAsync()
        => await UnitOfWork.Set<InstructionVideo>().AnyAsync(i => i.Status == ActiveStatus.Active.ToString());

    public async Task<Maybe<InstructionVideo>> GetActiveVideoAsync()
    => await UnitOfWork.Set<InstructionVideo>().FirstOrDefaultAsync(i => i.Status == ActiveStatus.Active.ToString());
}
