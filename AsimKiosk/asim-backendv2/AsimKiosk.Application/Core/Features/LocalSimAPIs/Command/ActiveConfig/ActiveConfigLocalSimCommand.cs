﻿using AsimKiosk.Application.Core.Abstractions.Messaging;
using AsimKiosk.Domain.Core.Primitives;

namespace AsimKiosk.Application.Core.Features.LocalSimAPIs.Command.ActiveConfig;

public class ActiveConfigLocalSimCommand(string id) : ICommand<Result>
{
    public string Id { get; set; } = id;
}
