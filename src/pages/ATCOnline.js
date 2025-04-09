import React, { useEffect, useState } from 'react';
import ATCOnlineMap from '../components/ATCOnlineMap';
import { Card } from '../components/ui/card';

const ATCOnline = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛫 ATC Online - Rede Waldenrique</h1>
      <Card className="p-4 mb-6">
        <p className="text-gray-700">Veja em tempo real todos os pilotos conectados na sua rede privada!</p>
      </Card>
      <ATCOnlineMap />
    </div>
  );
};

export default ATCOnline;
