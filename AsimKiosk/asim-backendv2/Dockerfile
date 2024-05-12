#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "AsimKiosk.WebAPI/AsimKiosk.WebAPI.csproj"
WORKDIR /src
RUN dotnet build "AsimKiosk.WebAPI/AsimKiosk.WebAPI.csproj" -c Release -o /app/build

RUN dotnet publish "AsimKiosk.WebAPI/AsimKiosk.WebAPI.csproj" -c Release -o /app/publish

FROM base AS final

WORKDIR /app

COPY --from=build /app/publish .

COPY ./assets ./assets

ENTRYPOINT ["dotnet", "AsimKiosk.WebAPI.dll"]