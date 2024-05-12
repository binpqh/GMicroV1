using FluentValidation;


namespace AsimKiosk.Application.Core.Features.Products.Command.ChangePriorityBanners
{
    public class ChangePriorityBannersCommandValidator : AbstractValidator<ChangePriorityBannersCommand>
    {
        public ChangePriorityBannersCommandValidator()
        {
            RuleFor(x => x.Banners)
              .NotEmpty()
              .WithErrorCode("EB40")
              .WithMessage("Banners can not be empty");
        }
    }
}
