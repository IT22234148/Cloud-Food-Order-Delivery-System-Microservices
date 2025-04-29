import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('http://localhost:5002/api/payment/list', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPayments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5002/api/payment/update/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      setPayments((prev) =>
        prev.map((payment) =>
          payment._id === id ? { ...payment, status: newStatus } : payment
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePayment = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this payment?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5002/api/payment/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setPayments((prev) => prev.filter((payment) => payment._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.orderId.toLowerCase().includes(search.toLowerCase()) ||
      pay.userId.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterMethod === 'all' || pay.method.toLowerCase() === filterMethod.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Payments List (Admin)</h2>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Methods</option>
          <option value="card">Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Order ID</th>
            <th style={styles.tableHeader}>User ID</th>
            <th style={styles.tableHeader}>Method</th>
            <th style={styles.tableHeader}>Amount (LKR)</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Created At</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((pay, index) => (
            <tr
              key={pay._id}
              style={{
                ...styles.tableRow,
                ...(index % 2 === 0 ? {} : { backgroundColor: '#f9fafb' }),
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f9fafb')
              }
            >
              <td style={styles.tableCell}>{pay.orderId}</td>
              <td style={styles.tableCell}>{pay.userId}</td>
              <td style={styles.tableCell}>{pay.method.toUpperCase()}</td>
              <td style={styles.tableCell}>{pay.amount}</td>
              <td style={styles.tableCell}>
                <select
                  value={pay.status}
                  onChange={(e) => handleStatusChange(pay._id, e.target.value)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: pay.status === 'paid' ? '#22c55e' : '#f59e0b',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                >
                  <option value="paid">PAID</option>
                  <option value="pending">PENDING</option>
                </select>
              </td>
              <td style={styles.tableCell}>{new Date(pay.createdAt).toLocaleString()}</td>
              <td style={styles.tableCell}>
                <button onClick={() => handleDeletePayment(pay._id)} style={styles.deleteButton}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              ...styles.pageButton,
              backgroundColor: currentPage === index + 1 ? '#6c63ff' : '#ccc',
              color: currentPage === index + 1 ? '#fff' : '#000',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPaymentList;

const styles = {
  wrapper: {
    padding: '2rem',
    background: '#f1f5f9',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#1e293b',
    fontWeight: 'bold',
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center',
  },
  input: {
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    width: '300px',
    fontSize: '1rem',
    background: '#fff',
  },
  select: {
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    background: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
    backgroundColor: 'transparent',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  },
  tableHeader: {
    backgroundColor: '#FF4F00',
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'left',
    padding: '12px 16px',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
  },
  tableRow: {
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease-in-out',
  },
  tableCell: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    color: '#334155',
  },
  pagination: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.8rem',
  },
  pageButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    backgroundColor: '#6c63ff',
    color: '#fff',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  },
};
