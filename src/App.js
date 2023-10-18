import logo from './logo.svg';
import './App.css';
import GooglePicker from './uploader/GooglePicker';
import InsertToMemeMamMum from './blog/InsertToMemeMamMum';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <GooglePicker /> */}
        <InsertToMemeMamMum />
      </header>
    </div>
  );
}

export default App;
