import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store.ts';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './index.css';
import App from './App.tsx';
import AuthProvider from './Provider/authProvider';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <BrowserRouter future={{v7_startTransition: true,v7_relativeSplatPath: true}}> 
            <App />
          </BrowserRouter>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
