import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface MiniGameDto {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  season: string;
  tag: string;
  index: string;
  theme: {
    primary: string;
    accent: string;
    bgGradient: string;
  };
  playLimitPerDay: number;
  active: boolean;
}

export const SEED_GAMES: MiniGameDto[] = [
  {
    id: 'game-01',
    slug: 'lucky-heart',
    name: 'Trái Tim May Mắn',
    subtitle: 'Xoay là có quà',
    description: 'Xoay chiếc máy kẹo xinh xắn, để những viên kẹo trái tim lăn tròn và thả xuống phần quà may mắn của bạn.',
    season: 'Valentine',
    tag: 'QUAY QUÀ',
    index: '01',
    theme: {
      primary: '#9f1239',
      accent: '#f43f5e',
      bgGradient: 'from-rose-950/80 via-black to-slate-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-02',
    slug: 'beauty-lucky-draw',
    name: 'Beauty Lucky Draw',
    subtitle: 'Chọn 1 trong 3',
    description: 'Ba lá bài làm đẹp bí ẩn đang chờ bạn khám phá — chạm chọn một lá để nhận món quà xinh xắn.',
    season: 'Phái Đẹp',
    tag: 'RÚT THẺ',
    index: '02',
    theme: {
      primary: '#831843',
      accent: '#d4af37',
      bgGradient: 'from-pink-950/70 via-black to-zinc-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-03',
    slug: 'flower-picking',
    name: 'Hái Hoa Nhận Quà',
    subtitle: 'Chạm hái 1 bông hoa',
    description: 'Dạo bước giữa vườn hoa nhỏ xinh và hái một bông hoa yêu thích để đón nhận phần quà ngọt ngào.',
    season: 'Phái Đẹp',
    tag: 'HÁI HOA',
    index: '03',
    theme: {
      primary: '#064e3b',
      accent: '#10b981',
      bgGradient: 'from-emerald-950/70 via-black to-slate-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-04',
    slug: 'love-letter',
    name: 'Mở Thư Tình',
    subtitle: 'Chạm để mở thư',
    description: 'Một bức thư dán niêm phong trái tim đang chờ được mở ra, bên trong là lời chúc và phần quà ngọt ngào.',
    season: 'Valentine',
    tag: 'MỞ THƯ',
    index: '04',
    theme: {
      primary: '#4c0519',
      accent: '#f43f5e',
      bgGradient: 'from-stone-950 via-burgundy-deep to-black',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-05',
    slug: 'lucky-christmas-tree',
    name: 'Cây Thông May Mắn',
    subtitle: 'Chạm ngôi sao',
    description: 'Chạm vào ngôi sao trên đỉnh cây thông để cả cây bừng sáng lung linh và món quà xuất hiện.',
    season: 'Giáng Sinh',
    tag: 'THẮP SÁNG',
    index: '05',
    theme: {
      primary: '#064e3b',
      accent: '#d4af37',
      bgGradient: 'from-green-950/80 via-black to-slate-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-06',
    slug: 'santa-gift',
    name: 'Ông Già Noel Tặng Quà',
    subtitle: 'Rung chuông gọi quà',
    description: 'Rung chiếc chuông nhỏ để gọi cỗ xe tuần lộc mang hộp quà đến tận nơi cho bạn.',
    season: 'Giáng Sinh',
    tag: 'RUNG CHUÔNG',
    index: '06',
    theme: {
      primary: '#1e1b4b',
      accent: '#818cf8',
      bgGradient: 'from-indigo-950 via-black to-slate-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-07',
    slug: 'snow-catcher',
    name: 'Hứng Tuyết Nhận Điểm',
    subtitle: '15 giây hứng tuyết',
    description: 'Di chuyển giỏ hứng thật nhanh để bắt trọn những bông tuyết rơi và ghi thật nhiều điểm trong 15 giây.',
    season: 'Giáng Sinh',
    tag: 'BẮT TUYẾT',
    index: '07',
    theme: {
      primary: '#0c4a6e',
      accent: '#38bdf8',
      bgGradient: 'from-sky-950/80 via-black to-slate-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-08',
    slug: 'lucky-envelope',
    name: 'Lì Xì Phát Tài',
    subtitle: 'Chọn 1 bao lì xì',
    description: 'Bốn bao lì xì đỏ thắm PHÚC - LỘC - THỌ - TÀI đang chờ bạn — chọn một bao để đón lộc đầu năm.',
    season: 'Tết Cổ Truyền',
    tag: 'MỞ LÌ XÌ',
    index: '08',
    theme: {
      primary: '#7f1d1d',
      accent: '#d4af37',
      bgGradient: 'from-red-950/80 via-black to-zinc-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-09',
    slug: 'golden-dragon',
    name: 'Rồng Vàng Săn Mồi',
    subtitle: 'Thần Long Săn Ngọc',
    description: 'Dẫn dắt Thần Long Hoàng Kim uốn lượn săn Ngọc Thần Châu, Chữ Lộc và Kim Bảo để thân rồng lớn mạnh và khai mở đại lộc.',
    season: 'Tết Cổ Truyền',
    tag: 'SĂN MỒI',
    index: '09',
    theme: {
      primary: '#78350f',
      accent: '#fbbf24',
      bgGradient: 'from-amber-950/80 via-black to-slate-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
  {
    id: 'game-10',
    slug: 'firework-fortune',
    name: 'Pháo Hoa Tài Lộc',
    subtitle: 'Khai pháo đón lộc',
    description: 'Chạm khai pháo để bầu trời bừng sáng muôn sắc pháo hoa và đón nhận phần quà lớn nhất năm mới.',
    season: 'Tết Cổ Truyền',
    tag: 'KHAI PHÁO',
    index: '10',
    theme: {
      primary: '#581c87',
      accent: '#d4af37',
      bgGradient: 'from-purple-950/80 via-black to-slate-950',
    },
    playLimitPerDay: 5,
    active: true,
  },
];

@Injectable()
export class MiniGamesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MiniGameDto[]> {
    try {
      if (this.prisma.miniGame) {
        const dbGames = await this.prisma.miniGame.findMany({ where: { active: true } });
        if (dbGames && dbGames.length > 0) {
          return dbGames.map(g => ({
            id: g.id,
            slug: g.slug,
            name: g.name,
            subtitle: (g.config as any)?.subtitle || '',
            description: g.description,
            season: g.season,
            tag: (g.config as any)?.tag || 'MINI GAME',
            index: (g.config as any)?.index || '01',
            theme: (g.config as any)?.theme || { primary: '#d4af37', accent: '#fff', bgGradient: '' },
            playLimitPerDay: g.playLimitPerDay,
            active: g.active,
          }));
        }
      }
    } catch {}

    return SEED_GAMES;
  }

  async findBySlug(slug: string): Promise<MiniGameDto> {
    const all = await this.findAll();
    const game = all.find(g => g.slug === slug || g.id === slug);
    if (!game) {
      throw new NotFoundException(`Mini game with slug "${slug}" not found`);
    }
    return game;
  }
}
