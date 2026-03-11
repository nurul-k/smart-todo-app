const mongoose = require('mongoose');

//const uri = process.env.DATABASE_URL;
const url = "mongodb+srv://noorul_db_user:strongpassword123@cluster0.qr7x71t.mongodb.net/?appName=Cluster0";
console.log('URL is', url);

mongoose
  .connect(url, { bufferCommands: false })
  .then(() => { console.log('connected'); process.exit(0); })
  .catch(err => { console.error('connection error', err); process.exit(1); });