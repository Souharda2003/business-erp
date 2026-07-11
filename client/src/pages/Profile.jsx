import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

import { getProfile, updateProfile, deleteProfile } from "../services/profile";

import "../css/profile.css";

function Profile() {
  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",

    mobile: "",

    email: "",

    owner_name: "",

    company_name: "",

    phone: "",

    gst_number: "",

    address: "",

    city: "",

    state: "",

    pincode: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      setForm({
        name: res.data.name || "",

        mobile: res.data.mobile || "",

        email: res.data.email || "",

        owner_name: res.data.owner_name || "",

        company_name: res.data.company_name || "",

        phone: res.data.phone || "",

        gst_number: res.data.gst_number || "",

        address: res.data.address || "",

        city: res.data.city || "",

        state: res.data.state || "",

        pincode: res.data.pincode || "",
      });

      localStorage.setItem(
        "company_name",

        res.data.company_name || "Business ERP",
      );

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProfile(form);

      alert(res.data.message);

      localStorage.setItem(
        "company_name",

        form.company_name,
      );

      setEditMode(false);

      loadProfile();
    } catch (err) {
      console.log(err);

      alert("Update Failed");
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete Your  Account Permanently?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteProfile();

      localStorage.clear();

      alert("Account Deleted Successfully");

      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="profile-page">
          <BackButton />

          <h1 className="profileHeading">My Profile</h1>
          {!editMode ? (
            <div className="profileCard">
              <div className="profileImage">
                <img src="https://ui-avatars.com/api/?name=S" alt="profile" />
              </div>

              <div className="profileItem">
                <label>Owner Name</label>

                <span>{form.owner_name}</span>
              </div>

              <div className="profileItem">
                <label>Company Name</label>

                <span>{form.company_name}</span>
              </div>

              <div className="profileItem">
                <label>Email</label>

                <span>{form.email}</span>
              </div>

              <div className="profileItem">
                <label>Phone</label>

                <span>{form.phone}</span>
              </div>

              <div className="profileItem">
                <label>Business Address</label>

                <span>{form.address}</span>
              </div>

              <div className="profileItem">
                <label>GST Number</label>

                <span>{form.gst_number}</span>
              </div>

              <div className="profileButtonGroup">
                <button className="editBtn" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>

                <button className="deleteBtn" onClick={handleDelete}>
                  Delete Profile
                </button>
              </div>
            </div>
          ) : (
            <form className="profileCard" onSubmit={handleSubmit}>
              <div className="profileImage">
                <img src="https://ui-avatars.com/api/?name=S" alt="profile" />
              </div>

              <div className="profileGrid">
                <div className="inputGroup">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label>Mobile Number</label>

                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label>Owner Name</label>

                  <input
                    type="text"
                    name="owner_name"
                    value={form.owner_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label>Company Name</label>

                  <input
                    type="text"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label>Business Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="inputGroup">
                  <label>GST Number</label>

                  <input
                    type="text"
                    name="gst_number"
                    value={form.gst_number}
                    onChange={handleChange}
                  />
                </div>

                <div className="inputGroup fullWidth">
                  <label>Business Address</label>

                  <textarea
                    name="address"
                    rows="4"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="inputGroup">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="inputGroup">
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="inputGroup">
                  <label>Pincode</label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="profileButtonGroup">
                <button type="submit" className="saveBtn">
                  Update Profile
                </button>

                <button
                  type="button"
                  className="cancelBtn"
                  onClick={() => {
                    setEditMode(false);

                    loadProfile();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
