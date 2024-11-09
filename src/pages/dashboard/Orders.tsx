import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchText, setSearchText] = useState(""); // For search text input
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]); // To store filtered data

  // Fetch orders from the API
  const getAllOrders = async () => {
    const response = await axios.get(
      // "http://localhost:4000/order/getAllOrders"
      "https://medimart-nayg.onrender.com/order/getAllOrders"
    );
    setOrders(response.data);
    setFilteredOrders(response.data); // Initialize with the complete data
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // Filter orders by orderId or userId based on search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = orders.filter((order) => {
      return (
        order._id.toLowerCase().includes(value) ||  
        order.user._id.toLowerCase().includes(value)
      );
    });

    setFilteredOrders(filtered);
  };
  // const updateOrderStatus = async (id: string, status: string) => {
  //   const response = await axios.post(
  //     "http://localhost:4000/order/updateOrderStatus",
  //     { id, status }
  //   );
  //   console.log(response);
  // };
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await axios.post(
        "https://medimart-nayg.onrender.com/order/updateOrderStatus",
        { id, status }
      );
      if (response.status === 200) {
        // Update order status in local state without re-fetching
        const updatedOrders = orders.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order
        );
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      }
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };


  // const [status, setStatus] = useState();

  // // Function to handle status change
  // const handleStatusChange = (event: any) => {
  //   const newStatus = event.target.value;
  //   setStatus(newStatus); // Update local state
  //   //  updateOrderStatus(order._id, newStatus); // Call the update function
  // };

  return (
    <div className="sm:p-[5rem] p-[1rem] pt-[2rem] flex flex-col justify-center">
      <div className="flex justify-end pb-2  sm:p-6">
        <Link to="/admin/dashboard/prescription">
          <CustomButton type="button" varient="secondary">
            Prescription
          </CustomButton>
        </Link>
        <Link to="/admin/dashboard/orders">
          <CustomButton type="button" varient="secondary">
            Orders
          </CustomButton>
        </Link>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search by Order ID or User ID"
          className="border p-2 rounded w-full md:w-[300px]"
        />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">Orders</h1>
        {filteredOrders?.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-4 mb-6 hover:shadow-xl transition-shadow"
            >
              <div className="md:flex md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-700">
                    Order ID: {order._id}
                  </h2>
                  <p className="text-gray-600 font-semibold">
                    UserId: {order.user._id}
                  </p>
                  <p className="text-gray-600">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Status:{" "}
                    <span className="font-semibold capitalize">
                      {order.orderStatus}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">
                    <span className="font-semibold">Total: </span>$
                    {order.totalPrice}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Payment Method: </span>
                    {order?.paymentMethod?.toUpperCase()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Payment status: </span>
                    {order?.paymentMethod?.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Brand
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                          Price
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item: any, index: any) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {item.productId
                              ? item.productId.name
                              : "Unknown Product"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {item.productId ? item.productId.brand : "N/A"}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-700">
                            ${item.price}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-gray-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-between ">
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">
                    Shipping Information:
                  </h4>
                  <p className="text-gray-600">
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}
                  </p>
                  <p className="text-gray-600">
                    Postal Code: {order.shippingAddress.postalCode}, Country:{" "}
                    {order.shippingAddress.country}
                  </p>
                </div>
                {order.orderStatus == "delivered" ? (
                  <> </>
                ) : (
                  <div className="mt-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => {
                        updateOrderStatus(order._id, e.target.value);
                      }}
                      className="h-[2.4rem] rounded-lg px-3 text-white bg-gray-500 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
