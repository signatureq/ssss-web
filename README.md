# ssss / web developer

Персональный сайт-визитка о веб-дизайне и разработке. Telegram: [@added08](https://t.me/added08).

Сайт: [signatureq.github.io/ssss-web-developer](https://signatureq.github.io/ssss-web-developer/).

Визуальное направление вдохновлено midu.design. Вёрстка, тексты, графика и WebGL-эффект написаны для этого проекта; чужие работы и отзывы не используются.

## Запуск

Требуется Node.js 20.19+ или 22.12+.

```sh
npm install
npm run dev
```

Сайт откроется на http://127.0.0.1:5173/.

## Сборка

```sh
npm run build
npm run preview
```

Папка `dist` — готовая статическая версия.

## Публикация

GitHub Pages автоматически обновляется после push в `main`. Workflow `.github/workflows/deploy.yml` устанавливает зависимости, собирает сайт и публикует `dist`.

Для сборки с путями GitHub Pages:

```sh
BASE_PATH=/ssss-web-developer/ npm run build
BASE_PATH=/ssss-web-developer/ npm run preview
```

Локальная разработка остаётся на корневом пути `/`. В настройках репозитория Pages выбран источник GitHub Actions.

## Состав

- `index.html` — тексты, блоки и ссылки.
- `src/style.css` — оформление и мобильная версия.
- `src/main.js` — плавный скролл, меню, сцены и авторский WebGL-эффект.
- `src/process.js` — геометрическая анимация блока с этапами работы.
- `public/fonts` — локальные шрифты Manrope, лицензия OFL.

Vite, GSAP и Lenis. Отсутствуют аналитика, cookie-баннеры, внешние iframe и формы сбора данных. При `prefers-reduced-motion` движение отключается. Если WebGL недоступен, остаётся статичный фон.
