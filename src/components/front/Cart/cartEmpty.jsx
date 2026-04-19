import React from 'react';
import { Link } from 'react-router-dom';
import { FaCartPlus } from 'react-icons/fa';

const CartEmpty = () => {
  return (
    <>
      <div className="card cart-empty-state">
        <div className="container ui-container d-flex flex-column align-items-center text-center py-3">
          <h2 className="mb-3">您的購物車是空的</h2>
          <Link to="/products" className=" btn ui-btn ui-btn--outline-primary mt-2">
            <div className="d-flex">
              <FaCartPlus size={20} className="me-1" />
              去逛商品
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartEmpty;
