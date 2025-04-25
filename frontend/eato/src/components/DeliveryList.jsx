import React from 'react';
import DeliveryItem from './DeliveryItem';

const DeliveryList = ({ deliveries, onStatusChange }) => {
  return (
    <div>
      {deliveries.map(delivery => (
        <DeliveryItem
          key={delivery._id}
          delivery={delivery}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default DeliveryList;
