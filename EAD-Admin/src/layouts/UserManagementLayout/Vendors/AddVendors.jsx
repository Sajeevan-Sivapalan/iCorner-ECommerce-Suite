import { useState } from "react";
import { Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import { FaArrowLeft } from "react-icons/fa"; // Import arrow icon
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast
import "./CustomCss.css";
import axios from "axios";

const AddVendor = () => {
  const [vendorData, setVendorData] = useState({
    username: "",
    email: "",
    password: "",
    mobileNumber: "",
    address: "",
    role: "Vendor",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate(); // Hook for navigation

  const validateForm = () => {
    const newErrors = {};
    if (!vendorData.username) newErrors.username = "Username is required.";
    if (!vendorData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(vendorData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!vendorData.password) newErrors.password = "Password is required.";
    if (!vendorData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(vendorData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits.";
    }
    if (!vendorData.address) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? true : newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors === true) {
      setLoading(true); // Set loading to true
      try {
        await axios.post("http://192.168.109.81/iCorner/api/user", vendorData);
        toast.success("Vendor added successfully!"); // Show success toast
        setTimeout(() => {
          navigate("/users/view-vendors");
        }, 2000); // Delay navigation to allow the toast to show
      } catch (error) {
        console.error("Error adding vendor:", error);
        toast.error("Error adding vendor. Please try again."); // Show error toast
      } finally {
        setLoading(false); // Reset loading state
      }
    } else {
      if (Object.keys(validationErrors).length > 1) {
        setModalMessage("Please fill all fields.");
      } else {
        const singleError = Object.values(validationErrors)[0];
        setModalMessage(singleError);
      }
      setShowModal(true);
    }
  };

  const handleBack = () => {
    navigate("/users/view-vendors"); // Navigate back to view vendors
  };

  return (
    <Container className="add-vendor-container mt-4">
      {/* Back Arrow */}
      <div className="mb-4">
        <Button
          variant="link"
          className="p-0 text-decoration-none"
          onClick={handleBack}
        >
          <FaArrowLeft size={24} /> {/* Left arrow icon */}
        </Button>
      </div>

      <h2 className="text-center mb-4 main-heading">Add Vendor</h2>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={vendorData.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={vendorData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={vendorData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formMobileNumber">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="mobileNumber"
                value={vendorData.mobileNumber}
                onChange={handleChange}
                isInvalid={!!errors.mobileNumber}
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={vendorData.address}
                onChange={handleChange}
                isInvalid={!!errors.address}
                className="input-field"
              />
            </Form.Group>

            {/* Submit Button */}
            <div className="text-center">
              <Button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Vendor"}{" "}
                {/* Change button text */}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Modal for Errors */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Form Validation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="text-white bg-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddVendor;
