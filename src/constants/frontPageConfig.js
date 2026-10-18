// Header 的透明／捲動與 main 的頂部留白使用同一份 Hero 路徑。
// /home 沿用既有判定，不代表新增首頁路由；實際首頁仍是 /。
export const FRONT_HERO_PATHS = ['/', '/home', '/about-us', '/products', '/articles', '/customer-orders'];

export const isFrontHeroPage = (pathname) => FRONT_HERO_PATHS.includes(pathname);
