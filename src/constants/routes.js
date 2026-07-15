export const ROUTES = {
  // Public
  HOME: "/",
  CONTEST_DETAIL: "/lomba/:id",

  // Admin
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_CONTEST_NEW: "/admin/lomba/baru",
  ADMIN_CONTEST_EDIT: "/admin/lomba/:id",
};

export const PAGE_TITLES = {
  [ROUTES.HOME]: "Daftar Lomba",
  [ROUTES.CONTEST_DETAIL]: "Detail Lomba",
  [ROUTES.ADMIN_LOGIN]: "Login Admin",
  [ROUTES.ADMIN_DASHBOARD]: "Dashboard Admin",
  [ROUTES.ADMIN_CONTEST_NEW]: "Lomba Baru",
  [ROUTES.ADMIN_CONTEST_EDIT]: "Edit Lomba",
};
