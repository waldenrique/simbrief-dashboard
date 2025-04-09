import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Voos from './pages/Voos';
import Simbrief from './pages/Simbrief';
import FlightMap from './pages/FlightMap';
import LiveFlight from './pages/LiveFlight';
import AtcOnline from './pages/AtcOnline'; // Não esquece de importar isso!

const App = () => (
  <Router basename={process.env.PUBLIC_URL || '/'}>
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/voos" element={<Voos />} />
        <Route path="/simbrief" element={<Simbrief />} />
        <Route path="/mapa" element={<FlightMap />} />
        <Route path="/voo-ao-vivo" element={<LiveFlight />} />
        <Route path="/atc-online" element={<AtcOnline />} />
      </Routes>
    </MainLayout>
  </Router>
);

export default App;
