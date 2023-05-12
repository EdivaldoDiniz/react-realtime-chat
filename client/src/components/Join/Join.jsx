import React, {useRef} from 'react'
import io from 'socket.io-client'
import style from './Join.module.css'
import {Input, Button} from '@mui/material'

export default function Join({setChatVisibility, setSocket}) {

  const usernameRef = useRef()

//função envia o nome preenchido pelo usuário com a tecla ENTER para o servidor.
  const getEnterKey = (e) => {
    if(e.key === 'Enter')
      handleSubmit()
  }
//serve para validar se tem algum nome escrito e sendo enviado para o servidor, se sim é efetuado a troca de JOIN para CHAT
//se sim ele vai enviar as informações de JOIN para o servidor e vai alterar a pagina de JOIN para CHAT 
  const handleSubmit = async () => {
    const username = usernameRef.current.value
    if(!username.trim()) return
    const socket = await io.connect('http://192.168.16.128:3001')
    socket.emit('set_username', username)
    setSocket(socket)
    setChatVisibility(true)
  }

  return (
    <div className={style['join-container']}>
      <h2>Chat em tempo real</h2>
      <Input inputRef={usernameRef} placeholder='Nome de usuário' onKeyDown={(e)=>getEnterKey(e)} />
      <Button sx={{mt:2}} onClick={()=>handleSubmit()} variant="contained">Entrar</Button>
    </div>
  )
}