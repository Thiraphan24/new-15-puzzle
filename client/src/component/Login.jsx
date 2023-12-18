import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request for user authentication
      const response = await axios.post("http://localhost:3003/login", {
        name,
        password,
      });

      // Log the entire response.data object
      console.log("Response data:", response.data);

      // Handle successful login
      if (response.data.name) {
        // Redirect to the board page and pass the user's name as state
        navigate("/board", { state: { name: response.data.name } });
      } else {
        console.error("Name is undefined in the response data");
      }
    } catch (error) {
      // Handle login failure (e.g., display an error message)
      console.error("Login failed:", error.response.data);
    }
  };

  const handleRegister = () => {
    // Handle the registration process (e.g., navigate to the registration page)
    navigate("/");
  };

  return (
    <div>
      <div className="text-center">
        <img src="15.png" width={600} alt="Logo" />
      </div>
      <div className="d-flex justify-content-center align-items-center bg-purple mt-5">
        <div className="bg-white p-3 rounded w-25">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name">
                <strong>Name</strong>
              </label>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Enter Name"
                name="name"
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <input
                className="form-control rounded-0"
                type="password"
                placeholder="Enter Password"
                name="password"
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-success w-100 rounded-0" type="submit">
              Login
            </button>
          </form>

          <p>You don't have an account yet.</p>
          <button
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
