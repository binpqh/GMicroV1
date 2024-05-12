using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Entities;

namespace AsimKiosk.Domain.Repositories;

public interface IInstructionVideoRepository
{
    Task<Maybe<EntityCollection<InstructionVideo>>> GetAllAsync();
    Task<Maybe<InstructionVideo>> GetByIdAsync(string id);
    Task<Maybe<InstructionVideo>> GetActiveVideoAsync();
    Task<bool> AnyActiveAsync();
    void Insert(InstructionVideo video);
    Task RemoveAsync(InstructionVideo video);
}
