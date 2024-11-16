import { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");  // Thêm state để lưu thông báo lỗi

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const response = await axios.post(newUrl, data, { withCredentials: true });  // Đảm bảo cookie được gửi đi
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                setError(response.data.message);  // Lưu thông báo lỗi vào state
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");  // Lỗi khi không thể kết nối với server
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className='login-popup-inputs'>
                    {currState === "Sign Up" &&
                        <input
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder='Your Name'
                            required
                        />
                    }
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder='Your Email'
                        required
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder='Password'
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}  {/* Hiển thị thông báo lỗi */}

                <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>

                {currState === "Login"
                    ? <p>Don't have an account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Click here</span></p>
                }

            </form>
        </div>
    );
};

export default LoginPopup;