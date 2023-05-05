// AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import useStyles from './styles';

const AdminDashboard = () => {
    
    const classes = useStyles();
    const [sales, setSales] = useState([]);
  
    useEffect(() => {
      const fetchSales = async () => {
        const response = await axios.get('http://localhost:5000/admin/sales');
        console.log(response.data);
  
        setSales(response.data);
      };
  
      fetchSales();
    }, []);
  
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <h2>All Sales</h2>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sale ID</TableCell>
                <TableCell>Total Items</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>{sale._id}</TableCell>
                  <TableCell>{sale.totalitems}</TableCell>
                  <TableCell>{sale.subtotal}</TableCell>
                  <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <ul>
                      {sale.products.map((detail) => (
                        <li key={detail._id}>
                          {detail.title} ({detail.quantity}) - ${detail.price}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };
  
  export default AdminDashboard;
  