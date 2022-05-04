import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css"
const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <div class="login-form bg-success">
            <form onSubmit={(e) => {
                e.preventDefault();
                axios.post('/api/login/', { username, password }, { withCredentials: true })
                    .then(res => {
                        navigate("/employee");
                    })
                    .catch(err => setError(err.response.data.error));
            }} method="post">

                {error && <div>
                    {error}
                </div>}

                <label className="lb1">Username
                    <input type="text" className="input" name="username" s value={username} onChange={e => setUsername(e.target.value)} />
                </label>

                <label>Password
                    <input type="password" className="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <div className="btn">
                        <input type="submit" value="Submit" />
                    </div>

                </label>



            </form>
        </div>
    );
}

export default Login