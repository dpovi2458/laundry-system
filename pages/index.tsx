// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  customerName: string;
  service: string;
  weight: number;
  total: number;
  status: string;
  date: string;
}

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [service, setService] = useState('lavado');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    const savedOrders = localStorage.getItem('laundryOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('laundryOrders', JSON.stringify(orders));
  }, [orders]);

  const calculateTotal = () => {
    const pricePerKg = service === 'lavado' ? 5 : service === 'planchado' ? 3 : 7;
    return parseFloat(weight) * pricePerKg;
  };

  const handleSubmit = () => {
    if (!customerName || !weight) return;

    const newOrder: Order = {
      id: Date.now(),
      customerName,
      service,
      weight: parseFloat(weight),
      total: calculateTotal(),
      status: 'pendiente',
      date: new Date().toLocaleDateString()
    };

    setOrders([...orders, newOrder]);
    setCustomerName('');
    setWeight('');
  };

  const updateStatus = (orderId: number, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? {...order, status: newStatus} : order
    );
    setOrders(updatedOrders);
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sistema de Lavandería</h1>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre del cliente"
            className="w-full p-2 border rounded"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          
          <select
            className="w-full p-2 border rounded"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="lavado">Lavado (S/5 x kg)</option>
            <option value="planchado">Planchado (S/3 x kg)</option>
            <option value="completo">Servicio Completo (S/7 x kg)</option>
          </select>

          <input
            type="number"
            placeholder="Peso en kg"
            className="w-full p-2 border rounded"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Crear Orden
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{order.customerName}</h3>
                <p className="text-sm text-gray-600">{order.date}</p>
                <p>Servicio: {order.service}</p>
                <p>Peso: {order.weight} kg</p>
                <p className="font-semibold">Total: S/{order.total}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completado">Completado</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}