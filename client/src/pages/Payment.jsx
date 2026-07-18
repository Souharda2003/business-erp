import { useState, useEffect } from "react";
import { savePayment, getPaymentSummary } from "../services/payment";
import { useParams } from "react-router-dom";
import { getPaymentById, updatePayment } from "../services/payment";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../css/payment.css";

function Payment() {
  const navigate = useNavigate();
  const preventScroll = (e) => {
  e.target.blur();
};
const { id } = useParams();
useEffect(() => {

loadSummary();

if(id){

loadPayment();

}

},[id]);
const loadPayment = async () => {

const res = await getPaymentById(id);

setForm(res.data);

};
  const [summary, setSummary] = useState({
    total_purchase: 0,
    total_payment: 0,
    due_amount: 0,
    advance_amount: 0,
    status: "",
  });

  const [form, setForm] = useState({
    invoice_date: "",
    invoice_no: "",
    payment_date: "",
    customer_name: "",
    payment_type: "",
    amount: "",
    remarks: "",
  });

  const loadSummary = async () => {
    try {
      const res = await getPaymentSummary();
      setSummary(res.data);
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

    if (id) {

      await updatePayment(id, form);

      alert("Payment Updated Successfully");

    } else {

      await savePayment(form);

      alert("Payment Saved Successfully");

    }

    loadSummary();

    setForm({
      invoice_date: "",
      invoice_no: "",
      payment_date: "",
      customer_name: "",
      payment_type: "Cash",
      amount: "",
      remarks: "",
    });

  } catch (err) {

    if (err.response?.status === 400) {

      alert(err.response.data.message);

    } else {

      alert("Payment Save Failed");

    }

  }

};
return (

<div className="page payment-page">
<div className="importer-header">

<BackButton />

<div className="importer-heading">

<h1 className="page-title">

Payment Management

</h1>

<p className="page-subtitle">

Manage customer payments and transaction records

</p>

</div>

</div>

  <form
      className="form-container importer-card"
      onSubmit={handleSubmit}
    >
<div className="row">

<div className="form-group">

<label>

Invoice Date

</label>

<div className="input-wrapper">

<input
type="date"
name="invoice_date"
value={form.invoice_date}
onChange={handleChange}
/>

</div>

</div>

<div className="form-group">

<label>

Invoice No

</label>

<div className="input-wrapper">

<input
type="text"
name="invoice_no"
placeholder="Enter Invoice Number"
value={form.invoice_no}
onChange={handleChange}
/>

</div>

</div>

</div>

<div className="row">

<div className="form-group">

<label>

Payment Date

</label>

<div className="input-wrapper">

<input
type="date"
name="payment_date"
value={form.payment_date}
onChange={handleChange}
/>

</div>

</div>

<div className="form-group">

<label>

Customer Name

</label>

<div className="input-wrapper">

<input
type="text"
name="customer_name"
placeholder="Enter Customer Name"
value={form.customer_name}
onChange={handleChange}
/>

</div>

</div>

</div>
        <div className="row">

          <div className="form-group">

            <label>

              Payment Type

            </label>

            <div className="input-wrapper">

              <select
                name="payment_type"
                value={form.payment_type}
                onChange={handleChange}
              >

                <option value="">
                  Select Payment Type
                </option>

                <option value="Cash">Cash</option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Cheque">
                  Cheque
                </option>

                <option value="Demand Draft">
                  Demand Draft
                </option>

                <option value="NEFT">
                  NEFT
                </option>

                <option value="RTGS">
                  RTGS
                </option>

                <option value="IMPS">
                  IMPS
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Credit Card">
                  Credit Card
                </option>

                <option value="Debit Card">
                  Debit Card
                </option>

                <option value="Net Banking">
                  Net Banking
                </option>

                <option value="Wallet">
                  Wallet
                </option>

                <option value="Adjustment">
                  Adjustment
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>

          <div className="form-group">

            <label>

              Amount

            </label>

            <div className="input-wrapper">

              <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                value={form.amount}
                onChange={handleChange}
                onWheel={preventScroll}
                min="0"
                step="0.01"
              />

            </div>

          </div>

        </div>

        <div className="form-group">

          <label>

            Remarks

          </label>

          <div className="input-wrapper">

            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows="5"
              placeholder="Write Remarks..."
            />

          </div>

        </div>

        <div className="button-area">

          <button
            type="submit"
            className="primary-btn"
          >

            {id
              ? "Update Payment"
              : "Save Payment"}

          </button>

        </div>


      </form>

      <div className="summary-card">

        <div className="summary-header">

          <h2>

            Payment Summary

          </h2>

        </div>

        <div className="summary-grid">

          <div className="summary-item">

            <span>

              Total Purchase

            </span>

            <h3>

              ₹ {Number(
                summary.total_purchase || 0
              ).toFixed(2)}

            </h3>

          </div>

          <div className="summary-item">

            <span>

              Total Payment

            </span>

            <h3>

              ₹ {Number(
                summary.total_payment || 0
              ).toFixed(2)}

            </h3>

          </div>

          <div className="summary-item">

            <span>

              Due Amount

            </span>

            <h3>

              ₹ {Number(
                summary.due_amount || 0
              ).toFixed(2)}

            </h3>

          </div>

        </div>

        <div
          className={`status-card ${
            summary.status === "DONE"
              ? "status-done"
              : summary.status === "PENDING"
              ? "status-pending"
              : "status-advance"
          }`}
        >

          {summary.status === "DONE" ? (

            <>
              🟢 Payment Completed
            </>

          ) : summary.status === "PENDING" ? (

            <>
              🟠 Payment Pending

              <br />

              ₹ {Number(
                summary.due_amount || 0
              ).toFixed(2)}
            </>

          ) : (

            <>
              🔵 Advance Payment

              <br />

              ₹ {Number(
                summary.advance_amount || 0
              ).toFixed(2)}
            </>

          )}

        </div>

      </div>

    </div>

);} 
export default Payment;