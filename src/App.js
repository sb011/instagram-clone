import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import PageRender from './customRouter/pageRender';
import PrivateRouter from './customRouter/PrivateRouter';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

import Alert from './components/alert/Alert';
import Header from './components/header/Header';
import StatusModel from './components/StatusModel';

import { refreshToken } from './redux/actions/authAction'
import { getPosts } from './redux/actions/postAction';
import { getSuggestions } from './redux/actions/suggestionsAction';
import { getNotifies } from './redux/actions/notifyAction';
import CallModal from './components/message/CallModal';
import Peer from 'peerjs';

import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes';
import SocketClient from './SocketClient';

function App() {
  const { auth, status, modal, call } = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket })
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
  }, [dispatch, auth.token])

  useEffect(() => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification

    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {

        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  })

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: '/', port: '3001'
    })

    dispatch({type: GLOBALTYPES.PEER, payload: newPeer})
  }, [dispatch])

  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModel />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}

          <Route exact path="/" component={auth.token ? Home : Login} />
          <Route exact path="/Register" component={Register} />
          <div className="wrap-page">
            <PrivateRouter exact path="/:page" component={PageRender} />
            <PrivateRouter exact path="/:page/:id" component={PageRender} />
          </div>

        </div>
      </div>
    </Router>
  );
}

export default App;
