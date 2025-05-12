# --- Build stage ---
    FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
    WORKDIR /app
    
    # Copy everything and restore
    COPY . ./
    RUN dotnet restore
    
    # Build and publish release
    RUN dotnet publish -c Release -o out
    
    # --- Runtime stage ---
    FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
    WORKDIR /app
    COPY --from=build /app/out ./
    
    # Render requires the app to run on port 8080
    ENV ASPNETCORE_URLS=http://+:8080
    EXPOSE 8080
    
    ENTRYPOINT ["dotnet", "AppProject.dll"]
    