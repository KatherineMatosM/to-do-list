const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '../public')));

describe('Servidor Express', () => {
  test('GET / devuelve index.html con status 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('My Tasks');
  });

  test('Ruta no existente devuelve index.html (SPA fallback)', async () => {
    const response = await request(app).get('/ruta-inexistente');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('My Tasks');
  });
});