using GameService.Models;
using System.Collections.Concurrent;

namespace GameService.Engines;

public class ConfigurableRewardItem
{
    public RewardResult Reward { get; set; } = new();
    public int Weight { get; set; }
}

public class RewardDropEngine
{
    private static readonly List<ConfigurableRewardItem> BaseDefaultPool = new()
    {
        new() { Reward = new RewardResult { Id = "rw-01", Name = "10 Points Thưởng VIP", Type = "POINT", Value = 10, Code = "POINT10", Description = "Cộng trực tiếp 10 điểm thưởng VIP vào ví", Rarity = "Common" }, Weight = 35 },
        new() { Reward = new RewardResult { Id = "rw-02", Name = "30 Points Thưởng VIP", Type = "POINT", Value = 30, Code = "POINT30", Description = "Cộng trực tiếp 30 điểm thưởng VIP vào ví", Rarity = "Common" }, Weight = 25 },
        new() { Reward = new RewardResult { Id = "rw-03", Name = "50 Points Thưởng VIP", Type = "POINT", Value = 50, Code = "POINT50", Description = "Cộng trực tiếp 50 điểm thưởng VIP vào ví", Rarity = "Rare" }, Weight = 15 },
        new() { Reward = new RewardResult { Id = "rw-05", Name = "Voucher Ưu Đãi 20K", Type = "VOUCHER", Value = 20000, Code = "VOUCHER20K", Description = "Giảm 20.000 VNĐ cho hóa đơn dịch vụ tiếp theo", Rarity = "Rare" }, Weight = 12 },
        new() { Reward = new RewardResult { Id = "rw-06", Name = "Voucher Hoàng Kim 50K", Type = "VOUCHER", Value = 50000, Code = "VOUCHER50K", Description = "Giảm 50.000 VNĐ cho hóa đơn dịch vụ tiếp theo", Rarity = "Epic" }, Weight = 8 },
        new() { Reward = new RewardResult { Id = "rw-07", Name = "Quà Tặng Hiện Vật Độc Quyền", Type = "GIFT", Value = 200000, Code = "SPECIALGIFT", Description = "Quà tặng lưu niệm giới hạn dành cho khách hàng VIP", Rarity = "Epic" }, Weight = 4 },
        new() { Reward = new RewardResult { Id = "rw-08", Name = "Jackpot Khai Xuân 1 Triệu VNĐ", Type = "SPECIAL", Value = 1000000, Code = "JACKPOT2026", Description = "Giải đặc biệt may mắn năm mới 2026", Rarity = "Legendary" }, Weight = 1 },
    };

    // Compact tuple form: (id, name, type, value, code, description, rarity, weight)
    private static List<ConfigurableRewardItem> BuildPool(
        params (string Id, string Name, string Type, int Value, string Code, string Description, string Rarity, int Weight)[] defs)
    {
        return defs.Select(d => new ConfigurableRewardItem
        {
            Reward = new RewardResult
            {
                Id = d.Id,
                Name = d.Name,
                Type = d.Type,
                Value = d.Value,
                Code = d.Code,
                Description = d.Description,
                Rarity = d.Rarity
            },
            Weight = d.Weight
        }).ToList();
    }

