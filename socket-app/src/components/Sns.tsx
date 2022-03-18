import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import socketIOClient from "socket.io-client";
import url from 'url'
import { useLocation } from "react-router-dom";
const ENDPOINT = "http://59.7.54.86:4001/";

interface Message { name: string, message: string }
const App = () => {
  const [messageList, setMessageList] = React.useState<Message[]>([]);
  const [value, setValue] = React.useState('');
  const socket = socketIOClient(ENDPOINT);
  
  let location = url.parse(useLocation().search, true);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.includes('!청소')) {
      setTimeout(() => {socket.emit('send message', { name: 'NOTIFICATION', message: `${messageList.length}만큼의 메세지가 삭제됐습니다` })})
      setValue('')
      setMessageList([])
    }
    else {
      socket.emit('send message', { name: location.query.name, message: value });
      setValue('')
    }
  };

  useEffect(() => {
    socket.on('receive message', (message: { name: string, message: string }) => {
      setMessageList(messageList => messageList.concat(message));
    })
  }, []);

  return (
    <div>
      <div className="chat-list">
        {messageList.map((item: Message, i: number) =>
          <div key={i} className="message">
            <p className="username">{item.name}</p>
            <p className="message-text">{item.message}</p>
          </div>
        )}
      </div>
      <form className="chat-form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}>
        <div className="chat-inputs">
          <input
            type="text"
            autoComplete="off"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            value={value}
            placeholder="메시지 입력"
          />
        </div>
        <button 
        onClick={(e) => (!value ? (e.preventDefault(), alert('빈 문자열은 입력하실 수 없습니다')) : null)} 
        type="submit">입력하기</button>
      </form>
    </div>
  );
}

export default App;