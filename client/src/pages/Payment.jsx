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
    <div className="page">

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <BackButton />

        <h1 className="page-title" style={{ margin: 0 }}>
          Payment Management
        </h1>

      </div>

      <form className="form-container" onSubmit={handleSubmit}>

        <div className="row">

          <div className="form-group">

            <label>Invoice Date</label>

            <input
              type="date"
              name="invoice_date"
              value={form.invoice_date}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Invoice No</label>

            <input
              type="text"
              name="invoice_no"
              value={form.invoice_no}
              placeholder="Enter Invoice No"
              onChange={handleChange}
            />

          </div>

        </div>

        <div className="row">

          <div className="form-group">

            <label>Payment Date</label>

            <input
              type="date"
              name="payment_date"
              value={form.payment_date}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Customer Name</label>

            <input
              type="text"
              name="customer_name"
              value={form.customer_name}
              placeholder="Customer Name"
              onChange={handleChange}
            />

          </div>

        </div>
                <div className="row">

          <div className="form-group">

            <label>Payment Type</label>

            <select
  name="payment_type"
  value={form.payment_type}
  onChange={handleChange}
>

<option value="">Select Payment Type</option>

<option value="Cash">Cash</option>
<option value="Bank Transfer">Bank Transfer</option>
<option value="Cheque">Cheque</option>
<option value="Demand Draft">Demand Draft</option>
<option value="NEFT">NEFT</option>
<option value="RTGS">RTGS</option>
<option value="IMPS">IMPS</option>
<option value="UPI">UPI</option>
<option value="Credit Card">Credit Card</option>
<option value="Debit Card">Debit Card</option>
<option value="Net Banking">Net Banking</option>
<option value="Wallet">Wallet</option>
<option value="Adjustment">Adjustment</option>
<option value="Other">Other</option>

</select>

          </div>

          <div className="form-group">

            <label>Amount</label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              placeholder="Enter Amount"
              step="0.01"
              min="0"
              onChange={handleChange}
              onWheel={preventScroll}
            />

          </div>

        </div>

        <div className="form-group">

          <label>Remarks</label>

          <textarea
            name="remarks"
            value={form.remarks}
            placeholder="Remarks"
            rows="4"
            onChange={handleChange}
          />

        </div>

        <button className="primary-btn">

{id ? "Update Payment" : "Save Payment"}

</button>

      </form>
            <br />

      <div className="summary-card">

        <h2>Payment Summary</h2>

        <hr />

        <h3>
          Total Purchase :
          <span style={{ color: "#2563eb" }}>
            {" "}
            ₹ {Number(summary.total_purchase || 0).toFixed(2)}
          </span>
        </h3>

        <h3>
          Total Payment :
          <span style={{ color: "#16a34a" }}>
            {" "}
            ₹ {Number(summary.total_payment || 0).toFixed(2)}
          </span>
        </h3>

        <h3>
          Due Amount :
          <span
            style={{
              color:
                Number(summary.due_amount || 0) <= 0
                  ? "#16a34a"
                  : "#dc2626",
            }}
          >
            {" "}
            ₹ {Number(summary.due_amount || 0).toFixed(2)}
          </span>
        </h3>

        <h3
style={{
marginTop:"20px",
fontWeight:"bold",
color:
summary.status==="DONE"
?"green"
:summary.status==="PENDING"
?"orange"
:"blue"
}}
>

{
summary.status==="DONE"

? "🟢 Payment Completed"

:summary.status==="PENDING"

? `🟠 Payment Pending ₹ ${Number(summary.due_amount||0).toFixed(2)}`

: `🔵 Advance Payment ₹ ${Number(summary.advance_amount||0).toFixed(2)}`
}

</h3>

      </div>

    </div>
  );
}

export default Payment;