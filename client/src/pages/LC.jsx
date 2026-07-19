import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { saveLC, updateLC, getLCById } from "../services/lc";
import BackButton from "../components/BackButton";
import "../css/lc.css";
function LC() {
  const { id } = useParams();
const preventScroll = (e) => {
  e.target.blur();
};
  useEffect(() => {
    if (id) {
      loadLC();
    }
  }, [id]);
  const navigate = useNavigate();
  const loadLC = async () => {
    try {
      const res = await getLCById(id);

      setForm({

    lc_number: res.data.lc_number || "",

    bank_name: res.data.bank_name || "",

    customer_name: res.data.customer_name || "",

    invoice_no: res.data.invoice_no || "",

    customs_location: res.data.customs_location || "",

    dollar_amount: res.data.dollar_amount || "",

    issue_date: res.data.issue_date
        ? res.data.issue_date.substring(0,10)
        : "",

    expiry_date: res.data.expiry_date
        ? res.data.expiry_date.substring(0,10)
        : "",
payment_received: Number(
          res.data.payment_received || 0
        ),

        pending_amount: Number(
          res.data.pending_amount || 0
        ),
    status: res.data.status || "Pending",

});
    } catch (err) {
      console.log(err);
      alert("LC Record Not Found");
    }
  };
  const [form,setForm]=useState({
    lc_number:"",
    bank_name:"",
    customer_name:"",
    invoice_no:"",
    customs_location:"",
    dollar_amount:"",
    issue_date:"",
    expiry_date:"",
    payment_received:0,
    pending_amount:0,
    status:"Pending"
});
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = {
      ...form,
      [name]: value,
    };
    if (name === "dollar_amount") {
      updatedForm.pending_amount =
        Number(value || 0) -
        Number(updatedForm.payment_received || 0);
    }

    setForm(updatedForm);
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation

  if (form.lc_number.trim() === "") {
    alert("LC Number Required");
    return;
  }

  if (form.bank_name.trim() === "") {
    alert("Bank Name Required");
    return;
  }

  if (form.customer_name.trim() === "") {
    alert("Customer Name Required");
    return;
  }

  if (form.invoice_no.trim() === "") {
    alert("Invoice Number Required");
    return;
  }

  if (form.customs_location.trim() === "") {
    alert("Customs Location Required");
    return;
  }

  if (Number(form.dollar_amount) <= 0) {
    alert("Enter Valid Dollar Amount");
    return;
  }

  if (form.issue_date === "") {
    alert("Issue Date Required");
    return;
  }

  if (form.expiry_date === "") {
    alert("Expiry Date Required");
    return;
  }

  if (
    new Date(form.expiry_date) <
    new Date(form.issue_date)
  ) {
    alert("Expiry Date cannot be before Issue Date");
    return;
  }
  const pendingAmount =
    Number(form.dollar_amount || 0) -
    Number(form.payment_received || 0);

  const data = {
    ...form,

    payment_received: Number(form.payment_received || 0),

    pending_amount:
      pendingAmount < 0 ? 0 : pendingAmount,

    status:
      pendingAmount <= 0
        ? "Success"
        : "Pending",
  };

  try {
    if (id) {
      const res = await updateLC(id, data);

      alert(
        res.data.message || "LC Updated Successfully",
      );
    } else {
      const res = await saveLC(data);

      alert(
        res.data.message || "LC Saved Successfully",
      );
      setForm({
        lc_number: "",
        bank_name: "",
        customer_name: "",
        invoice_no: "",
        customs_location: "",
        dollar_amount: "",
        issue_date: "",
        expiry_date: "",
        payment_received: 0,
        pending_amount: 0,
        status: "Pending",
      });
    }

    navigate("/lc-history", {
      replace: true,
    });
  } catch (err) {
    console.log(err);

    alert("Operation Failed");
  }
};

  return (
    <div className="lc-page">
<div className="lc-header">
  <BackButton />

  <div>
    <h1 className="page-title">
      Letter Of Credit
    </h1>

    <p className="page-subtitle">
      Add LC Details
    </p>
  </div>
</div>
      <form className="form-container lc-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>LC Number</label>

          <input
            name="lc_number"
            value={form.lc_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Bank Name</label>

          <input
            name="bank_name"
            value={form.bank_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Customer Name</label>

          <input
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
          />
        </div>
<div className="form-group">

<label>Invoice No</label>

<input
name="invoice_no"
value={form.invoice_no}
onChange={handleChange}
/>

</div>
        <div className="form-group">
          <label>Amount ($)</label>

          <input
            type="number"
            name="dollar_amount"
            min="0"
            step="0.01"
            value={form.dollar_amount}
            onChange={handleChange}
            onWheel={preventScroll}
          />
        </div>
<div className="form-group">

<label>Customs Location</label>

<input
name="customs_location"
value={form.customs_location}
onChange={handleChange}
/>

</div>
        <div className="form-group">
          <label>Issue Date</label>

          <input
            type="date"
            name="issue_date"
            value={form.issue_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Expiry Date</label>

          <input
            type="date"
            name="expiry_date"
            value={form.expiry_date}
            onChange={handleChange}
          />
        </div>

        <button className="primary-btn">{id ? "Update LC" : "Save LC"}</button>
      </form>
    </div>
  );
}

export default LC;
