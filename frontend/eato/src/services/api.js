const BASE_URL = process.env.REACT_APP_BASE_URL; // Ensure this is set to http://localhost:5002/api

if (!BASE_URL) {
  console.error('⚠️  REACT_APP_BASE_URL is undefined! Check your .env file and restart your dev server.');
}

// 🔐 Save JWT to localStorage
export function setAuthToken(token) {
  localStorage.setItem('token', token);
}

// 🔓 Remove JWT
export function clearAuthToken() {
  localStorage.removeItem('token');
}

// 📥 Login Function
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');

  const data = await res.json();
  if (data.token) {
    setAuthToken(data.token);
    return data.token;
  } else {
    throw new Error('No token returned');
  }
}

// 🚚 Fetch Deliveries Assigned to Driver
export async function getAssignedDeliveries(driverId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found');

  // Use the provided driverId or extract it from the token
  const id = driverId || JSON.parse(atob(token.split('.')[1])).id;

  const res = await fetch(`${BASE_URL}/delivery/driver/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error('Failed to fetch assigned deliveries');
  return res.json();
}

// 📋 Fetch Unassigned Deliveries
export async function getUnassignedDeliveries() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found');

  const res = await fetch(`${BASE_URL}/delivery/unassigned`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Failed to fetch unassigned deliveries');
  return res.json();
}

// 🛠️ Assign Delivery to Driver
export async function assignDelivery(orderId, driverId, customerId, orderLocation) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found');

  const res = await fetch(`${BASE_URL}/delivery/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId, driverId, customerId, orderLocation }),
  });

  if (!res.ok) throw new Error('Failed to assign delivery');
  return res.json();
}

// 🔄 Update Delivery Status
export async function updateDeliveryStatus(orderId, status) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found');

  const res = await fetch(`${BASE_URL}/delivery/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) throw new Error('Failed to update delivery status');
  return res.json();
}

// 🔍 Track Specific Order
export async function getOrderStatus(orderId) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found');

  const res = await fetch(`${BASE_URL}/delivery/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.status === 401) throw new Error('Unauthorized - invalid token');
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}
