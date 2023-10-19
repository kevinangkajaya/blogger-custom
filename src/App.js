import logo from './logo.svg';
import './App.css';
import GooglePicker from './uploader/GooglePicker';
import InsertToMemeMamMum from './blog/InsertToMemeMamMum';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './login/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId={process.env.REACT_APP_BLOGGER_OAUTH_CLIENT}>
        {/* <header className="App-header"> */}
        {/* </header> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/google-picker" element={<GooglePicker />} />
            <Route path="/insert-to-mememammum" element={<InsertToMemeMamMum />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
