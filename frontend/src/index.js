import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createStore } from 'redux';

// const store = createStore(reducer)

// const Login = 'Login'
// const Signup = 'Signup'

// function reducer(state = [], action){
//   switch(action.type) {
//     case Login:
//       return {
//         ... state
//       }
//     case Signup:
//       return {
//         ... state
//       }
//     default:
//       return state
//   }
// }


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
