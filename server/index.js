const app = require('express');
const server = require('http').createServer(app) //cria um servidor HTTP utilizando o módulo http do Node.js.
const io = require('socket.io')(server, {cors: {origin: 'http://192.168.16.128:5173'}});//Cria uma instância do Socket.IO que será usada para gerenciar as conexões e mensagens do chat. 
//O parâmetro server indica que o Socket.IO deve usar o servidor criado anteriormente, 
//enquanto o objeto cors define as configurações de Cross-Origin Resource Sharing (CORS) para permitir a comunicação com a origem http://192.168.100.109:5173.
//protocolo RFC WebSocket6455

const PORT = 3001; //define a porta em que o servidor irá escutar as conexões.

//Define um listener para o evento connection, que é acionado sempre que um novo usuário se conecta ao chat.
// O objeto socket representa a conexão do usuário e pode ser usado para enviar e receber mensagens.
//Função gera um log no servidor dos usuários que foram conectados ao chat.
io.on('connection', socket => {
  console.log('Usuário conectado! Seu ID é:', socket.id);


//Serve para o servidor receber o nome setado pelo usuário na tela de JOIN e armazenar em socket.data.username
  socket.on('set_username', username => {
    socket.data.username = username
    console.log(socket.data.username);
  })   

//serve para receber a mensagem de um usuário e retornar a mensagem enviada no chat com o TEXTO e NOME do autor para todos os usuarios conectados no CHAT.
  socket.on('message', text => {
    console.log('Mensagem recebida de', socket.data.username , text);

    //envia a menssagem recebida para a tela do usuário
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username
    })
  })

  //server para gerar uma log no servidor dos usuários que se desconectaram do chat.
  socket.on('disconnect', reason => {
    console.log('Usuário se desconectou!   ID:', socket.id)
    console.log(socket.data.username);
  })

})
//inicia o servidor e o faz escutar na porta especificada. O console imprime a mensagem "Server running..." para indicar que o servidor foi iniciado com sucesso.
server.listen(PORT, () => console.log('Server running...'))