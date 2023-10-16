import logo from './logo.svg';
import './App.css';
import GooglePicker from './uploader/GooglePicker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GooglePicker />
      </header>
    </div>
  );
}

export default App;
