/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react"
import axios from "axios"

export const StoreContext = createContext(null)

const StoreContextProvider = (props) =>{    
    const [cartItems,setCartItems] = useState({});

    const url = "http://localhost:4000"

    const [token,setToken] = useState("");
    const [food_list,setFoodlist] = useState([])

    const addToCart = async(itemId)=>{
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
            
        }
    }
    const removeFromCart =  async(itemId) =>{ 
        setCartItems((prev) => {
            const updatedItems = { ...prev };
            if (updatedItems[itemId] === 1) {
                delete updatedItems[itemId];
            } else {
                updatedItems[itemId] -= 1;
            }
            return updatedItems;
        });

        if (token) {

            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
            
        }
    }
    const getTotalCartAmount = ()=>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = food_list.find((product)=>product._id===item);
            totalAmount += itemInfo.price* cartItems[item];
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList = async()=>{
        const response = await axios.get(url+"/api/food/list");
        console.log("Fetched food list:", response.data.data);
        setFoodlist(response.data.data)
    }

    const loadCartData = async(token)=>{
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData);

       
        
    }

    useEffect(()=>{
        
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
            
            
        }
        loadData();
    },[])

    

    const handleLogin = async (email, password) => {
    try {
    const response = await axios.post('http://localhost:4000/api/login', { email, password });
    const { userId } = response.data; // Giả sử server trả về userId

    // Lưu userId vào localStorage
    localStorage.setItem('userId', userId);
    
  } catch (error) {
    console.error("Login failed:", error);
  }
};


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        handleLogin
}


    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>

    )
}
export default StoreContextProvider;