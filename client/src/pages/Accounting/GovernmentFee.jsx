import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  saveGovernmentFee,
  updateGovernmentFee,
  getGovernmentFeeById,
} from "../../services/accounting";
import BackButton from "../../components/BackButton";
import "../../css/accounting.css";
function GovernmentFee() {
  const { id } = useParams();
  const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

const currentFinancialYear =
  month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
  useEffect(() => {
  if (id) {
    loadGovernmentFee();
  }
}, [id]);
const preventScroll = (e) => {
  e.target.blur();
};
const loadGovernmentFee = async () => {
  const res = await getGovernmentFeeById(id);
  console.log(res.data);
  setForm(res.data);
};
  const [form, setForm] = useState({
    invoice_no: "",
    entry_date: "",
    applicant_name: "",
    exporter_gstin: "",
    iec_code: "",
    fee_description: "Payment Charges",
    other_description: "",
    amount: "",
    cgst_percent: "",
    cgst_amount: "",
    sgst_percent: "",
    sgst_amount: "",
    igst_percent: "",
    igst_amount: "",
    total_amount: 0,
    financial_year:currentFinancialYear,
  });
  const calculate = (data) => {
    const amount = Number(data.amount || 0);
    const cgstAmount = (amount * Number(data.cgst_percent || 0)) / 100;
    const sgstAmount = (amount * Number(data.sgst_percent || 0)) / 100;
    const igstAmount = (amount * Number(data.igst_percent || 0)) / 100;
    const total = amount + cgstAmount + sgstAmount + igstAmount;
    setForm({
      ...data,
      cgst_amount: cgstAmount,
      sgst_amount: sgstAmount,
      igst_amount: igstAmount,
      total_amount: total,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        financial_year:currentFinancialYear,
        amount: Number(form.amount || 0),
        cgst_percent: Number(form.cgst_percent || 0),
        cgst_amount: Number(form.cgst_amount || 0),
        sgst_percent: Number(form.sgst_percent || 0),
        sgst_amount: Number(form.sgst_amount || 0),
        igst_percent: Number(form.igst_percent || 0),
        igst_amount: Number(form.igst_amount || 0),
        total_amount: Number(form.total_amount || 0)
      };
      let res;

if (id) {

  res = await updateGovernmentFee(id, payload);

  alert(res.data.message);

  await loadGovernmentFee();

  return;

}

res = await saveGovernmentFee(payload);

alert(res.data.message);

setForm({
  invoice_no: "",
  entry_date: "",
  applicant_name: "",
  exporter_gstin: "",
  iec_code: "",
  fee_description: "Payment Charges",
  other_description: "",
  amount: "",
  cgst_percent: "",
  cgst_amount: "",
  sgst_percent: "",
  sgst_amount: "",
  igst_percent: "",
  igst_amount: "",
  total_amount: 0,
  financial_year:currentFinancialYear
});
    } catch (err) {
      console.log(err);
      alert("Save Failed");
    }
  };
 const handleChange = (e) => {
  const { name, value } = e.target;
  const updated = {
    ...form,
    [name]: value,
  };
  calculate(updated);
};
  return (
     <div className="lc-page">
<div className="lc-header">
  <BackButton />

  <div>
    <h1 className="page-title">
      Export Inspection Council
    </h1>

    <p className="page-subtitle">
      Add Export Inspection Council Details
    </p>
  </div>
</div>
      <form className="form-container lc-card" onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group">
            <label>Invoice No</label>
            <input
              name="invoice_no"
              value={form.invoice_no}
              onChange={handleChange}
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
        <div className="form-group">
          <label>Applicant Name</label>
          <input
            name="applicant_name"
            value={form.applicant_name}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>Exporter GSTIN</label>

            <input
              name="exporter_gstin"
              value={form.exporter_gstin}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>IEC Code</label>

            <input
              name="iec_code"
              value={form.iec_code}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Fee Description</label>

          <select
            name="fee_description"
            value={form.fee_description}
            onChange={handleChange}
          >
            <option value="Payment Charges">Payment Charges</option>

            <option value="Other">Other</option>
          </select>
        </div>

        {form.fee_description === "Other" && (
          <div className="form-group">
            <label>Other Description</label>

            <input
              name="other_description"
              value={form.other_description}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="form-group">
          <label>Amount</label>

         <input
  type="number"
  name="amount"
  value={form.amount}
  onChange={handleChange}
  min="0"
  step="0.01"
  onWheel={preventScroll}
/>
        </div>

        <div className="tax-row">
          <div className="tax-label">CGST (%)</div>

          <input
            type="number"
            name="cgst_percent"
            value={form.cgst_percent}
            onChange={handleChange}
            onWheel={preventScroll}
          />

          <input value={form.cgst_amount} readOnly />
        </div>

        <div className="tax-row">
          <div className="tax-label">SGST (%)</div>

          <input
            type="number"
            name="sgst_percent"
            value={form.sgst_percent}
            onChange={handleChange}
            onWheel={preventScroll}
          />

          <input value={form.sgst_amount} readOnly />
        </div>

        <div className="tax-row">
          <div className="tax-label">IGST (%)</div>

          <input
            type="number"
            name="igst_percent"
            value={form.igst_percent}
            onChange={handleChange}
            onWheel={preventScroll}
          />

          <input value={form.igst_amount} readOnly />
        </div>

        <div className="form-group">
          <label>Total Amount</label>
<input
  value={Number(form.total_amount).toFixed(2)}
  readOnly
/>
          </div>

        <div className="button-row">
          <button
            type="submit"
            className="primary-btn"
          >
            {id ? "Update Government Fee" : "Save Government Fee"}
          </button>

        </div>
      </form>
    </div>
  );
}
export default GovernmentFee;