    // Themed, per-game reward pools (7 rarity tiers, weights summing to 100).
    private static readonly Dictionary<string, List<ConfigurableRewardItem>> ThemedPools = new()
    {
        ["lucky-heart"] = BuildPool(
            ("rw-01", "10 Points Thưởng VIP", "POINT", 10, "POINT10", "Cộng trực tiếp 10 điểm thưởng VIP vào ví", "Common", 35),
            ("rw-02", "30 Points Thưởng VIP", "POINT", 30, "POINT30", "Cộng trực tiếp 30 điểm thưởng VIP vào ví", "Common", 25),
            ("rw-03", "50 Points Thưởng VIP", "POINT", 50, "POINT50", "Cộng trực tiếp 50 điểm thưởng VIP vào ví", "Rare", 15),
            ("rw-05", "Voucher Ưu Đãi 20K", "VOUCHER", 20000, "VOUCHER20K", "Giảm 20.000 VNĐ cho hóa đơn dịch vụ tiếp theo", "Rare", 12),
            ("rw-06", "Voucher Hoàng Kim 50K", "VOUCHER", 50000, "VOUCHER50K", "Giảm 50.000 VNĐ cho hóa đơn dịch vụ tiếp theo", "Epic", 8),
            ("rw-07", "Quà Tặng Hiện Vật Độc Quyền", "GIFT", 200000, "SPECIALGIFT", "Quà tặng lưu niệm giới hạn dành cho khách hàng VIP", "Epic", 4),
            ("rw-08", "Jackpot Khai Xuân 1 Triệu VNĐ", "SPECIAL", 1000000, "JACKPOT2026", "Giải đặc biệt may mắn năm mới 2026", "Legendary", 1)
        ),
        ["beauty-lucky-draw"] = BuildPool(
            ("bld-01", "15 Điểm Làm Đẹp", "POINT", 15, "BEAUTY15", "Cộng 15 điểm làm đẹp vào ví", "Common", 35),
            ("bld-02", "30 Điểm Làm Đẹp", "POINT", 30, "BEAUTY30", "Cộng 30 điểm làm đẹp vào ví", "Common", 25),
            ("bld-03", "Mặt Nạ Dưỡng Da Cao Cấp", "GIFT", 30000, "BEAUTYMASK", "Set mặt nạ dưỡng da thượng hạng", "Rare", 15),
            ("bld-04", "Voucher Mỹ Phẩm 30K", "VOUCHER", 30000, "BEAUTY30K", "Giảm 30.000 VNĐ cho đơn mỹ phẩm", "Rare", 12),
            ("bld-05", "Nước Hoa Mini Luxury", "GIFT", 80000, "BEAUTYPERFUME", "Nước hoa mini phiên bản giới hạn", "Epic", 8),
            ("bld-06", "Voucher Spa 100K", "VOUCHER", 100000, "BEAUTYSPA100K", "Giảm 100.000 VNĐ dịch vụ spa", "Epic", 4),
            ("bld-07", "Bộ Skincare Cao Cấp Trọn Gói", "SPECIAL", 500000, "BEAUTYJACKPOT", "Bộ skincare cao cấp trọn gói toàn phần", "Legendary", 1)
        ),
        ["flower-picking"] = BuildPool(
            ("fp-01", "10 Điểm Hương Sắc", "POINT", 10, "FLOWER10", "Cộng 10 điểm hương sắc vào ví", "Common", 35),
            ("fp-02", "25 Điểm Hương Sắc", "POINT", 25, "FLOWER25", "Cộng 25 điểm hương sắc vào ví", "Common", 25),
            ("fp-03", "Voucher Hoa Tươi 20K", "VOUCHER", 20000, "FLOWER20K", "Giảm 20.000 VNĐ cho hoa tươi", "Rare", 15),
            ("fp-04", "Chậu Lan Mini", "GIFT", 40000, "FLOWERORCHID", "Chậu lan mini trang trí bàn làm việc", "Rare", 12),
            ("fp-05", "Bó Hoa Hồng Cao Cấp", "GIFT", 150000, "FLOWERROSE", "Bó hoa hồng cao cấp giao tận nơi", "Epic", 8),
            ("fp-06", "Voucher Florist 100K", "VOUCHER", 100000, "FLOWER100K", "Giảm 100.000 VNĐ tại tiệm hoa đối tác", "Epic", 4),
            ("fp-07", "Voucher Hoa Trọn Gói 1 Năm", "SPECIAL", 800000, "FLOWERJACKPOT", "Voucher hoa tươi hàng tháng trọn 1 năm", "Legendary", 1)
        ),
        ["love-letter"] = BuildPool(
            ("ll-01", "10 Điểm Yêu Thương", "POINT", 10, "LOVE10", "Cộng 10 điểm yêu thương vào ví", "Common", 35),
            ("ll-02", "25 Điểm Yêu Thương", "POINT", 25, "LOVE25", "Cộng 25 điểm yêu thương vào ví", "Common", 25),
            ("ll-03", "Thiệp Handmade Cao Cấp", "GIFT", 30000, "LOVECARD", "Thiệp tình yêu thiết kế thủ công", "Rare", 15),
            ("ll-04", "Voucher Hẹn Hò 30K", "VOUCHER", 30000, "LOVE30K", "Giảm 30.000 VNĐ cho buổi hẹn hò", "Rare", 12),
            ("ll-05", "Voucher Nhà Hàng Đôi 150K", "VOUCHER", 150000, "LOVE150K", "Giảm 150.000 VNĐ bữa ăn cho hai người", "Epic", 8),
            ("ll-06", "Set Quà Tặng Người Yêu", "GIFT", 200000, "LOVEGIFTSET", "Set quà tặng dành cho người yêu", "Epic", 4),
            ("ll-07", "Chuyến Du Lịch Đôi Mini", "SPECIAL", 1000000, "LOVEJACKPOT", "Voucher du lịch mini dành cho hai người", "Legendary", 1)
        ),
        ["lucky-christmas-tree"] = BuildPool(
            ("ct-01", "10 Điểm Giáng Sinh", "POINT", 10, "XMAS10", "Cộng 10 điểm Giáng Sinh vào ví", "Common", 35),
            ("ct-02", "25 Điểm Giáng Sinh", "POINT", 25, "XMAS25", "Cộng 25 điểm Giáng Sinh vào ví", "Common", 25),
            ("ct-03", "Quả Châu Pha Lê", "GIFT", 25000, "XMASBALL", "Quả châu trang trí pha lê cao cấp", "Rare", 15),
            ("ct-04", "Voucher Trang Trí Noel 20K", "VOUCHER", 20000, "XMAS20K", "Giảm 20.000 VNĐ đồ trang trí Noel", "Rare", 12),
            ("ct-05", "Đèn LED Trang Trí Cao Cấp", "GIFT", 100000, "XMASLED", "Dây đèn LED trang trí cây thông", "Epic", 8),
            ("ct-06", "Voucher Quà Noel 100K", "VOUCHER", 100000, "XMAS100K", "Giảm 100.000 VNĐ cho quà Giáng Sinh", "Epic", 4),
            ("ct-07", "Hộp Quà Giáng Sinh Đặc Biệt", "SPECIAL", 700000, "XMASJACKPOT", "Hộp quà Giáng Sinh cao cấp đặc biệt", "Legendary", 1)
        ),
        ["santa-gift"] = BuildPool(
            ("sg-01", "10 Điểm Ông Già Noel", "POINT", 10, "SANTA10", "Cộng 10 điểm Ông Già Noel vào ví", "Common", 35),
            ("sg-02", "25 Điểm Ông Già Noel", "POINT", 25, "SANTA25", "Cộng 25 điểm Ông Già Noel vào ví", "Common", 25),
            ("sg-03", "Hộp Quà Nhỏ Bắc Cực", "GIFT", 30000, "SANTABOXS", "Hộp quà nhỏ phong cách Bắc Cực", "Rare", 15),
            ("sg-04", "Voucher Quà Tặng 30K", "VOUCHER", 30000, "SANTA30K", "Giảm 30.000 VNĐ cho quà tặng", "Rare", 12),
            ("sg-05", "Hộp Quà Lớn Hoàng Gia", "GIFT", 150000, "SANTABOXL", "Hộp quà lớn phong cách hoàng gia", "Epic", 8),
            ("sg-06", "Voucher Giáng Sinh 150K", "VOUCHER", 150000, "SANTA150K", "Giảm 150.000 VNĐ dịp Giáng Sinh", "Epic", 4),
            ("sg-07", "Hộp Quà Đặc Biệt Của Santa", "SPECIAL", 900000, "SANTAJACKPOT", "Hộp quà đặc biệt nhất của Santa", "Legendary", 1)
        ),
        ["snow-catcher"] = BuildPool(
            ("sc-01", "5 Điểm Tuyết", "POINT", 5, "SNOW5", "Cộng 5 điểm tuyết vào ví", "Common", 40),
            ("sc-02", "15 Điểm Tuyết", "POINT", 15, "SNOW15", "Cộng 15 điểm tuyết vào ví", "Common", 30),
            ("sc-03", "30 Điểm Tuyết", "POINT", 30, "SNOW30", "Cộng 30 điểm tuyết vào ví", "Rare", 15),
            ("sc-04", "Voucher 20K", "VOUCHER", 20000, "SNOW20K", "Giảm 20.000 VNĐ hóa đơn dịch vụ", "Rare", 8),
            ("sc-05", "Voucher 50K", "VOUCHER", 50000, "SNOW50K", "Giảm 50.000 VNĐ hóa đơn dịch vụ", "Epic", 4),
            ("sc-06", "Quà Tặng Mùa Đông", "GIFT", 100000, "SNOWGIFT", "Quà tặng chủ đề mùa đông", "Epic", 2),
            ("sc-07", "Jackpot Tuyết Trắng 500K", "SPECIAL", 500000, "SNOWJACKPOT", "Giải đặc biệt Tuyết Trắng", "Legendary", 1)
        ),
        ["lucky-envelope"] = BuildPool(
            ("le-01", "10 Điểm Lì Xì", "POINT", 10, "LIXI10", "Cộng 10 điểm lì xì vào ví", "Common", 35),
            ("le-02", "30 Điểm Lì Xì", "POINT", 30, "LIXI30", "Cộng 30 điểm lì xì vào ví", "Common", 25),
            ("le-03", "Lì Xì 20K", "VOUCHER", 20000, "LIXI20K", "Lì xì may mắn 20.000 VNĐ", "Rare", 15),
            ("le-04", "Lì Xì 50K", "VOUCHER", 50000, "LIXI50K", "Lì xì may mắn 50.000 VNĐ", "Rare", 12),
            ("le-05", "Lì Xì 100K", "VOUCHER", 100000, "LIXI100K", "Lì xì may mắn 100.000 VNĐ", "Epic", 8),
            ("le-06", "Bao Lì Xì Vàng Đặc Biệt", "GIFT", 200000, "LIXIGOLD", "Bao lì xì mạ vàng phiên bản đặc biệt", "Epic", 4),
            ("le-07", "Jackpot Khai Xuân 1 Triệu", "SPECIAL", 1000000, "LIXIJACKPOT", "Giải đặc biệt khai xuân năm mới", "Legendary", 1)
        ),
        ["golden-dragon"] = BuildPool(
            ("gd-01", "5 Điểm Lộc", "POINT", 5, "DRAGON5", "Cộng 5 điểm Lộc vào ví", "Common", 40),
            ("gd-02", "15 Điểm Lộc", "POINT", 15, "DRAGON15", "Cộng 15 điểm Lộc vào ví", "Common", 30),
            ("gd-03", "Đồng Xu Vàng May Mắn", "GIFT", 20000, "DRAGONCOIN", "Đồng xu vàng phong thủy may mắn", "Rare", 15),
            ("gd-04", "Voucher 30K", "VOUCHER", 30000, "DRAGON30K", "Giảm 30.000 VNĐ hóa đơn dịch vụ", "Rare", 8),
            ("gd-05", "Thỏi Vàng Phong Thủy", "GIFT", 100000, "DRAGONINGOT", "Thỏi vàng phong thủy chiêu tài", "Epic", 4),
            ("gd-06", "Voucher 100K", "VOUCHER", 100000, "DRAGON100K", "Giảm 100.000 VNĐ hóa đơn dịch vụ", "Epic", 2),
            ("gd-07", "Túi Lộc Phát Tài 500K", "SPECIAL", 500000, "DRAGONJACKPOT", "Giải đặc biệt Lộc Phát Tài", "Legendary", 1)
        ),
        ["firework-fortune"] = BuildPool(
            ("ff-01", "20 Điểm Tài Lộc", "POINT", 20, "FIRE20", "Cộng 20 điểm Tài Lộc vào ví", "Common", 30),
            ("ff-02", "40 Điểm Tài Lộc", "POINT", 40, "FIRE40", "Cộng 40 điểm Tài Lộc vào ví", "Common", 22),
            ("ff-03", "Voucher 50K", "VOUCHER", 50000, "FIRE50K", "Giảm 50.000 VNĐ hóa đơn dịch vụ", "Rare", 18),
            ("ff-04", "Voucher 100K", "VOUCHER", 100000, "FIRE100K", "Giảm 100.000 VNĐ hóa đơn dịch vụ", "Rare", 13),
            ("ff-05", "Voucher 200K", "VOUCHER", 200000, "FIRE200K", "Giảm 200.000 VNĐ hóa đơn dịch vụ", "Epic", 9),
            ("ff-06", "Quà Tặng Cao Cấp", "GIFT", 300000, "FIREGIFT", "Quà tặng cao cấp mừng năm mới", "Epic", 5),
            ("ff-07", "Jackpot Pháo Hoa Tài Lộc 1 Triệu", "SPECIAL", 1000000, "FIREJACKPOT", "Giải đặc biệt lớn nhất trong nhóm 10 game", "Legendary", 3)
        ),
    };

