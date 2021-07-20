require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const { PeerServer } = require('peer');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
    SocketServer(socket);
})

// Create peer server
PeerServer({port: 3001, path: '/'})

// Routes
app.use('/', require('./routes/authRouter'));
app.use('/', require('./routes/userRouter'));
app.use('/', require('./routes/postRouter'));
app.use('/', require('./routes/commentRouter'));
app.use('/', require('./routes/notifyRouter'));
app.use('/', require('./routes/messageRouter'));

const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongoDB');
})

const port = process.env.PORT || 5000;

http.listen(port, () => {
    console.log('Connecting to PORT: ', port);
});
