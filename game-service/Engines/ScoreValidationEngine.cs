using GameService.Models;

namespace GameService.Engines;

public class ScoreValidationEngine
{
    // Caps derived from each game's actual client scoring formula (see docs/GAME_PLAN.md),
    // with headroom above the max value the client can legitimately produce.
    private static readonly Dictionary<string, int> MaxPermittedScores = new()
    {
        { "lucky-heart", 650 },           // fixed 580
        { "beauty-lucky-draw", 800 },     // 620 + idx*40, idx 0-3 -> max 740
        { "flower-picking", 700 },        // 560 + idx*30, idx 0-3 -> max 650
        { "love-letter", 700 },           // fixed 640
        { "lucky-christmas-tree", 650 },  // fixed 600
        { "santa-gift", 650 },            // fixed 590
        { "snow-catcher", 1200 },         // variable, 15s crystal-catch arcade (floor 350)
        { "lucky-envelope", 800 },        // 650 + idx*30, idx 0-3 -> max 740
        { "golden-dragon", 1200 },        // variable, 15s tap-combo arcade (floor 450)
        { "firework-fortune", 750 },      // fixed 680
    };

    public (bool isValid, int validatedScore, string message) ValidateGameSession(GameValidationRequest request)
    {
        var gameKey = request.GameId.ToLowerInvariant();
        var maxScore = MaxPermittedScores.TryGetValue(gameKey, out var cap) ? cap : 1000;

        // 1. Check score bounds
        if (request.Score < 0)
        {
            return (false, 0, "Điểm số không hợp lệ (nhỏ hơn 0).");
        }

        if (request.Score > maxScore * 2) // Flag blatant manipulation
        {
            return (false, maxScore / 2, $"Phát hiện điểm số vượt ngưỡng cho phép đối với mini-game {request.GameId}.");
        }

        // 2. Game-specific heuristics for the two behavior-driven (non-fixed-score) games.
        // Both reconcile the client score against the gameplay events actually recorded,
        // instead of trusting a client-computed number outright.
        var events = request.GameplayEvents ?? new List<GameplayEvent>();

        if (gameKey == "snow-catcher")
        {
            // Score = sum(caught crystal points) * up to 2x combo multiplier, floor 350.
            var caughtPoints = events.Where(e => e.EventType == "CATCH_CRYSTAL").Sum(e => e.Value);
            var expectedMax = Math.Max(350, caughtPoints * 2);
            if (request.Score > expectedMax)
            {
                return (true, expectedMax, "Điểm số không khớp với số bông tuyết đã hứng được, đã chuẩn hóa lại.");
            }
        }
        else if (gameKey == "golden-dragon")
        {
            var dragonTaps = events.Where(e => e.EventType == "TAP_DRAGON").OrderBy(e => e.TimestampMs).ToList();
            var pearlTaps = events.Count(e => e.EventType == "TAP_CELESTIAL_PEARL");

            // Human tap speed check on the dragon (moving target; >12 taps/sec is not plausible by hand).
            if (dragonTaps.Count > 8)
            {
                var durationMs = dragonTaps.Last().TimestampMs - dragonTaps.First().TimestampMs;
                if (durationMs > 0)
                {
                    var tapRate = dragonTaps.Count / (durationMs / 1000.0);
                    if (tapRate > 12.0)
                    {
                        return (true, 450, "Phát hiện tần suất chạm bất thường, điểm được chuẩn hóa về mức sàn.");
                    }
                }
            }

            // Score = dragon taps * up to 50 (25 base, x2 combo) + pearl taps * 60, floor 450.
            var expectedMax = Math.Max(450, dragonTaps.Count * 50 + pearlTaps * 60);
            if (request.Score > expectedMax)
            {
                return (true, expectedMax, "Điểm số không khớp với số lần chạm ghi nhận được, đã chuẩn hóa lại.");
            }
        }

        // Clean score bounded by game max
        var finalScore = Math.Min(request.Score, maxScore);
        return (true, finalScore, "Điểm số hợp lệ và đã được xác thực an toàn.");
    }

    public ScoreCalculationResponse CalculateScore(ScoreCalculationRequest req)
    {
        var baseScore = Math.Max(0, req.RawScore);
        var bonus = 0;

        if (req.AccuracyPercentage >= 90) bonus += 50;
        if (req.ElapsedSeconds > 0 && req.ElapsedSeconds < 30) bonus += 30;

        var total = baseScore + bonus;
        var rank = total switch
        {
            >= 500 => "S",
            >= 350 => "A",
            >= 200 => "B",
            _ => "C"
        };

        return new ScoreCalculationResponse
        {
            CalculatedScore = total,
            BonusScore = bonus,
            PerformanceRank = rank
        };
    }
}
