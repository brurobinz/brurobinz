import { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'


const PlaceOrder = () => {
  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext)

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async(event)=>{
    event.preventDefault();

    let orderItems = [];
    food_list.map((item)=>{
      if (cartItems[item._id]>0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];

        orderItems.push(itemInfo);
        
      }
    })
    let orderData = {
      address:data,
      items:orderItems,
      amount:getTotalCartAmount()+2,
    }
    const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });

      if (response.data.success) {
        const {session_url} = response.data;
        window.location.replace(session_url); // chuyen huong link thanh toan
        
      }
      else{
        alert("Error");
      }
  }
  console.log("URL:", url);


  
  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className='multi-field'>
          <input required  name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required   name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />

        </div>
        <input required  name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your Email' />
        <input required  name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className='multi-field'>
          <input required  name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required  name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />

        </div>
        <div className='multi-field'>
          <input required  name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='ZIP code' />
          <input required  name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />

        </div>
        <input required  name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='PhoneNumber' />
      </div>
      <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalCartAmount()+2}</b>
              </div>
              <button type='submit'>PROCESS TO CHECKOUT</button>
            </div>

      </div>
      </div>
      
    </form>
  )
}

export default PlaceOrder
