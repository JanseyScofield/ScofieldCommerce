# Estágio 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["ScofieldCommerce.sln", "./"]
COPY ["ScofieldCommerce.API/ScofieldCommerce.API.csproj", "ScofieldCommerce.API/"]
COPY ["ScofieldCommerce.Domain/ScofieldCommerce.Domain.csproj", "ScofieldCommerce.Domain/"]
COPY ["ScofieldCommerce.Application/ScofieldCommerce.Application.csproj", "ScofieldCommerce.Application/"]
COPY ["ScofieldCommerce.Infrastructure/ScofieldCommerce.Infrastructure.csproj", "ScofieldCommerce.Infrastructure/"]
COPY ["ScofieldCommerce.Tests/ScofieldCommerce.Tests.csproj", "ScofieldCommerce.Tests/"]

RUN dotnet restore "ScofieldCommerce.sln"

COPY . .

WORKDIR "/src/ScofieldCommerce.API"
RUN dotnet publish "ScofieldCommerce.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ScofieldCommerce.API.dll"]