    // Game-specific pool overrides, e.g. "lucky-heart" -> pool
    private readonly ConcurrentDictionary<string, List<ConfigurableRewardItem>> _gamePools = new();

    public RewardDropEngine()
    {
        // Seed a distinct themed pool for every one of the 10 real games up front.
        foreach (var (gameId, pool) in ThemedPools)
        {
            _gamePools[gameId] = ClonePool(pool);
        }
    }

    private static List<ConfigurableRewardItem> ClonePool(List<ConfigurableRewardItem> pool)
    {
        return pool.Select(x => new ConfigurableRewardItem
        {
            Reward = new RewardResult
            {
                Id = x.Reward.Id,
                Name = x.Reward.Name,
                Type = x.Reward.Type,
                Value = x.Reward.Value,
                Code = x.Reward.Code,
                Description = x.Reward.Description,
                Rarity = x.Reward.Rarity
            },
            Weight = x.Weight
        }).ToList();
    }

    private List<ConfigurableRewardItem> GetPoolForGame(string gameId)
    {
        var key = string.IsNullOrWhiteSpace(gameId) ? "default" : gameId.ToLowerInvariant();
        return _gamePools.GetOrAdd(key, _ => ClonePool(BaseDefaultPool));
    }

    public DropRateConfigResponse GetDropRates(string gameId)
    {
        var pool = GetPoolForGame(gameId);
        var totalWeight = Math.Max(1, pool.Sum(x => x.Weight));

        var items = pool.Select(item => new DropRateItemDto
        {
            RewardId = item.Reward.Id,
            Name = item.Reward.Name,
            Type = item.Reward.Type,
            Value = item.Reward.Value,
            Rarity = item.Reward.Rarity,
            Weight = item.Weight,
            ProbabilityPercent = Math.Round(((double)item.Weight / totalWeight) * 100.0, 2)
        }).ToList();

        return new DropRateConfigResponse
        {
            GameId = gameId,
            TotalWeight = totalWeight,
            Items = items
        };
    }

