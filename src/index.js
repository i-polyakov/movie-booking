import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { store} from './store';

import { Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter >
      <Routes>
        <Route path="/*" element={<App/>} />
      </Routes>
    </BrowserRouter>
  </Provider>

), document.getElementById('root'));
