import { Router } from 'express';

const routes = new Router();

routes.get('/users', (req, res) => {
  return res.json({ ok: 'ok' });
});

module.exports = routes;
