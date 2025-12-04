import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClientProvider } from './context/ClientContext';
import { ProjectProvider } from './context/ProjectContext';
import { InvoiceProvider } from './context/InvoiceContext';
import { SettingsProvider } from './context/SettingsContext';
import { TimeLogProvider } from './context/TimeLogContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Invoices from './pages/Invoices';
import TimeTracking from './pages/TimeTracking';
import Settings from './pages/Settings';

function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <ClientProvider>
          <ProjectProvider>
            <InvoiceProvider>
              <TimeLogProvider>
                <Router>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/time-tracking" element={<TimeTracking />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                  <ToastContainer />
                </Router>
              </TimeLogProvider>
            </InvoiceProvider>
          </ProjectProvider>
        </ClientProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}

export default App;
