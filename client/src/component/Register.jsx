import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [time, setTime] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3003/register", { name, email, password, time })
      .then((result) => {
        console.log(result);
        // Redirect to the login page after successful registration
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  const handleLoginClick = () => {
    // Navigate to the login page when the "Login" button is clicked
    navigate("/login");
  };

  return (
    <div>
      <div className="text-center">
        <img src="15.png" width={600} />
      </div>
      <div className="d-flex justify-content-center align-items-center bg-purple mt-5">
        <div className="bg-white p-3 rounded w-25">
          <h2>register</h2>
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
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                className="form-control rounded-0"
                type="text"
                placeholder="Enter Email"
                name="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit" className="btn btn-success w-100 rounded-0">
              Register
            </button>
            <p>Already Have an Account</p>
            <button
              className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
