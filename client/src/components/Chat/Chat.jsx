import React, {useRef, useState, useEffect} from 'react'
import {Input} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import style from './Chat.module.css'

export default function Chat({socket}) {

  const bottomRef = useRef()
  const messageRef = useRef()
  const [messageList, setMessageList] = useState([])
  
//Função para adicionar um ouvinte de eventos ao socket para capturar mensagens recebidas e atualizar a lista de mensagens.
  useEffect(()=>{
    socket.on('receive_message', data => {
      setMessageList((current) => [...current, data])
    })

    return () => socket.off('receive_message')
  }, [socket])

//função para quando receber uma nova mensagem a barra ser rolada automaticamente para o final.
  useEffect(()=>{
    scrollDown()
  }, [messageList])

//função para quando o usuário enviar a mensagem o cursor de mensagem continuar na barra para enviar outra mensagem e limpar a mensagem que foi enviada.
  const handleSubmit = () => {
    const message = messageRef.current.value
    if(!message.trim()) return
    socket.emit('message', message)
    clearInput()
    focusInput()
  }

//função para limpar a barra de mensagem.
  const clearInput = () => {
    messageRef.current.value = ''
  }

//função para focar na barra de mensagem
  const focusInput = () => {
    messageRef.current.focus()
  }

//Função para enviar a mensagem utilizando o botão ENTER
  const getEnterKey = (e) => {
    if(e.key === 'Enter')
      handleSubmit()
  }

//Função para rolar a barra de mensagens para o final lentamente quando a pagina estiver muitas mensagens
  const scrollDown = () => {
    bottomRef.current.scrollIntoView({behavior: 'smooth'})
  }

  return (

    <div>
      <div className={style['chat-container']}>
        <div className={style["chat-body"]}>
        {
          messageList.map((message,index) => (
            <div className={`${style["message-container"]} ${message.authorId === socket.id && style["message-mine"]}`} key={index}>
              <div className="message-author"><strong>{message.author}</strong></div>
              <div className="message-text">{message.text}</div>
            </div>
          ))
        }
        
        <div ref={bottomRef} />
        </div>
        <div className={style["chat-footer"]}>
          <Input inputRef={messageRef} placeholder='Mensagem' onKeyDown={(e)=>getEnterKey(e)} fullWidth />
          <SendIcon sx={{m:1, cursor: 'pointer'}} onClick={()=>handleSubmit()} color="primary" />
        </div>
      </div>
    </div>
    
  )
}

