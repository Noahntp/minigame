import React, { useState, useEffect } from 'react';
import { Sliders, Save, RotateCcw, Check, Percent } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { api } from '../../services/api';
import type { DropRateItem } from '../../types/game';

interface DropRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId?: string;
}

export const DropRateModal: React.FC<DropRateModalProps> = ({
  isOpen,
  onClose,
  gameId = 'lucky-heart',
}) => {
  const [items, setItems] = useState<DropRateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setSavedSuccess(false);
      api.getDropRates(gameId).then((res) => {
        setItems(res.items || []);
        setLoading(false);
      });
    }
  }, [isOpen, gameId]);

  const totalWeight = Math.max(1, items.reduce((sum, item) => sum + item.weight, 0));

  const handleWeightChange = (rewardId: string, newWeight: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.rewardId === rewardId ? { ...item, weight: Math.max(1, newWeight) } : item
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = items.map((i) => ({ rewardId: i.rewardId, weight: i.weight }));
    const res = await api.updateDropRates(gameId, updates);
    setItems(res.items || items);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    const defaults = [
      { id: 'rw-01', w: 35 },
      { id: 'rw-02', w: 25 },
      { id: 'rw-03', w: 15 },
      { id: 'rw-05', w: 12 },
      { id: 'rw-06', w: 8 },
      { id: 'rw-07', w: 4 },
      { id: 'rw-08', w: 1 },
    ];
    setItems((prev) =>
      prev.map((item) => {
        const found = defaults.find((d) => d.id === item.rewardId);
        return found ? { ...item, weight: found.w } : item;
      })
    );
  };

  const getRarityBadge = (rarity: string): 'gold' | 'rose' | 'amber' | 'emerald' => {
    switch (rarity) {
      case 'Legendary':
        return 'rose';
      case 'Epic':
        return 'gold';
      case 'Rare':
        return 'amber';
      default:
        return 'emerald';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tỉ Lệ Rớt Phần Thưởng">
      <div className="space-y-6">
        <div className="p-4 rounded-card bg-cream text-xs text-ink-muted flex items-start gap-3">
          <Sliders className="w-5 h-5 text-candy-brand shrink-0 mt-0.5" />
          <div>
            <span className="font-display font-bold text-ink block mb-1">
              Trọng Số Phân Bổ Server-Side
            </span>
            <span>
              Kéo thanh trượt để điều chỉnh trọng số (Weight) của từng voucher hoặc phần quà. Server
              tự động tính lại % xác suất rớt thực tế tương ứng.
            </span>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-control bg-[#DFF7EC] text-[#12805A] text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Đã cập nhật tỉ lệ rớt mới thành công!</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-candy-brand">
            <div className="animate-spin h-6 w-6 border-2 border-candy-brand border-t-transparent rounded-full mx-auto mb-2" />
            <span className="text-xs font-bold">Đang tải cấu hình từ máy chủ...</span>
          </div>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
            {items.map((item) => {
              const currentPercent = ((item.weight / totalWeight) * 100).toFixed(1);
              return (
                <div
                  key={item.rewardId}
                  className="p-4 rounded-card bg-cream space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getRarityBadge(item.rarity)} size="sm">
                        {item.rarity}
                      </Badge>
                      <span className="font-display text-sm font-bold text-ink">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono-num text-xs text-ink font-bold">
                      <Percent className="w-3.5 h-3.5 text-candy-tet-gold" />
                      <span>{currentPercent}%</span>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-ink-muted font-bold">
                      <span>Trọng số: {item.weight} pts</span>
                      <span>Xác suất: ~{currentPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={item.weight}
                      onChange={(e) => handleWeightChange(item.rewardId, parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-white rounded-full appearance-none cursor-pointer accent-candy-brand focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t-2 border-cream flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-ink-muted hover:text-ink hover:bg-cream transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt Lại</span>
          </button>

          <Button size="md" onClick={handleSave} isLoading={saving}>
            <Save className="w-4 h-4 mr-1.5" />
            <span>Lưu Tỉ Lệ Mới</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
