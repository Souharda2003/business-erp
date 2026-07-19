import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { saveGST, updateGST, getGSTById } from "../services/gst";

import BackButton from "../components/BackButton";
import "../css/gst.css";

function GST() {
  const navigate = useNavigate();
  const { id } = useParams();
const preventScroll = (e) => {
  e.target.blur();
};
  const [form, setForm] = useState({
    invoice_no: "",

    taxable_amount: "",

    gst_percentage: 18,

    invoice_date: "",
  });
  useEffect(() => {
    if (id) {
      loadGST();
    }
  }, [id]);
  const loadGST = async () => {
    try {
      const res = await getGSTById(id);

      console.log(res.data);

      setForm({
        invoice_no: res.data.invoice_no || "",

        taxable_amount: res.data.taxable_amount || "",

        gst_percentage: res.data.gst_percentage || 18,

        invoice_date: res.data.invoice_date
          ? res.data.invoice_date.substring(0, 10)
          : "",
      });
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

  const gstAmount =
    (Number(form.taxable_amount || 0) * Number(form.gst_percentage || 0)) / 100;

  const totalAmount = Number(form.taxable_amount || 0) + gstAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,

        gst_amount: Number(gstAmount).toFixed(2),
      };

      if (id) {
        await updateGST(id, payload);

        alert("GST Updated Successfully");
      } else {
        await saveGST(payload);

        alert("GST Saved Successfully");
      }

      navigate("/gst-history", { replace: true });
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Operation Failed");
    }
  };

  return (
    <div className="page GST-page">
      <div className="GST-header">
        <BackButton />
        <div className="GST-heading">
          <h1 className="page-title">GST Management</h1>
          <p className="page-subtitle">Add GST Details</p>
        </div>
      </div>
      <form className="form-container GST-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Invoice No</label>

          <input
            name="invoice_no"
            value={form.invoice_no}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Taxable Amount</label>

          <input
            type="number"
            name="taxable_amount"
            value={form.taxable_amount}
            step="0.01"
            min="0"
            onChange={handleChange}
            onWheel={preventScroll}
          />
        </div>

        <div className="form-group">
          <label>GST %</label>

          <input
            type="number"
            name="gst_percentage"
            value={form.gst_percentage}
            step="0.01"
            min="0"
            onChange={handleChange}
            onWheel={preventScroll}
          />
        </div>
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
          <label>GST Amount</label>

          <input value={Number(gstAmount).toFixed(2)} readOnly />
        </div>

        <div className="form-group">
          <label>Total Amount</label>

          <input value={Number(totalAmount).toFixed(2)} readOnly />
        </div>

        <button type="submit" className="primary-btn">
          {id ? "Update GST" : "Save GST"}
        </button>
      </form>
    </div>
  );
}

export default GST;
