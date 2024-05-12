using AsimKiosk.Application.Core.Abstractions.Authentication;
using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;
using AsimKiosk.Domain.Repositories;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.CreateConfig;
public class CreateConfigLocalSimCommandHandler(ILocalSimConfigRepository localSimConfigRepository ,IUserIdentifierProvider userIdentifierProvider) 
    : ICommandHandler<CreateConfigLocalSimCommand, Result>
{
    public Task<Result> Handle(CreateConfigLocalSimCommand request, CancellationToken cancellationToken)
    {
        var config = new Domain.Entities.LocalSimConfig
        {
            UserName = request.ApiConfigSimRequest.UserName,
            Password = request.ApiConfigSimRequest.Password,
            GrantType = request.ApiConfigSimRequest.GrantType,
            ClientId = request.ApiConfigSimRequest.ClientId,
            ClientSecret = request.ApiConfigSimRequest.ClientSecret,
            Scope = request.ApiConfigSimRequest.Scope,
            Realm = request.ApiConfigSimRequest.Realm,
            GroupId = userIdentifierProvider.GroupId!.ToString(),
            AuthUrl = request.ApiConfigSimRequest.AuthUrl,
            BussUrl = request.ApiConfigSimRequest.BussUrl,
        };
        localSimConfigRepository.Insert(config);
        return Task.FromResult(Result.Success());
    }
}