    public DropRateConfigResponse UpdateDropRates(UpdateDropRatesRequest request)
    {
        var pool = GetPoolForGame(request.GameId);

        foreach (var update in request.Rates)
        {
            var match = pool.FirstOrDefault(x => x.Reward.Id == update.RewardId);
            if (match != null)
            {
                match.Weight = Math.Max(1, update.Weight); // minimum weight 1
            }
        }

        return GetDropRates(request.GameId);
    }

    public RewardResult DetermineReward(string gameId, int score)
    {
        var pool = GetPoolForGame(gameId);
        var totalWeight = pool.Sum(x => x.Weight);
        if (totalWeight <= 0) totalWeight = 1;

        var roll = Random.Shared.Next(0, totalWeight);
        var accumulated = 0;

        foreach (var item in pool)
        {
            accumulated += item.Weight;
            if (roll < accumulated)
            {
                return new RewardResult
                {
                    Id = item.Reward.Id,
                    Name = item.Reward.Name,
                    Type = item.Reward.Type,
                    Value = item.Reward.Value,
                    Code = item.Reward.Code + "_" + Random.Shared.Next(1000, 9999),
                    Description = item.Reward.Description,
                    Rarity = item.Reward.Rarity
                };
            }
        }

        // Fallback
        return new RewardResult
        {
            Id = "rw-01",
            Name = "10 Points Thưởng VIP",
            Type = "POINT",
            Value = 10,
            Code = "POINT10_DEFAULT",
            Description = "Cộng trực tiếp 10 điểm thưởng VIP",
            Rarity = "Common"
        };
    }
}
