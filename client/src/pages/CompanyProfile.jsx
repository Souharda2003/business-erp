import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

import {
  saveCompany,
  getCompany,
  updateCompany,
  deleteCompany,
} from "../services/company";
import "../css/settings.css";

function CompanyProfile() {
  const [editMode, setEditMode] = useState(false);

  const [companyId, setCompanyId] = useState(null);

  const [form, setForm] = useState({
    company_name: "",
    owner_name: "",
    gst_number: "",
    pan_number: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    bank_name: "",
    bank_account_no: "",
    ifsc_code: "",
  });

  useEffect(() => {
    loadCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (companyId) {
        await updateCompany(companyId, form);
        localStorage.setItem("company_name", form.company_name);
      } else {
        await saveCompany(form);
        localStorage.setItem("company_name", form.company_name);
      }

      await loadCompany();

      setEditMode(false);
      alert(companyId ? "Updated Successfully" : "Saved Successfully");
    } catch (err) {
      console.log(err);

      console.log(err.response?.data);
    }
  };
  const loadCompany = async () => {
    const res = await getCompany();

    if (res.data) {
      setCompanyId(res.data.id);

      setForm({
        company_name: res.data.company_name || "",
        owner_name: res.data.owner_name || "",
        gst_number: res.data.gst_number || "",
        pan_number: res.data.pan_number || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        pincode: res.data.pincode || "",
        bank_name: res.data.bank_name || "",
        bank_account_no: res.data.bank_account_no || "",
        ifsc_code: res.data.ifsc_code || "",
      });
      localStorage.setItem(
        "company_name",

        res.data.company_name || "Business ERP",
      );
      setEditMode(false);
    } else {
      setCompanyId(null);

      setEditMode(true);
    }
  };
  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure?");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCompany(companyId);
      await loadCompany();
      setCompanyId(null);

      setForm({
        company_name: "",

        owner_name: "",

        gst_number: "",

        pan_number: "",

        phone: "",

        email: "",

        address: "",

        city: "",

        state: "",

        pincode: "",
        bank_name: "",
        bank_account_no: "",
        ifsc_code: "",
      });

      setEditMode(true);

      alert("Deleted Successfully");
    } catch (err) {
      console.log(err);
    }
  };
  if (!editMode && companyId) {
    return (
      <div className="app">
        <Sidebar />

        <div className="main-content">
          <Navbar />

          <div className="settings-page">
            <BackButton />

            <h1>Company Profile</h1>

            <div className="settings-card">
              <div className="profile-row">
                <span>Company Name</span>

                <strong>{form.company_name}</strong>
              </div>

              <div className="profile-row">
                <span>Owner Name</span>

                <strong>{form.owner_name}</strong>
              </div>

              <div className="profile-row">
                <span>GST Number</span>

                <strong>{form.gst_number}</strong>
              </div>

              <div className="profile-row">
                <span>PAN Number</span>

                <strong>{form.pan_number}</strong>
              </div>

              <div className="profile-row">
                <span>Phone</span>

                <strong>{form.phone}</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>

                <strong>{form.email}</strong>
              </div>

              <div className="profile-row">
                <span>Address</span>

                <strong>{form.address}</strong>
              </div>

              <div className="profile-row">
                <span>City</span>

                <strong>{form.city}</strong>
              </div>

              <div className="profile-row">
                <span>State</span>

                <strong>{form.state}</strong>
              </div>

              <div className="profile-row">
                <span>Pincode</span>

                <strong>{form.pincode}</strong>
              </div>
              <div className="profile-row">
                <span>Bank Name</span>
                <strong>{form.bank_name}</strong>
              </div>

              <div className="profile-row">
                <span>Account Number</span>
                <strong>{form.bank_account_no}</strong>
              </div>

              <div className="profile-row">
                <span>IFSC Code</span>
                <strong>{form.ifsc_code}</strong>
              </div>
              <div className="buttonGroup">
                <button
                  className="editButton"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>

                <button className="deleteButton" onClick={handleDelete}>
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="settings-page">
          <BackButton />

          <h1>{companyId ? "Edit Company Profile" : "Add Company Profile"}</h1>

          <form className="settings-card" onSubmit={handleSubmit}>
            <label>Company Name</label>

            <input
              type="text"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              required
            />

            <label>Owner Name</label>

            <input
              type="text"
              name="owner_name"
              value={form.owner_name}
              onChange={handleChange}
              required
            />

            <label>GST Number</label>

            <input
              type="text"
              name="gst_number"
              value={form.gst_number}
              onChange={handleChange}
            />

            <label>PAN Number</label>

            <input
              type="text"
              name="pan_number"
              value={form.pan_number}
              onChange={handleChange}
            />

            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <label>Address</label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
            />

            <label>City</label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
            />

            <label>State</label>

            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
            />

            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
            />
            <label>Bank Name</label>

            <input
              type="text"
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
            />

            <label>Account Number</label>

            <input
              type="text"
              name="bank_account_no"
              value={form.bank_account_no}
              onChange={handleChange}
            />

            <label>IFSC Code</label>

            <input
              type="text"
              name="ifsc_code"
              value={form.ifsc_code}
              onChange={handleChange}
            />
            <div
              style={{
                display: "flex",

                gap: "15px",

                marginTop: "25px",
              }}
            >
              <button type="submit" className="saveButton">
                {companyId ? "Update Company" : "Save Company"}
              </button>

              {companyId && (
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CompanyProfile;
