# Logvista

**Logvista** is a self-hosted log ingestion service. 

## 📦 Install
```bash
npm install log-vista
```

## ⚙️ Initialize
```bash
npx logvista init
```

## 🚀 Start Server
```bash
npx logvista start
```

## 📤 Send Logs
```bash
curl -X POST http://localhost:5566/logs -H "Content-Type: application/json" -d '{ "timestamp": "2025-06-05T18:20:00Z", "level": "error", "message": "Payment failed", "tag": "user", "metadata": {"userId": "123"}, "projectId": "xxx", "clientId": "yyy" }'
```

## 📥 Retrieve Logs
```bash
curl 'http://localhost:5566/logs?projectId=xxx&clientId=yyy&page=1&limit=50'
```

---
MIT License © Your Name


# 🎉 Custom Logger

An efficient, customizable, and easy-to-use logging library for Node.js applications! This logger captures various log levels (info, warning, error, etc.), stores them in a MySQL database, and displays logs in a structured JSON format on the console/terminal. Ideal for real-time log tracking with an optional server!

## ✨ Features

- 🔹 **Log Levels**: Manage logs across levels—info, warn, error, etc.
- 🔹 **Database Storage**: Logs are saved to MySQL using connection pooling for efficient performance.
- 🔹 **JSON Output**: Logs appear in clean JSON with timestamps for clarity.
- 🔹 **Real-Time Viewing (Optional)**: Track logs live with the optional server.
- 🔹 **Configurable Setup**: Quick setup with `config.json`.

## 📥 Installation

Install the package:

```bash
npm install customlogger
```

🛠 Prerequisites
Node.js (latest stable version)
MySQL Database
mysql2 npm package for MySQL support

## 🚀 Quick Start
1️⃣ Configure Your Database
Create a config.json file in your project root:

```json
{
  "host": "your_mysql_host",
  "user": "your_database_user",
  "password": "your_database_password",
  "database": "your_database_name",
  "port": 3306
}
```
2️⃣ Import and Initialize Logger
In your main file, import the logger and initialize the database:

```javascript
const { logMessage, initializeDatabase } = require('customlogger');

// Initialize the database
initializeDatabase();
```

3️⃣ Log Your Messages
Add logs across various levels like so:

```javascript
Copy code
(async () => {
  const now = new Date().toISOString();
  await logMessage('info', 'This is an info message', { key: 'value' }, now);
  await logMessage('warn', 'This is a warning', { warningCode: 101 }, now);
  await logMessage('error', 'This is an error message', { errorCode: 'E500' }, now);
})();
```

## 📂 Project Structure
```plaintext
src/
├── cli.js           # Command-line interface script
├── index.js         # Main logging functionality
├── database.js      # Database connection logic using connection pooling
└── server.js        # Optional server for real-time log viewing
config.json          
package.json
```
## 🏃 Running Your Application
To start logging, run your main file:

```bash
node your_main_file.js
```

## 📝 Example Log Output
```json
{"level":"info","message":"This is an info message","metadata":{"key":"value"},"timestamp":"2024-10-30T19:04:31.758Z"}
```

## 🛠 Troubleshooting
⚠️ Database Connection Issues: Make sure MySQL is running, and credentials in config.json are correct.
⚠️ Date Format Errors: Use YYYY-MM-DD HH:MM:SS format for timestamp to avoid issues when saving logs to the database.

## 💡 License
This project is licensed under the MIT License.

## 🤝 Contributing
Contributions are welcome! For major changes, open an issue first to discuss what you’d like to modify.

## 🎉 Thank you for using Custom Logger! Happy Logging! 🚀