using FluentValidation;


namespace AsimKiosk.Application.Core.Features.Groups.Commands.RemoveUsersFromGroup
{
    public class RemoveUserFromGroupCommandValidator : AbstractValidator<RemoveUsersFromGroupCommand>
    {
        public RemoveUserFromGroupCommandValidator()
        {
            RuleFor(x => x.RemoveUsersRequest.UserIds)
                .NotEmpty()
                .WithErrorCode("EGUL42")
                .WithMessage("The users list can not be empty");
        }
    }
}
