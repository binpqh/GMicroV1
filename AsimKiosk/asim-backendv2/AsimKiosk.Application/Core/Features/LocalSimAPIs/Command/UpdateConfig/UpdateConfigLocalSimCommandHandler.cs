using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.UpdateConfig;

public class UpdateConfigLocalSimCommandHandler(ILocalSimConfigRepository localSimConfigRepository) : ICommandHandler<UpdateConfigLocalSimCommand, Result>
{
    public async Task<Result> Handle(UpdateConfigLocalSimCommand request, CancellationToken cancellationToken)
    {
       var config = await localSimConfigRepository.GetByIdAsync(request.Id);
       if (config.HasNoValue) return Result.Failure();
       config.Value.UserName = string.IsNullOrWhiteSpace(request.LocalSimConfig.UserName) ? config.Value.UserName : request.LocalSimConfig.UserName;
       config.Value.Password = string.IsNullOrWhiteSpace(request.LocalSimConfig.Password) ? config.Value.Password : request.LocalSimConfig.Password;
       config.Value.GrantType = string.IsNullOrWhiteSpace(request.LocalSimConfig.GrantType) ? config.Value.GrantType : request.LocalSimConfig.GrantType;
       config.Value.ClientId = string.IsNullOrWhiteSpace(request.LocalSimConfig.ClientId) ? config.Value.ClientId : request.LocalSimConfig.ClientId;
       config.Value.ClientSecret = string.IsNullOrWhiteSpace(request.LocalSimConfig.ClientSecret) ? config.Value.ClientSecret : request.LocalSimConfig.ClientSecret;
       config.Value.Scope = string.IsNullOrWhiteSpace(request.LocalSimConfig.Scope) ? config.Value.Scope : request.LocalSimConfig.Scope;
       config.Value.Realm = string.IsNullOrWhiteSpace(request.LocalSimConfig.Realm) ? config.Value.Realm : request.LocalSimConfig.Realm;
       config.Value.AuthUrl = string.IsNullOrWhiteSpace(request.LocalSimConfig.AuthUrl) ? config.Value.AuthUrl : request.LocalSimConfig.AuthUrl;
       config.Value.BussUrl = string.IsNullOrWhiteSpace(request.LocalSimConfig.BussUrl) ? config.Value.BussUrl : request.LocalSimConfig.BussUrl;
       return Result.Success();      
    }
}
