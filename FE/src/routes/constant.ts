export const APP_ROUTES = {
  HOME: '/',
  CARD_BY_ID: '/:id',
  DEFAULT: '*',
};

export const toAuction = (id: number) => APP_ROUTES.HOME + id;
