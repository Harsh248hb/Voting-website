const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const socketIo = require('socket.io');
const db = require('./db');
const userRouter = require('./routes/userRoutes');
const candidateRouter = require('./routes/candidateRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:"http://localhost:5173",
       methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});


app.use(cors());
app.use(bodyParser.json());

// Attach io to app
app.set('io', io);

// Routes
app.use('/user', userRouter);
app.use('/candidate', candidateRouter);


app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("vote_casted", () => {
    console.log("Vote casted - broadcasting update...");
    io.emit("vote_updated"); // Notify all clients to refresh vote counts
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


