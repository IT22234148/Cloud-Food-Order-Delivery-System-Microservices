export function notifyDriver(driverId, orderId) {
    console.log(`Notify Driver ${driverId} → New Order: ${orderId}`);
  }
  
  export function notifyCustomer(orderId, status) {
    console.log(`Notify Customer of Order ${orderId} → Status: ${status}`);
  }
  