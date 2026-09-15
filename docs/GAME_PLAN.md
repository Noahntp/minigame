# Kế hoạch phát triển chi tiết — Nhóm 10 Mini Game "Cảm xúc / Theo mùa" (#21–#30)

Stack: **React (frontend)** · **NestJS (backend)** · **C# / ASP.NET Core (`game-service`)**

## Trạng thái (cập nhật 2026-09-15)

- ✅ **React (10/10 game):** cả 10 game đã có component riêng chất lượng hoàn thiện (`ValentineGashapon.tsx` + 9 file trong `stages/`), dispatch qua [`GameStageRenderer.tsx`](../frontend/src/components/games/GameStageRenderer.tsx). Mục 1.6 (tách file) coi như đã xong.
- ✅ **C# `game-service`:** đã sửa `ScoreValidationEngine.MaxPermittedScores` dùng đúng 10 slug thật (mục 1.3) + thêm heuristic đối chiếu event cho `snow-catcher`/`golden-dragon` (mục "Rủi ro"); đã seed 9 reward pool riêng theo chủ đề trong `RewardDropEngine` (mục 1.4). Build + smoke test qua HTTP đã pass.
- ⚠️ **Lưu ý vận hành:** tiến trình `game-service` hiện đang chạy (cổng 5000, khởi động ~10:43) vẫn phục vụ **code cũ** — cần `Ctrl+C` rồi `dotnet run` lại (hoặc restart) để nhận các thay đổi C# nói trên.
- ⏸ **Chưa làm / để ngỏ:** mục 1.1 (thống nhất tên game #21, hiện backend `SEED_GAMES` và frontend `data/games.ts` đã khớp nhau ở "Máy Quay Trứng Tình Yêu" — khác brief gốc "Trái Tim May Mắn", nhưng không đổi vì đây là file frontend/backend do phiên làm việc khác quản lý), mục 1.2 (gộp catalog dùng chung), mục 1.5 (chuyển in-memory → Prisma thật).

## 0. Bối cảnh hiện tại — đọc trước khi bắt tay code

Đã khảo sát toàn bộ repo (`frontend/`, `backend/`, `game-service/`, `legacy/`). Kết luận quan trọng:

> **Cả 10 game đã tồn tại ở cả 3 tầng** (slug, route, seed data, SVG art đều có sẵn), nhưng chỉ có **game #21 (Trái Tim May Mắn)** đạt chất lượng "flagship" (`ValentineGashapon.tsx`: state machine nhiều bước, Framer Motion, SVG tự vẽ theo rarity, modal tỉ lệ thưởng). **9 game còn lại (#22–#30)** đang là component inline đơn giản trong `GameStageRenderer.tsx` (1 lần chạm → chờ 1.2s → xong), chưa đúng tinh thần "Cách chơi" nhiều bước như trong bảng gốc.

Vì vậy đây **không phải** task "tạo mới 10 game", mà là:
1. Vá 4 lỗ hổng kiến trúc dùng chung (mục 1) — làm 1 lần, lợi cho toàn bộ.
2. Nâng cấp từng game #22–#30 lên chuẩn flagship + tinh chỉnh #21 (mục 3).

Tham chiếu chuẩn hành vi hiện có (giữ nguyên khi code game mới):
- React: [`GameStageRenderer.tsx`](../frontend/src/components/games/GameStageRenderer.tsx) dispatch theo `slug`; mỗi stage nhận `{ onComplete(score, telemetry?), soundEnabled, track(eventType, value?) }` và **không tự gọi API** — chỉ gọi `onComplete`. `MiniGameShell.tsx` sở hữu state machine `INTRO → READY → PLAYING → RESULT → REWARD_REVEAL` và gọi `api.startSession` / `api.completeSession`.
- NestJS: mọi route nằm dưới `/api/mini-games/:id/{start,complete}` ([`game-sessions.controller.ts`](../backend/src/modules/game-sessions/game-sessions.controller.ts)); `completeSession` luôn POST sang C# `POST /internal/game/validate` với timeout 1.5s, **fallback graceful** (clamp điểm + random reward) nếu C# service down.
- C#: `POST /internal/game/validate` chạy `ScoreValidationEngine.ValidateGameSession` rồi `RewardDropEngine.DetermineReward`. Cả hai class hiện **dùng bảng slug/pool sai** (không khớp 10 slug thật) — đây là bug cần sửa trước tiên (mục 1.3, 1.4).

---

## 1. Hạng mục dùng chung (làm trước, ảnh hưởng cả 10 game)

### 1.1 Thống nhất tên hiển thị game #21
Phát hiện lệch tên: `frontend/data/games.ts` và backend `SEED_GAMES` đặt tên **"Máy Quay Trứng Tình Yêu"**, trong khi `api.ts` (fallback history) và `legacy/js/app.js` dùng **"Trái Tim May Mắn"** (đúng tên gốc trong bảng yêu cầu).
- **Quyết định:** chốt "Trái Tim May Mắn" làm tên hiển thị chính thức, sửa lại ở `frontend/src/data/games.ts` và `backend/src/modules/mini-games/mini-games.service.ts` (`SEED_GAMES`).
- **Bổ sung nhỏ cho đúng "Cách chơi" gốc** (chạm tim → tim đập → nổ thành thưởng): thêm 1 bước "nhịp tim" (2-3 lần pulse scale 1→1.15→1, đồng bộ haptic/sound) **trước** khi vào animation quay trứng hiện tại, thay vì thay hẳn cơ chế gashapon (cơ chế hiện tại chất lượng cao, chỉ thiếu bước mở đầu đúng ý "tim đập").

### 1.2 Một nguồn dữ liệu catalog duy nhất
Hiện dữ liệu game bị lặp **2 lần** (`frontend/data/games.ts` + backend `SEED_GAMES`) và dữ liệu reward bị lặp **3 lần** (frontend fallback, backend `MOCK_REWARDS`/`REWARDS_CATALOG`, C# `BaseDefaultPool`).
- Tạo `shared/game-catalog.json` (10 định nghĩa game) và `shared/reward-catalog.json` (danh mục reward gốc) ở root repo.
- Frontend: import trực tiếp (Vite hỗ trợ JSON import) thay cho mảng hard-code trong `data/games.ts`.
- NestJS: đọc file này lúc bootstrap (hoặc dùng làm input cho `prisma db seed`) thay cho `SEED_GAMES`/`REWARDS_CATALOG` hard-code.
- C# (`game-service`): copy file vào `wwwroot`/`Config` và load lúc start (`IConfiguration` hoặc đọc JSON thủ công) để build `MaxPermittedScores` và reward pool theo game — bỏ hard-code trong `RewardDropEngine` constructor.
- Lợi ích: sửa 1 chỗ, 3 tầng đồng bộ; tránh lặp lại lỗi lệch tên như mục 1.1.

### 1.3 Sửa bảng `MaxPermittedScores` trong C#
`ScoreValidationEngine.cs` hiện có key là `lucky-wheel, mystery-box, scratch-card, memory-match, claw-machine, drop-ball-plinko, tap-fast, quiz-trivia, slot-machine, dice-roll` — **không khớp** slug thật nào trong 10 game, nên mọi game hiện đang dùng cap mặc định 1000 (không kiểm soát gian lận thực sự).
- Thay bằng đúng 10 slug thật + giá trị cap theo bảng ở mục 2.
- Thêm heuristic riêng cho 2 cơ chế "biến thiên theo hành vi" thay vì chỉ 1 điểm cố định: `snow-catcher` (đối chiếu số event `CATCH`) và `golden-dragon` (đối chiếu số event `TAP` + tốc độ tap, tái dùng logic chống bot hiện có của slug `tap-fast`).

### 1.4 Reward pool riêng theo từng game
`RewardDropEngine` chỉ seed pool cho `lucky-heart`; 9 game còn lại tự động dùng chung 1 pool generic (`BaseDefaultPool`, 7 item) — không có bản sắc theo mùa/chủ đề.
- Seed pool riêng cho từng `gameId` trong constructor (hoặc load từ `shared/reward-catalog.json` sau khi làm 1.2), giữ cấu trúc 7 bậc hiếm (Common→Legendary, tổng weight 100) nhưng đổi tên/giá trị theo chủ đề — xem cột "Reward pool" ở bảng mục 2.

### 1.5 Persistence: giữ in-memory hay chuyển Prisma thật?
`GameSessionsService`/`RewardsService` hiện toàn bộ dùng `Map`/array in-memory dù đã có schema Prisma đầy đủ (`GameSession`, `GameResult`, `Reward`, `RewardClaim`, `GamePlayHistory`).
- **Khuyến nghị cho đợt này:** giữ in-memory để tăng tốc độ hoàn thiện 9 game — không phải việc bắt buộc để đạt mục tiêu "nâng cấp chất lượng game".
- Ghi nhận thành **việc kỹ thuật riêng** (ticket) trước khi lên production: swap sang Prisma repository, đồng thời dùng `RewardClaim.idempotencyKey` (cột đã có sẵn nhưng chưa dùng) thay cho cơ chế check trùng thủ công hiện tại trong `completeSession`.

### 1.6 Tách 9 stage component ra file riêng
Theo đúng pattern `ValentineGashapon.tsx`, tách từng game khỏi khối inline trong `GameStageRenderer.tsx`:

| Slug | File mới |
|---|---|
| `beauty-lucky-draw` | `frontend/src/components/games/BeautyLuckyDraw.tsx` |
| `flower-picking` | `frontend/src/components/games/FlowerPicking.tsx` |
| `love-letter` | `frontend/src/components/games/LoveLetter.tsx` |
| `lucky-christmas-tree` | `frontend/src/components/games/LuckyChristmasTree.tsx` |
| `santa-gift` | `frontend/src/components/games/SantaGift.tsx` |
| `snow-catcher` | `frontend/src/components/games/SnowCatcher.tsx` |
| `lucky-envelope` | `frontend/src/components/games/LuckyEnvelope.tsx` |
| `golden-dragon` | `frontend/src/components/games/GoldenDragon.tsx` |
| `firework-fortune` | `frontend/src/components/games/FireworkFortune.tsx` |

`GameStageRenderer.tsx` chỉ còn giữ vai trò dispatch (import + if-chain, hoặc đổi sang `Record<string, Component>` lookup map cho gọn).

---

## 2. Bảng tổng quan kỹ thuật (dùng làm checklist)

| # | Game | Slug | Cơ chế chính | Điểm cố định/tối đa | C# anti-cheat | Reward pool theo chủ đề |
|---|---|---|---|---|---|---|
| 21 | Trái Tim May Mắn | `lucky-heart` | Nhịp tim → quay gashapon (đã có) | 580 / cap 650 | So khớp điểm cố định ± dung sai | Trang sức (đã có: ruby/sapphire...) |
| 22 | Beauty Lucky Draw | `beauty-lucky-draw` | Chọn 1/3 món mỹ phẩm → phát sáng | 550 / cap 600 | Chặn hoàn thành < 600ms kể từ lúc bắt đầu (không đủ thời gian nhìn 3 lựa chọn) | Mỹ phẩm: son, nước hoa mini, mặt nạ, set skincare, voucher spa |
| 23 | Hái Hoa Nhận Quà | `flower-picking` | Vuốt/chạm hái hoa → hoa bung cánh → hiện thưởng | 520 / cap 580 | Chặn hoàn thành < 500ms | Hoa & voucher hoa tươi: hồng đơn, tulip, bó hoa lớn, voucher florist |
| 24 | Mở Thư Tình | `love-letter` | Bấm phong thư → thư mở → hiệu ứng tim → voucher | 560 / cap 620 | Chặn hoàn thành < 700ms (đủ thời gian xem hiệu ứng tim) | Quà đôi: thiệp, voucher hẹn hò, quà tặng người yêu |
| 25 | Cây Thông May Mắn | `lucky-christmas-tree` | Chạm ngôi sao → cây sáng lung linh → quà | 540 / cap 600 | Chặn hoàn thành < 500ms | Trang trí Noel: quả châu, đèn LED, hộp quà Giáng sinh |
| 26 | Ông Già Noel Tặng Quà | `santa-gift` | Bấm chuông → Santa xuất hiện → ném hộp quà | 600 / cap 660 | Chặn hoàn thành < 900ms (đủ thời gian animation Santa xuất hiện) | Hộp quà theo size: nhỏ/vừa/lớn/đặc biệt |
| 27 | Hứng Tuyết Nhận Điểm | `snow-catcher` | Chạm tuyết rơi trong 12s → tích điểm | biến thiên, cap 650 | Đối chiếu `score == count(CATCH events) × 30`, lệch → dùng điểm tính lại từ event | Điểm/voucher nhỏ, ít item hiếm (game arcade, thưởng theo hiệu suất) |
| 28 | Lì Xì Phát Tài | `lucky-envelope` | Chọn bao lì xì đỏ → mở → tiền/điểm bay ra | 570 / cap 630 | Chặn hoàn thành < 500ms | Lì xì: 10k/20k/50k/100k điểm, bao lì xì vàng (hiếm) |
| 29 | Rồng Vàng Săn Lộc | `golden-dragon` | Chạm Rồng liên tục → rồng bay → phun chữ LỘC | biến thiên (15 tap × 40), cap 650 | Đối chiếu số `TAP` events, chặn tốc độ > 20 tap/s (bot) — tái dùng heuristic của `tap-fast` | Vàng/Lộc: đồng xu vàng, thỏi vàng, túi lộc phát tài |
| 30 | Pháo Hoa Tài Lộc | `firework-fortune` | Bấm KHAI PHÁO → pháo hoa nổ → quà lớn | 700 / cap 750 | Chặn hoàn thành < 800ms | Grand prize: voucher lớn, jackpot hiếm nhất trong 10 game |

---

## 3. Kế hoạch chi tiết từng game

Mỗi mục dưới đây chỉ nêu phần **khác với chuẩn chung** đã mô tả ở mục 0 (state machine, API flow, sound/telemetry pattern) — không lặp lại phần giống nhau.

### #21 · Trái Tim May Mắn (`lucky-heart`)
- **React:** giữ nguyên `ValentineGashapon.tsx`; thêm bước mở đầu "nhịp tim" (2-3 pulse `scale` trên icon tim, ~600ms) trước khi crank gashapon kích hoạt — khớp đúng "Cách chơi" gốc.
- **NestJS/C#:** chỉ cần đổi tên hiển thị (mục 1.1); logic giữ nguyên.

### #22 · Beauty Lucky Draw (`beauty-lucky-draw`)
- **React (`BeautyLuckyDraw.tsx`):** 3 thẻ mỹ phẩm hiển thị song song (dùng `GameVisualArt` case mới hoặc icon SVG tự vẽ cho son/nước hoa/mặt nạ) → chạm 1 thẻ → 2 thẻ còn lại mờ đi (`opacity: 0.3`), thẻ chọn phát sáng viền vàng (`box-shadow` animate) 800ms → reveal reward. `track('ITEM_SELECT', index)`.
- **C#:** thêm slug vào `MaxPermittedScores`; validate thời lượng phiên tối thiểu để chặn auto-click.

### #23 · Hái Hoa Nhận Quà (`flower-picking`)
- **React (`FlowerPicking.tsx`):** cụm 5-6 bông hoa (SVG, các loại khác nhau) bố trí trên "luống hoa"; gesture chạm/vuốt 1 bông → cánh hoa animate bung ra (`stagger` các path SVG cánh hoa bằng Framer Motion) → hoa "biến mất" nhường chỗ reward card. `track('FLOWER_PICK', flowerId)`.
- **C#:** thêm slug + cap; không cần heuristic phức tạp (single-action game).

### #24 · Mở Thư Tình (`love-letter`)
- **React (`LoveLetter.tsx`):** phong thư đóng → chạm → nắp thư animate mở (`rotateX`) → thư trượt ra → loạt icon tim nhỏ bay lên nền (particle, giới hạn ≤20 để tránh giật trên mobile) → sau ~700ms hiện voucher. `track('ENVELOPE_OPEN')`, `track('HEART_BURST', count)`.
- **C#:** cap 620; validate thời lượng tối thiểu do có 3 giai đoạn animation nối tiếp.

### #25 · Cây Thông May Mắn (`lucky-christmas-tree`)
- **React (`LuckyChristmasTree.tsx`):** cây thông SVG với 5-7 "ngôi sao/đèn" là các hotspot chạm được; chạm ngôi sao đỉnh cây → toàn bộ đèn trên cây sáng dần theo hiệu ứng lan tỏa (`staggerChildren` từ điểm chạm ra ngoài) → quà xuất hiện dưới gốc cây. `track('STAR_TAP')`.
- **C#:** cap 600; single-action, không cần heuristic riêng.

### #26 · Ông Già Noel Tặng Quà (`santa-gift`)
- **React (`SantaGift.tsx`):** chuông ở giữa màn hình → chạm → hiệu ứng rung chuông (`rotate` dao động giảm dần) + âm thanh chuông → Santa slide-in từ cạnh màn hình (Framer Motion `x: '-100%' → 0`) → dừng giữa khung → animate "ném" hộp quà (arc trajectory bằng `keyframes` trên `x`/`y`) rơi xuống → mở ra reward. Đây là game nhiều bước nhất trong nhóm — cần budget thời gian animation rõ ràng (~2.5-3s tổng) để không cảm giác giật cục. `track('BELL_RING')`, `track('SANTA_APPEAR')`, `track('GIFT_THROWN')`.
- **C#:** cap 660; validate thời lượng tối thiểu ~900ms (nhiều bước nhất nên ngưỡng chặn bot cao nhất trong nhóm "single-action").

### #27 · Hứng Tuyết Nhận Điểm (`snow-catcher`)
- Cơ chế arcade 12s đã có sẵn (state machine `useEffect`+`setInterval`) — **giữ nguyên cấu trúc**, chỉ cần:
- **React:** đảm bảo mỗi lần bắt tuyết đều gọi `track('CATCH', 1)` (không chỉ cộng điểm local) để backend/C# có dữ liệu đối chiếu; giới hạn số bông tuyết render đồng thời (object pooling, ví dụ tối đa 15 DOM node cùng lúc) để tránh rớt khung hình trên thiết bị yếu.
- **NestJS:** không đổi — `gameplayEvents` đã được forward nguyên vẹn sang C#.
- **C#:** đây là game **cần heuristic thật sự** thay vì chỉ so sánh với 1 hằng số — `ValidateGameSession` phải: đếm `GameplayEvents.Count(e => e.EventType == "CATCH")`, tính `expectedScore = catchCount * 30`, nếu `|clientScore - expectedScore| > tolerance` thì dùng `expectedScore` làm điểm chính thức thay vì tin client. Cap tuyệt đối = 650 (≈ 21-22 bông tuyết/12s, ngưỡng hợp lý cho tay người).

### #28 · Lì Xì Phát Tài (`lucky-envelope`)
- **React (`LuckyEnvelope.tsx`):** lưới 3-4 bao lì xì đỏ (SVG, hoa văn khác nhau) → chọn 1 → bao "mở" (animate scale + rotate nhẹ) → tiền vàng/xu bay ra từ bao (particle burst hướng lên trên, dùng cùng cơ chế particle đã dùng ở `love-letter`) → hiện số điểm/voucher. `track('ENVELOPE_SELECT', index)`.
- **C#:** cap 630; reward pool thiên về mệnh giá "lì xì" (xem bảng mục 2) — đây là game phù hợp nhất để thử nghiệm reward pool có nhiều bậc giá trị điểm số rõ ràng thay vì chỉ vật phẩm.

### #29 · Rồng Vàng Săn Lộc (`golden-dragon`)
- Cơ chế N-tap-combo đã có (15 taps) — **giữ nguyên cấu trúc tap-combo**, nâng cấp phần visual để khớp đúng "Cách chơi" gốc (rồng bay qua màn hình, phun chữ LỘC) thay vì chỉ đổi màu/scale tĩnh:
- **React:** rồng SVG di chuyển theo path ngang màn hình (`offsetPath`/keyframes trên `x`), mỗi lần chạm trúng rồng → rồng "phun" 1 chữ "LỘC" bay lên rồi biến mất (short-lived particle text) + progress bar tích lũy 15 lần chạm → khi đủ, rồng bùng nổ ánh sáng vàng → reward. `track('TAP', 1)` mỗi lần trúng.
- **C#:** đây là game N-tap thứ 2 cần heuristic đối chiếu — tái dùng logic hiện có cho slug `tap-fast` (đếm `TAP` events, chặn tốc độ bất thường > 20 tap/s) nhưng áp cho `golden-dragon`; `expectedScore = min(tapCount, 15) * 40`.

### #30 · Pháo Hoa Tài Lộc (`firework-fortune`)
- **React (`FireworkFortune.tsx`):** nút lớn "KHAI PHÁO" ở giữa → chạm → chuỗi pháo hoa nổ liên tiếp (3-4 đợt, mỗi đợt 1 cụm particle burst màu khác nhau, dùng `<canvas>` thay vì DOM node nếu > 50 particle/đợt để giữ hiệu năng — xem lưu ý mục 5) → cuối cùng pháo hoa "kết" thành khung hiện phần thưởng lớn. Đây là màn "chốt hạ" nhóm Tết nên reward pool nên có tỉ lệ Legendary cao nhất nhóm 10 game (xem bảng mục 2). `track('LAUNCH')`, `track('BURST', wave)`.
- **C#:** cap 750 (cao nhất nhóm, đúng vai trò "grand prize"); validate thời lượng tối thiểu ~800ms cho đủ chuỗi animation nổ pháo.

---

## 4. Thứ tự triển khai đề xuất

| Sprint | Nội dung | Lý do |
|---|---|---|
| 1 | Mục 1 (shared catalog, sửa `MaxPermittedScores`, sửa tên #21, tách file) | Nền tảng — mọi sprint sau phụ thuộc vào đây, tránh làm lại |
| 2 | #21 (nhịp tim), #24 Mở Thư Tình | Cùng mùa Valentine, tái dùng particle "tim bay" giữa 2 game |
| 3 | #22 Beauty, #23 Hái Hoa, #25 Cây Thông, #26 Santa, #27 Hứng Tuyết | Nhóm cơ chế đơn giản/đã có sẵn state machine (snow-catcher), làm nhanh để có khối lượng lớn game đạt chuẩn |
| 4 | #28 Lì Xì, #29 Rồng Vàng, #30 Pháo Hoa | Phức tạp nhất về particle/animation (canvas, path animation, N-tap) — cần buffer thời gian nhiều nhất |

## 5. Rủi ro & lưu ý kỹ thuật
- **Hiệu năng particle trên mobile:** các game có nhiều particle đồng thời (`love-letter`, `lucky-envelope`, `snow-catcher`, `firework-fortune`) nên giới hạn số DOM node động (≤20-30) hoặc chuyển sang vẽ trên `<canvas>` — Framer Motion với >50 node cùng lúc dễ giật trên thiết bị Android tầm trung.
- **Không tin điểm số client tuyệt đối:** 2 game biến thiên theo hành vi (`snow-catcher`, `golden-dragon`) **bắt buộc** phải validate lại bằng `GameplayEvents` ở C#, không chỉ so sánh `clientScore` với 1 cap tĩnh — nếu không sẽ là lỗ hổng gian lận rõ ràng nhất trong nhóm 10 game này.
- **Chốt tên hiển thị trước khi khoá catalog:** vì mục 1.2 gộp dữ liệu về 1 nguồn, cần xác nhận toàn bộ 10 tên hiển thị (đặc biệt #21) với stakeholder trước khi tạo `shared/game-catalog.json`, tránh phải sửa lại 3 tầng lần nữa.
- **`RewardClaim.idempotencyKey`** đã có sẵn trong schema Prisma nhưng chưa được dùng — nếu vẫn giữ in-memory (mục 1.5) ở đợt này, ít nhất nên áp dụng key này vào cơ chế chống complete-trùng hiện tại (`game-sessions.service.ts`) thay vì logic tự chế, vì đây là input trực tiếp cho việc migrate Prisma sau này.
