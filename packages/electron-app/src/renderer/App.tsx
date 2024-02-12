import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback } from 'react';

import icon from '../../assets/icon.svg';

import './App.css';

function Hello() {
  const getAllSources = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('sources.list');
    
    window.electron.ipcRenderer.once('sources.list', (sources, error) => {
      if (error != null) {
        alert('response error ' + (error as Error).message);
        return;
      }

      console.log('response', sources);
      // @ts-ignore
      alert('response length ' + sources.length);
    });
  }, []);

  const showSource = useCallback((sourceId: number) => {
    window.electron.ipcRenderer.sendMessage('sources.show', sourceId);
    
    window.electron.ipcRenderer.once('sources.show', (source, error) => {
      if (error != null) {
        alert('response error ' + (error as Error).message);
        return;
      } 

      console.log('response', source, error);
      // @ts-ignore
      alert('response ' + source?.url);
    });
  }, []);

  const getAllSourceDomains = useCallback(() => {
    window.electron.ipcRenderer.sendMessage('source-domains.list', true);
    
    window.electron.ipcRenderer.once('source-domains.list', (sourceDomains, error) => {
      if (error != null) {
        alert('response error ' + (error as Error).message);
        return;
      }

      console.log('response', sourceDomains);
      // @ts-ignore
      alert('response length ' + sourceDomains.length);
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

        <button type="button" onClick={() => showSource(1)}>
          Show source 1
        </button>

        <button type="button" onClick={() => showSource(100)}>
          Show source 100
        </button>

        <button type="button" onClick={() => getAllSourceDomains()}>
          Get all source domains
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
