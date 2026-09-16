import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { useGameStore } from '../../store/useGameStore';

interface BrandStoreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherCode?: string;
  voucherDiscount?: number;
  voucherName?: string;
}

export const BrandStoreCheckoutModal: React.FC<BrandStoreCheckoutModalProps> = ({
  isOpen,
  onClose,
  voucherCode = 'ROYALE-50K',
  voucherDiscount = 50000,
  voucherName = 'Voucher Giảm 50.000đ Tri Ân Khách Hàng',
}) => {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('Nguyễn Văn An');
  const [customerPhone, setCustomerPhone] = useState<string>('0912 345 678');
  const [customerAddress, setCustomerAddress] = useState<string>('72 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh');

  const productPrice = 450000;
  const discountAmount = voucherDiscount;
  const finalPrice = Math.max(0, productPrice - discountAmount);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWin(soundEnabled);
    setOrderPlaced(true);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ffffff'],
      });
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#ffffff] text-[#1e293b] rounded-[24px] shadow-2xl overflow-hidden border border-slate-200 my-auto"
        >
          {/* Mockup Mobile Browser Address Bar */}
          <div className="bg-[#f8fafc] px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-sans">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 max-w-xs mx-3 bg-[#e2e8f0] px-3 py-1 rounded-full text-center text-[11px] font-mono font-medium text-slate-700 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>https://brandstore.vn/checkout</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 font-bold flex items-center justify-center text-sm shadow">
                B
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">BrandStore.vn</h3>
                <p className="text-[10px] text-amber-300 font-medium">Gian Hàng Website Chính Hãng</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Giỏ hàng (1)</span>
            </div>
          </div>

          {/* Step 5 Banner Callout */}
          <div className="bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2 text-white text-xs font-semibold flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              BƯỚC 5: MUA LẠI TRÊN WEBSITE THƯƠNG HIỆU
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              Tiết Kiệm 50.000đ
            </span>
          </div>

          {!orderPlaced ? (
            <form onSubmit={handlePlaceOrder} className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
              {/* Product Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3 items-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-amber-100 to-rose-100 flex items-center justify-center text-3xl shadow-inner border border-amber-200/60">
                  🧴
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    Bộ Chăm Sóc Da Thiên Nhiên Cao Cấp
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dung tích 150ml • Chiết xuất hoa cúc & nhân sâm</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-bold text-slate-900 text-sm">
                      {productPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">520.000đ</span>
                    <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                      -13%
                    </span>
                  </div>
                </div>
              </div>

              {/* Applied Voucher Highlight Card (Step 4 -> Step 5 transition) */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>Đã áp dụng voucher: -{discountAmount.toLocaleString('vi-VN')}đ</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                      Mã: <strong className="bg-emerald-200/70 px-1 py-0.5 rounded">{voucherCode}</strong> • {voucherName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery Info Form */}
              <div className="space-y-2.5 text-left">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Thông Tin Giao Hàng</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block mb-1">Họ và tên</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 focus:bg-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 focus:bg-white focus:border-red-500 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-medium block mb-1">Địa chỉ nhận hàng</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 focus:bg-white focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Order Calculation Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính (1 sản phẩm)</span>
                  <span className="font-mono">{productPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Voucher Mini Game
                  </span>
                  <span className="font-mono">-{discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-emerald-600 font-medium">Miễn phí (Freeship)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                  <span className="font-bold text-sm">Tổng thanh toán:</span>
                  <span className="font-bold text-lg text-red-600 font-mono">
                    {finalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-[0_8px_20px_rgba(239,68,68,0.35)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Đặt Hàng Ngay (Tiết Kiệm {discountAmount.toLocaleString('vi-VN')}đ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Order Placed Success Confirmation */
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
                  HOÀN TẤT BƯỚC 5 THÀNH CÔNG
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Đã Áp Dụng Voucher & Đặt Hàng!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Khách hàng từ Sàn TMĐT đã chuyển đổi thành công về Website thương hiệu <strong>BrandStore.vn</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã đơn hàng D2C:</span>
                  <span className="font-mono font-bold text-slate-900">WEB-D2C-88912</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Voucher sử dụng:</span>
                  <span className="font-mono font-bold text-emerald-600">{voucherCode} (-{discountAmount.toLocaleString('vi-VN')}đ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <span className="font-semibold text-slate-900">{customerName} ({customerPhone})</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Tổng thanh toán:</span>
                  <span className="font-mono font-bold text-base text-red-600">{finalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Đóng Cửa Sổ
                </button>
                <button
                  type="button"
                  onClick={() => setOrderPlaced(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Thử Lại
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
