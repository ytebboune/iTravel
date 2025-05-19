const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, '../backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_FILE = path.join(BACKUP_DIR, `backup-${TIMESTAMP}.sql`);

// Créer le dossier de backup s'il n'existe pas
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Extraire les informations de connexion de l'URL de la base de données
const dbUrl = process.env.DATABASE_URL;
const dbInfo = new URL(dbUrl);

const command = `pg_dump -h ${dbInfo.hostname} -p ${dbInfo.port} -U ${dbInfo.username} -d ${dbInfo.pathname.slice(1)} -F c -f ${BACKUP_FILE}`;

console.log('Starting database backup...');

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup failed: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Backup stderr: ${stderr}`);
    return;
  }
  console.log(`Backup completed successfully: ${BACKUP_FILE}`);
}); 