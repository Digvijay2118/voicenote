const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const mysql = require('mysql2/promise');
const path = require('path');



const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"]
  }
})



// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'audio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('send-audio',async (audioBlob) => {
   
    // const audioPath = `public/audio/${Date.now()}.webm`;
    const audioFileName = `${Date.now()}.webm`;
    
    const audioPath = path.join(__dirname, 'public', 'audio', audioFileName);


    // fs.writeFileSync(audioPath, audioBlob);
    fs.writeFile(audioPath, audioBlob, async (err) => {
      if (err) {
        console.error('Error writing audio file:', err);
        return;
      }
      try {

        const audioURL = 
        // `http://localhost:5000
        `/audio/${audioFileName}`;
    // Save audio message in the database
    const insertQuery = 'INSERT INTO audio_message (sender, audio_url) VALUES (?, ?)';
    await pool.query(insertQuery, [socket.id, audioURL]);

    // Broadcast the audio to all connected users
    socket.broadcast.emit('received-audio', audioURL);
  } catch (error) {
    console.error('Error saving audio message in the database:', error);
  }
  });
});

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.post('/api/store-audio', async (req, res) => {
  const { sender, audioPath } = req.body;

  try {
    // Save audio message in the database
    const insertQuery = 'INSERT INTO audio_message (sender, audio_url) VALUES (?, ?)';
  await pool.execute(insertQuery, [sender, audioPath]);

    res.status(201).json({ message: 'Audio message stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error storing audio message' });
  }
});

// API endpoint to fetch audio messages
app.get('/api/audio-messages', async (req, res) => {
  try {
    const selectQuery = 'SELECT * FROM audio_message';
    const [rows, fields] = await pool.execute(selectQuery);
    res.status(200).json(rows);  
    // console.log("rows--->",rows)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching audio messages' });
  }
});

// Serve audio files from the 'public' folder
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
