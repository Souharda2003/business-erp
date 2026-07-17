import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  saveOtherSales,
  getOtherSalesById,
  updateOtherSales,
} from "../services/otherSales";
import BackButton from "../components/BackButton";
import "../css/othersales.css";
function OtherSales() {
  
  const { id } = useParams();

const navigate = useNavigate();
const preventScroll = (e) => {
  e.target.blur();
};
const isEdit = !!id;
useEffect(() => {

  if (!id) return;

  const loadRecord = async () => {

    try {

      const res = await getOtherSalesById(id);

      setForm({
        service_type: res.data.service_type || "",
        invoice_no: res.data.invoice_no || "",
        name: res.data.name || "",
        vehicle_number: res.data.vehicle_number || "",
        challan_no: res.data.challan_no || "",
        from_location: res.data.from_location || "",
        to_location: res.data.to_location || "",
        amount: res.data.amount || "",
        cgst_percent: res.data.cgst_percent || "",
        sgst_percent: res.data.sgst_percent || "",
        total_gst: res.data.total_gst || "",
        tds: res.data.tds || "",
        total_amount: res.data.total_amount || 0,
        bill_no: res.data.bill_no || "",
        entry_date: res.data.entry_date
          ? res.data.entry_date.split("T")[0]
          : "",
      });

    } catch (err) {

      console.log(err);

    }

  };

  loadRecord();

}, [id]);
  const [form, setForm] = useState({
    service_type: "",
    invoice_no: "",
    name: "",
    vehicle_number: "",
    challan_no: "",
    from_location: "",
    to_location: "",
    amount: "",
    cgst_percent: "",
    sgst_percent: "",
    total_gst: "",
    tds: "",
    total_amount: 0,
    bill_no: "",
    entry_date: "",
  });
  const handleChange = (e) => {
    const updated = {
      ...form,

      [e.target.name]: e.target.value,
    };

    if (updated.service_type === "Clearing Charge") {
      calculateGST(updated);
    } else if (updated.service_type === "Document Charge") {
      calculateTDS(updated);
    } else {
      setForm({
        ...updated,

        total_amount: Number(updated.amount || 0),
      });
    }
  };
  const calculateGST = (data) => {
    const amount = Number(data.amount || 0);

    const cgst = (amount * Number(data.cgst_percent || 0)) / 100;

    const sgst = (amount * Number(data.sgst_percent || 0)) / 100;

    const totalGST = cgst + sgst;

    const totalAmount = amount + totalGST;

    setForm({
      ...data,

      total_gst: totalGST,

      total_amount: totalAmount,
    });
  };
  const calculateTDS = (data) => {
    const total = Number(data.amount || 0) - Number(data.tds || 0);

    setForm({
      ...data,

      total_amount: total,
    });
  };
  const cgstAmount =
    (Number(form.amount || 0) * Number(form.cgst_percent || 0)) / 100;

  const sgstAmount =
    (Number(form.amount || 0) * Number(form.sgst_percent || 0)) / 100;
  const totalGST = (Number(cgstAmount) + Number(sgstAmount)).toFixed(2);
  const totalAmount = (Number(form.amount || 0) + Number(totalGST)).toFixed(2);
const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const payload = {
      ...form,
      amount: Number(form.amount || 0),
      cgst_percent: Number(form.cgst_percent || 0),
      sgst_percent: Number(form.sgst_percent || 0),
      total_gst: Number(form.total_gst || 0),
      tds: Number(form.tds || 0),
      total_amount: Number(form.total_amount || 0),
    };

    if (isEdit) {

      const res = await updateOtherSales(
        id,
        payload
      );

      alert(res.data.message);

    } else {

      const res = await saveOtherSales(
        payload
      );

      alert(res.data.message);

    }

    navigate("/other-sales-history");

  } catch (err) {

    console.log(err);

    alert("Operation Failed");

  }

};
 return (
  <div className="page other-sales-page">

    <div className="other-sales-header">

      <BackButton />

      <div className="other-sales-heading">

        <h1 className="page-title">

          Other Sales Management

        </h1>

        <p className="page-subtitle">

          Add Document, Clearing & Transport Charges Details

        </p>

      </div>

    </div>

    <form
      className="form-container other-sales-form-card other-sales-card"
      onSubmit={handleSubmit}
    >

      <div className="card-glow"></div>

      <div className="row">

        <div className="form-group">

          <label>Service Type</label>

          <select
            name="service_type"
            value={form.service_type}
            onChange={handleChange}
          >

            <option value="">

              Select Service

            </option>

            <option value="Document Charge">

              Document Charge

            </option>

            <option value="Clearing Charge">

              Clearing Charge

            </option>

            <option value="Transport Charge">

              Transport Charge

            </option>

          </select>

        </div>

        <div className="form-group">

          <label>Invoice No</label>

          <input
            type="text"
            name="invoice_no"
            value={form.invoice_no}
            onChange={handleChange}
            placeholder="Enter Invoice Number"
          />

        </div>

      </div>

      {form.service_type === "Document Charge" && (
        <>
        <div className="row">

  <div className="form-group">

    <label>Bill No</label>

    <input
      type="text"
      name="bill_no"
      value={form.bill_no}
      onChange={handleChange}
      placeholder="Enter Bill Number"
    />

  </div>

  <div className="form-group">

    <label>Name</label>

    <input
      type="text"
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Enter Customer Name"
    />

  </div>

</div>

<div className="row">

  <div className="form-group">

    <label>Date</label>

    <input
      type="date"
      name="entry_date"
      value={form.entry_date}
      onChange={handleChange}
    />

  </div>

  <div className="form-group">

    <label>Amount</label>

    <input
      type="number"
      name="amount"
      value={form.amount}
      onChange={handleChange}
      onWheel={preventScroll}
      placeholder="Enter Amount"
    />

  </div>

</div>

<div className="row">

  <div className="form-group">

    <label>TDS</label>

    <input
      type="number"
      name="tds"
      value={form.tds}
      onChange={handleChange}
      onWheel={preventScroll}
      placeholder="Enter TDS"
    />

  </div>

  <div className="form-group">

    <label>Total Amount</label>

    <input
      value={Number(form.total_amount || 0).toFixed(2)}
      readOnly
    />

  </div>

</div>

        </>
      )}
      {form.service_type === "Clearing Charge" && (
  <>
  <div className="row">

  <div className="form-group">

    <label>Clearing Agent Name</label>

    <input
      type="text"
      name="name"
      value={form.name}
      onChange={handleChange}
      placeholder="Enter Clearing Agent Name"
    />

  </div>

  <div className="form-group">

    <label>Date</label>

    <input
      type="date"
      name="entry_date"
      value={form.entry_date}
      onChange={handleChange}
    />

  </div>

</div>

<div className="row">

  <div className="form-group">

    <label>Amount</label>

    <input
      type="number"
      name="amount"
      value={form.amount}
      onChange={handleChange}
      onWheel={preventScroll}
      placeholder="Enter Amount"
    />

  </div>

  <div className="form-group">

    <label>CGST (%)</label>

    <input
      type="number"
      name="cgst_percent"
      value={form.cgst_percent}
      onChange={handleChange}
      onWheel={preventScroll}
      step="0.01"
      placeholder="Enter CGST %"
    />

  </div>

</div>

<div className="row">

  <div className="form-group">

    <label>CGST Amount</label>

    <input
      value={Number(cgstAmount).toFixed(2)}
      readOnly
    />

  </div>

  <div className="form-group">

    <label>SGST (%)</label>

    <input
      type="number"
      name="sgst_percent"
      value={form.sgst_percent}
      onChange={handleChange}
      onWheel={preventScroll}
      step="0.01"
      placeholder="Enter SGST %"
    />

  </div>

</div>

<div className="row">

  <div className="form-group">

    <label>SGST Amount</label>

    <input
      value={Number(sgstAmount).toFixed(2)}
      readOnly
    />

  </div>

  <div className="form-group">

    <label>Total GST</label>

    <input
      value={Number(totalGST).toFixed(2)}
      readOnly
    />

  </div>

</div>

<div className="row">

  <div className="form-group">

    <label>Total Amount</label>

    <input
      value={Number(totalAmount).toFixed(2)}
      readOnly
    />

  </div>

</div>

        </>
      )}
      {form.service_type === "Transport Charge" && (
  <>

    <div className="row">

      <div className="form-group">

        <label>Challan No</label>

        <input
          type="text"
          name="challan_no"
          value={form.challan_no}
          onChange={handleChange}
          placeholder="Enter Challan Number"
        />

      </div>

      <div className="form-group">

        <label>Name</label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Customer Name"
        />

      </div>

    </div>

    <div className="row">

      <div className="form-group">

        <label>Vehicle Number</label>

        <input
          type="text"
          name="vehicle_number"
          value={form.vehicle_number}
          onChange={handleChange}
          placeholder="WB-24BS-1234"
        />

      </div>

      <div className="form-group">

        <label>Date</label>

        <input
          type="date"
          name="entry_date"
          value={form.entry_date}
          onChange={handleChange}
        />

      </div>

    </div>

    <div className="row">

      <div className="form-group">

        <label>From Location</label>

        <input
          type="text"
          name="from_location"
          value={form.from_location}
          onChange={handleChange}
          placeholder="Enter From Location"
        />

      </div>

      <div className="form-group">

        <label>To Location</label>

        <input
          type="text"
          name="to_location"
          value={form.to_location}
          onChange={handleChange}
          placeholder="Enter To Location"
        />

      </div>

    </div>

    <div className="row">

      <div className="form-group">

        <label>Amount</label>

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          onWheel={preventScroll}
          placeholder="Enter Amount"
        />

      </div>

      <div className="form-group">

        <label>Total Amount</label>

        <input
          value={Number(form.amount || 0).toFixed(2)}
          readOnly
        />

      </div>

    </div>

  </>
)}

<div className="submit-btn-wrapper">

  <button
    className="primary-btn"
    type="submit"
  >

    {isEdit
      ? "Update Other Sales"
      : "Save Other Sales"}

  </button>

</div>

</form>

</div>

);

}

export default OtherSales;
