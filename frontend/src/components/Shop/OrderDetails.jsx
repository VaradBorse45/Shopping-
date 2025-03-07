import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  
  const [adressof,setAdressof]=useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [statusorder,setStatusorder]=useState('');
  const [imgurl,setImgurl]= useState('');

  const  shopId  = useParams();
  const [orders, setOrders] = useState([]);
  
  const orderid = shopId.id
  console.log(orderid)
  useEffect(() => {
    const fetchOrdersByShopId = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/orders/${orderid}`);
        setOrders(response.data);
        setAdressof(response.data.shippingAddress);
        console.log(response.data)
        setStatusorder(response.data.status)
        setImgurl(response.data.product.images)
      } catch (error) {
        console.error("Error fetching orders:", error);
      } 
    };

    fetchOrdersByShopId();
  }, [shopId]);

  
  const data = null;
  
  const orderUpdateHandler = async (e) => {
    
    await axios
      .put(
        `http://localhost:8000/update-order-status/${orderid}`,
        {
          status,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Order updated!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
    
  }
 



  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{orders._id}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{orders.createdAt?.slice(0, 10)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          UserId: <span>{orders.user}</span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {/* {data &&
        data?.cart.map((item, index) => ( */}
          <div className="w-full flex items-start mb-5">
            <img
              src={imgurl}
              alt=""
              className="w-[80x] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{orders.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                {/* US${item.discountPrice} x {item.qty} */}
              </h5>
            </div>
          </div>
        {/* ))} */}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>US${orders.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {adressof.address1 +
              " " +
              adressof.address2}
          </h4>
          <h4 className=" text-[20px]">{adressof.country}</h4>
          <h4 className=" text-[20px]">{adressof.city}</h4>
          <h4 className=" text-[20px]">{adressof.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
        </div>
      </div>
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
      {
        <select
          value={status}  
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {['Select Status',
            "Processing",
            "Transferred to delivery partner",
            "Shipping",
            "Received",
            "On the way",
            "Delivered",
          ]
           
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      }
      {/* {
        statusorder=== "Processing refund" || statusorder === "Refund Success" ? (
          <select value={status} 
       onChange={(e) => setStatus(e.target.value)}
       className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
      >
        {[
            "Processing refund",
            "Refund Success",
          ]
            .slice(
              [
                "Processing refund",
                "Refund Success",
              ].indexOf(data?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
      </select>
        ) : null
      } */}

      <div
        className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
        onClick={ orderUpdateHandler}
      >
        Update Status
      </div>
    </div>
  );
};

export default OrderDetails;
