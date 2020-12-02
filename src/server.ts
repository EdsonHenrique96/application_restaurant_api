import setupApp from './app';

const APP_PORT = 3000;

setupApp()
  .then((app) => app.listen(APP_PORT, () => {
    console.log(`🚀 Server started on port ${APP_PORT}`);
  }))
  .catch((error) => console.error('💣 App setup failed'));
