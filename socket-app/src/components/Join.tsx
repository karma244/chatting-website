import React, { FormEvent, ChangeEvent, useEffect } from "react";
import { Link } from 'react-router-dom'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://14.38.139.193:4001/";


function App() {
  const [name, setName] = React.useState('');
  const socket = socketIOClient(ENDPOINT);
  
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  function EventJoin() {
    socket.emit('join server', { name: name }, (error: any) => {
      if (error)
        alert(error)
    });
  }

  return (
    <div className="container">
    <form className="join-from"
      onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}>
      <div className="join-inputs">
        <input
          type="text"
          autoComplete="off"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          value={name}
          placeholder="유저이름"
        />
      </div>
      <Link onClick={(e) => (!name ? (e.preventDefault(), alert('닉네임을 설정 해주세요')) : null)} to={`/SNS?name=${name}`}>
          <button className="join-button" type="submit" onClick={() => (!name ? null : EventJoin())}>가입하기</button>
      </Link>
    </form>
    </div>

  );
}

export default App;