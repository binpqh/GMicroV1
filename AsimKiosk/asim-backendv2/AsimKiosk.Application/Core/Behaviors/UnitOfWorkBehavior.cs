using Amazon.Runtime.Internal.Util;
using AsimKiosk.Domain.Core.Data;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AsimKiosk.Application.Core.Behaviors
{
    public class UnitOfWorkBehavior<TTRequest, TTResponse>(IUnitOfWork unitOfWork, ILogger<UnitOfWorkBehavior<TTRequest, TTResponse>> logger)
        : IPipelineBehavior<TTRequest, TTResponse>
        where TTRequest : notnull
        where TTResponse : notnull
    {
        public async Task<TTResponse> Handle(TTRequest request,
            RequestHandlerDelegate<TTResponse> next,
            CancellationToken cancellationToken)
        {
            var response = await next();
            if (IsCommand())
            {
                logger.LogInformation("Saving state ...");
                await unitOfWork.SaveChangesAsync(cancellationToken);
                return response;
            }
            else
            {
                return response;
            }
        }
        private static bool IsCommand()
        {
            return typeof(TTRequest).Name.EndsWith("Command");

        }
    }
}
