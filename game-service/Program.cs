using GameService.Engines;
using GameService.Models;

var builder = WebApplication.CreateBuilder(args);

// Register services & engines
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<ScoreValidationEngine>();
builder.Services.AddSingleton<RewardDropEngine>();

// Configure Kestrel to listen on port 5000
builder.WebHost.UseUrls("http://0.0.0.0:5000");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. Health check endpoint
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    service = "C# ASP.NET Core Game Calculation & Anti-Cheat Service",
    timestamp = DateTime.UtcNow
}));

// 2. Game session score validation & anti-cheat check
app.MapPost("/internal/game/validate", (
    GameValidationRequest request,
    ScoreValidationEngine scoreEngine,
    RewardDropEngine rewardEngine) =>
{
    var (isValid, validatedScore, message) = scoreEngine.ValidateGameSession(request);
    
    RewardResult? reward = null;
    if (isValid)
    {
        reward = rewardEngine.DetermineReward(request.GameId, validatedScore);
    }

    var response = new GameValidationResponse
    {
        Valid = isValid,
        ValidatedScore = validatedScore,
        Message = message,
        Reward = reward
    };

    return Results.Ok(response);
});

// 3. Dedicated Score Calculation endpoint
app.MapPost("/internal/game/calculate-score", (
    ScoreCalculationRequest request,
    ScoreValidationEngine scoreEngine) =>
{
    var result = scoreEngine.CalculateScore(request);
    return Results.Ok(result);
});

// 4. Dedicated Reward Drop endpoint
app.MapPost("/internal/game/calculate-reward", (
    string gameId,
    int score,
    RewardDropEngine rewardEngine) =>
{
    var reward = rewardEngine.DetermineReward(gameId, score);
    return Results.Ok(reward);
});

// 5. Get Configurable Drop Rates for a game
app.MapGet("/internal/game/drop-rates", (
    string? gameId,
    RewardDropEngine rewardEngine) =>
{
    var key = gameId ?? "lucky-heart";
    var rates = rewardEngine.GetDropRates(key);
    return Results.Ok(rates);
});

// 6. Update Configurable Drop Rates for a game
app.MapPost("/internal/game/drop-rates", (
    UpdateDropRatesRequest request,
    RewardDropEngine rewardEngine) =>
{
    var updated = rewardEngine.UpdateDropRates(request);
    return Results.Ok(updated);
});

Console.WriteLine("[C# Game Service] Server initialized and listening on http://localhost:5000");

app.Run();
