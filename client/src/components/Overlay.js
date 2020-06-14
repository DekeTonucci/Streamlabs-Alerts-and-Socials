import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Overlay = (props) => {
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [theme, setTheme] = useState('default');
  const [notification, setNotification] = useState('');

  let socket;

  useEffect(() => {
    setUsername(props.match.params.username);
    setTheme(props.match.params.theme);
  }, []);

  useEffect(() => {
    if (isConnected === false) {
      setIsConnected(true);
      const data = {
        slKey:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjA5ODIyMkU5MjY2QzgyODMxMTJCIiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiMTcwODk0NjczIn0.79Q1LYxX4b_cGR6fTO1fsnuinAGr2EhBt0Y-py2Ex_M',
      };
      socket = io.connect('http://localhost:5000', {
        query:
          'slkey=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjA5ODIyMkU5MjY2QzgyODMxMTJCIiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiMTcwODk0NjczIn0.79Q1LYxX4b_cGR6fTO1fsnuinAGr2EhBt0Y-py2Ex_M',
      });
      // socket.emit('start', {
      //   slKey:
      //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6IjA5ODIyMkU5MjY2QzgyODMxMTJCIiwicmVhZF9vbmx5Ijp0cnVlLCJwcmV2ZW50X21hc3RlciI6dHJ1ZSwidHdpdGNoX2lkIjoiMTcwODk0NjczIn0.79Q1LYxX4b_cGR6fTO1fsnuinAGr2EhBt0Y-py2Ex_M',
      // });
    }
    socket.on('welcome', (payload) => {
      console.log('From Node Socket: ', payload);
    });
  }, []);

  return (
    <div className='w-screen h-screen p-0 m-0'>
      This will display Socials and Alerts for Users
      <div>{theme}</div>
      <div>{username}</div>
    </div>
  );
};

export default Overlay;
