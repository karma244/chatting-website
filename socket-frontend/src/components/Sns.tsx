import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import socketIOClient from "socket.io-client";
import config from './config.json'
const ENDPOINT = "http://172.30.1.91:4001/";

interface Message { name: string, message: string, time: string }
const App = () => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const socket = socketIOClient(ENDPOINT);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    if (config.name == null)
    {
      alert('가입을 먼저 해주세요!')
      return;
    }
    e.preventDefault();
  };

  const sendMSG = () => {
    if (value.includes('!청소')) {
      setTimeout(() => {socket.emit('send message', { name: 'NOTIFICATION', message: `${messageList.length}만큼의 메세지가 삭제됐습니다`, time: `${new Date().getHours()} : ${new Date().getMinutes()}` })})
      setValue('')
      setMessageList([])
    }
    else {
      if (config.name == "") {
        alert("잘못된 접근을 하신 것 같습니다. 처음 페이지로 이동합니다.")
        window.location.replace("http://172.30.1.91:3000")
      }
      else {
        socket.emit('send message', { name: config.name, message: value, time: `${new Date().getHours()} : ${new Date().getMinutes()}` });
        setValue('')
      }
    }
  }

  const changeName = () => {
    config.name = name;
    socket.emit('changed name', {name : name});
    alert(`닉네임이 ${config.name}으로 변경되었어요.`)
  }

  useEffect(() => {
    socket.on('receive message', (message: { name: string, message: string, time: string }) => {
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
            <p className="message-time">{item.time}</p>
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
        className="btn btn-primary"
        onClick={() => (!value ? null : sendMSG())} 
        type="submit">입력하기</button>
        <div className="chat-inputs">
          <input
            type="text"
            autoComplete="off"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            value={name}
            placeholder="닉네임 변경"
          />
        </div>
        <button 
        className="btn btn-primary"
        onClick={(e) => (!name.trim() ? (e.preventDefault(), alert('닉네임은 공백이 아닙니다.')) : changeName())} 
        type="button">바꾸기</button>
      </form>
    </div>
  );
}

export default App;