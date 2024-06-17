/* eslint-disable no-console */
import 'dotenv/config';
import discordClient from './modules/discord';
import app from './app';

const PORT = 3000;

discordClient.onReady(() => {
  console.log('Discord client is ready.');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
