using FluentValidation;


namespace AsimKiosk.Application.Core.Features.Groups.Commands.AddUsersToGroup
{
    public class AddUserToGroupCommandValidator : AbstractValidator<AddUsersToGroupCommand>
    {
        public AddUserToGroupCommandValidator()
        {
            RuleFor(x => x.AddUsersRequest.UserIds)
                .NotEmpty()
                .WithErrorCode("EGUL40")
                .WithMessage("The users list can not be empty");
        }
   
    }
}
