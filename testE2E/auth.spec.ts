import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test('login correcto redirige al área del usuario', async ({ page }) => {
    await page.goto('/login');

    await page.locator('#login-email').fill('admin@gmail.com');
    await page.locator('#login-password').fill('123456');
    await page.locator('#login button[type="submit"]').click();

    await expect(page).not.toHaveURL('/login');
  });

  test('login con credenciales incorrectas muestra error', async ({ page }) => {
    await page.goto('/login');

    await page.locator('#login-email').fill('admin@gmail.com');
    await page.locator('#login-password').fill('password-incorrecto');
    await page.locator('#login button[type="submit"]').click();

    await expect(page.locator('.form-error')).toBeVisible();
  });

test('cerrar sesión limpia la sesión y redirige', async ({ page }) => {
  await page.goto('/login');

  await page.locator('#login-email').fill('admin@gmail.com');
  await page.locator('#login-password').fill('123456');
  await page.locator('#login button[type="submit"]').click();

  await expect(page).not.toHaveURL('/login');

  // Abre el dropdown del header
  await page.getByRole('button', { name: /menú de usuario/i }).click();

  // Espera a que el enlace sea visible y hace click
  await page.getByRole('banner').getByRole('link', { name: /cerrar sesión/i }).waitFor({ state: 'visible' });
  await page.getByRole('banner').getByRole('link', { name: /cerrar sesión/i }).click();

  await expect(page).toHaveURL('/login');
});

  test('ruta protegida redirige al login sin sesión', async ({ page }) => {
    await page.goto('/mis-colecciones');
    await expect(page).toHaveURL(/login/);
  });
});