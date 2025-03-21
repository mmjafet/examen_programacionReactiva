import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import URL_BACKEND from '../common/server';


const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    axios.get(URL_BACKEND)
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProductos = productos.filter(producto =>
    producto.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryData = productos.reduce((acc, producto) => {
    const category = producto.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const chartData = Object.keys(categoryData).map(category => ({
    name: category,
    count: categoryData[category]
  }));

  const toggleChart = () => {
    setShowChart(!showChart);
  };

  return (
    <div>
      <style>
        {`
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background-color: #f2f2f2;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .form-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .search-input {
            padding: 10px;
            font-size: 16px;
            width: 70%;
          }
          .toggle-button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
          }
          .toggle-button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
      <h1>Productos</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button onClick={toggleChart} className="toggle-button">
          {showChart ? 'Ver Tabla' : 'Ver Gráfico'}
        </button>
      </div>
      {showChart ? (
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      ) : (
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>PRECIO</th>
              <th>CATEGORÍA</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.title}</td>
                <td>${producto.price}</td>
                <td>{producto.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Productos;