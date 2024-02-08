import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useCallback } from 'react';

function Hello() {
  const getAllSources = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('sources.list');
    
    window.electron.ipcRenderer.once('sources.list', (response) => {
      console.log('response', response);
      // @ts-ignore
      alert('response message ' + response.message);
    });
  }, []);

  const getAndSetMarchiveIsSetupStoredSetting = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('utilities.marchive-is-setup', true);

    window.electron.ipcRenderer.once('utilities.marchive-is-setup', (response) => {
      console.log('response', response);
      // @ts-ignore
      alert('response message ' + response.message);
    });
  }, []);

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>Marchive</h1>
      <div className="Hello">
        <button type="button" onClick={() => getAllSources()}>
          Get all sources
        </button>
        <button type="button" onClick={() => getAndSetMarchiveIsSetupStoredSetting()}>
          Set Marchive is setup
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
