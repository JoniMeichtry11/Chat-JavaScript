const http = require('http');
const path = require('path');

const express = require('express');

const mongoose = require('mongoose');

const morgan = require('morgan');

const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// DB conection

mongoose.connect('mongodb://localhost/chat-database')
    .then(db => {
        console.log("DB is connected");
    })
    .catch(err => console.log(err))

// Settings

app.set('port', process.env.PORT || 3000);

require('./sockets')(io);

// Static files

console.log(__dirname);

app.use(express.static(path.join(__dirname, 'public')));

// Escuchando servidor

server.listen(app.get('port'), () => {
    console.log(`Server started on port`, app.get('port'));
});

morgan('dev')