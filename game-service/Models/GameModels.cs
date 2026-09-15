namespace GameService.Models;

public class GameValidationRequest
{
    public string GameId { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public int Score { get; set; }
    public List<GameplayEvent>? GameplayEvents { get; set; }
    public Dictionary<string, object>? ClientMetadata { get; set; }
}

public class GameplayEvent
{
    public string EventType { get; set; } = string.Empty;
    public long TimestampMs { get; set; }
    public int Value { get; set; }
    public string? Details { get; set; }
}

public class GameValidationResponse
{
    public bool Valid { get; set; }
    public int ValidatedScore { get; set; }
    public string Message { get; set; } = "OK";
    public RewardResult? Reward { get; set; }
}

public class RewardResult
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "POINT"; // POINT, VOUCHER, GIFT, SPECIAL
    public int Value { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Rarity { get; set; } = "Common"; // Common, Rare, Epic, Legendary
}

public class ScoreCalculationRequest
{
    public string GameId { get; set; } = string.Empty;
    public int ElapsedSeconds { get; set; }
    public int Moves { get; set; }
    public int AccuracyPercentage { get; set; }
    public int RawScore { get; set; }
}

public class ScoreCalculationResponse
{
    public int CalculatedScore { get; set; }
    public int BonusScore { get; set; }
    public string PerformanceRank { get; set; } = "A"; // S, A, B, C
}

public class DropRateItemDto
{
    public string RewardId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "POINT";
    public int Value { get; set; }
    public string Rarity { get; set; } = "Common";
    public int Weight { get; set; }
    public double ProbabilityPercent { get; set; }
}

public class DropRateConfigResponse
{
    public string GameId { get; set; } = string.Empty;
    public int TotalWeight { get; set; }
    public List<DropRateItemDto> Items { get; set; } = new();
}

public class UpdateDropRatesRequest
{
    public string GameId { get; set; } = string.Empty;
    public List<DropRateUpdateItem> Rates { get; set; } = new();
}

public class DropRateUpdateItem
{
    public string RewardId { get; set; } = string.Empty;
    public int Weight { get; set; }
}
