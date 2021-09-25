$(function(){
    const socket = io();

    // Obteniendo elementos del DOM de la interfas.

    const $messageForm = $("#message-form");
    const $message = $("#message");
    const $chat = $("#chat");

    // Obteniendo elementos del DOM del NickName.

    const $nickForm = $("#nickForm");
    const $nickName = $("#nickName");
    const $nickError = $("#nickError");


    const $users = $("#userName");

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickName.val(), data => {
            if (data){
                $("#nickWrap").hide();
                $("#contentWrap").show();
            } else {
                $("#nickError").html(`
                    <div class="alert alert-danger">
                        Ese usuario ya existe :/
                    </div>
                `);
            }
            $("nickName").val("");
        })
    });

    // Eventos

    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $message.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $message.val('')
    });

    socket.on('new message', data => {
        $chat.append(`<b> ${data.nick}: </b> ${data.msg} <br/>`);
        document.getElementById('enviar').play();
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++){
            html += `<p style="font-size: 2em"><i class="fas fa-user me-2"></i>${data[i]}</p>`
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        console.log(data);
        $chat.append(`<p class="whisper"><b>${data.nick}: </b>${data.msg}</p>`);
    });

    socket.on('load old msgs', msg => {
        for (let i = msg.length - 1; i >= 0; --i){
            $chat.append(
                `<p class="p-2 bg-secondary w-75 animate__animated animate__backInUp"><b>${msg[i].nick}</b>: ${msg[i].msg}</p>`
            );
        };
    });

    function displayMsg(data) {
        console.log(data[1].nick);
    }

});