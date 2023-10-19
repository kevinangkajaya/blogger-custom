import logo from './logo.svg';
import './App.css';
import GooglePicker from './uploader/GooglePicker';
import InsertToMemeMamMum from './blog/InsertToMemeMamMum';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './login/Login';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
