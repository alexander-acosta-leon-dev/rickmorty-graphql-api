import cron from 'node-cron';
import { syncCharacters } from './characterSyncService';

// Run every 12 hours
export function startCronJobs() {
  // Runs at minute 0 every 12th hour (00:00, 12:00)
  cron.schedule('0 */12 * * *', async () => {
    await syncCharacters();
  });

  console.log('Cron job scheduled: runs every 12 hours.');
}
