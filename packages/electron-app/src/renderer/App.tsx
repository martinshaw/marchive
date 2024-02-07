import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useCallback } from 'react';

function Hello() {
  const getAllSources = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('sources.create', 'https://www.example.com', 'simple-webpage-screenshot');

    // Once, in response to previous call, console log the response
    window.electron.ipcRenderer.once('sources.create', (response) => {
      console.log('response', response);
    });
  }, []);

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>Marchive</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
          <button type="button" onClick={() => getAllSources()}>
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Get all sources
          </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
