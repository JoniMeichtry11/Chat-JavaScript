const Chat = require('./models/Chat');

module.exports = function (io){
    
    let users = {};

    io.on('connection', async socket => {
        console.log("new user connected");

        let messages = await Chat.find({}).sort({_id:-1}).limit(8);
        socket.emit('load old msgs', messages);

        socket.on('new user', (data, cb) => {
            if (data in users){
                cb(false);
            } else {
                cb(true);
                socket.nickNames = data;
                users[socket.nickNames] = socket;
                updateNicknames();
            };
        });

        socket.on('send message', async (data, cb) => {

            let msg = data.trim();

            if(msg.substr(0, 3) == '/w '){
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if(index != -1){
                    let name = msg.substring(0, index);
                    let msg = msg.substring(index + 1);
                    if(name in users){
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickNames
                        });
                    } else {
                        cb('Error! Ingresá un usuario válido >:v')
                    }
                } else {
                    cb('Error! Por favor, ingresá un mensaje')
                }
            } else {
                const newMsg = new Chat({
                    nick: socket.nickNames,
                    msg
                });

                await newMsg.save();

                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickNames
                });

                
            }

        });

        socket.on('disconnect', data => {
            if(!socket.nickNames) return;
            delete users[socket.nickNames];
            updateNicknames();
        })

        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));
        }
    });    
}