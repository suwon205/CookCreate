import React, {useEffect} from 'react';
import Login from './component/views/Login';
import Signup from './component/views/Signup';
import { BrowserRouter, Link, Route, Routes, Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {createStore} from 'redux'

import { Provider, useSelector, useDispatch, connect } from 'react-redux';

function App() {
  return (
    // <Provider store={store}>
    <BrowserRouter>
    <div>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/SignUp">Cookiee 회원가입</Nav.Link>
            <Nav.Link href="/SignUp">Cookyer 회원가입</Nav.Link>
            <Nav.Link href="/Login">로그인</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Routes>
        <Route path='SignUp' element={<Signup/>}></Route>
        <Route path='Login' element={<Login/>}></Route>
      </Routes>
    </div>
    </BrowserRouter>
    // </Provider>
  );
}

export default App;
