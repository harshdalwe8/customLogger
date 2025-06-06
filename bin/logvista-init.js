// bin/logvista-init.js
const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

(async () => {
    try {
        const { organisationId } = await inquirer.prompt({
            type: 'input',
            name: 'organisationId',
            message: 'Enter your Organisation ID:'
        });

        const response = await axios.get(`https://central.example.com/api/organization/${organisationId}/config`);
        const config = response.data;

        const { projectId } = await inquirer.prompt({
            type: 'list',
            name: 'projectId',
            choices: config.projects,
            message: 'Select a Project ID:'
        });

        const { serverId } = await inquirer.prompt({
            type: 'list',
            name: 'serverId',
            choices: config.servers,
            message: 'Select a Server ID:'
        });

        const { usePostgres } = await inquirer.prompt({
            type: 'confirm',
            name: 'usePostgres',
            message: 'Do you want to use PostgreSQL instead of SQLite?',
            default: false
        });

        let dbUrl;
        if (usePostgres) {
            const dbDetails = await inquirer.prompt([
                { name: 'host', message: 'PostgreSQL Host:' },
                { name: 'port', message: 'Port:', default: '5432' },
                { name: 'user', message: 'User:' },
                { name: 'password', message: 'Password:', type: 'password' },
                { name: 'database', message: 'Database name:' },
            ]);

            dbUrl = `postgresql://${dbDetails.user}:${dbDetails.password}@${dbDetails.host}:${dbDetails.port}/${dbDetails.database}`;
        } else {
            dbUrl = 'file:./logvista.db';
        }

        const envContent = `ORGANISATION_ID=${config.organisation_id}
CLIENT_ID=${config.client_id}
PROJECT_ID=${projectId}
SERVER_ID=${serverId}
KEY_VALIDITY_DATE=${config.key_validity_date}
DB_URL=${dbUrl}
PORT=5566
CENTRAL_API_BASEURL=https://central.example.com/api
`;

        fs.writeFileSync('.env', envContent);

        execSync('npx prisma init', { stdio: 'inherit' });
        fs.copyFileSync(path.join(__dirname, '../prisma/schema.prisma'), './prisma/schema.prisma');
        execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });

        console.log('✅ logvista initialized successfully.');
    } catch (err) {
        console.error('❌ Initialization failed:', err.message);
    }
})();
