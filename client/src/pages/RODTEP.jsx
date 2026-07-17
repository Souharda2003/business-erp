import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

import { saveRODTEP, updateRODTEP, getRODTEPById } from "../services/rodtep";

import "../css/rodtep.css";

function RODTEP() {
  const { id } = useParams();
const preventScroll = (e) => {
  e.target.blur();
};
  const [form, setForm] = useState({
    bill_no: "",
    date_of_issue: "",
    licence_no: "",
    total_credit: "",
    hsn: "",
    rate: "",
    add_gst_rate: "",
    tcs_rate: "",
    round_off: "",
    financial_year: "",
    amount: "",
  });

  useEffect(() => {
    if (id) {
      loadRODTEP();
    }
  }, [id]);

  const getFinancialYear = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getFullYear();

    const month = d.getMonth() + 1;

    if (month >= 4) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };
  const loadRODTEP = async () => {
    try {
      const res = await getRODTEPById(id);

      setForm({
        bill_no: res.data.bill_no || "",

        date_of_issue:
res.data.date_of_issue
  ? res.data.date_of_issue.split("T")[0]
  : "",

        licence_no: res.data.licence_no || "",

        total_credit: res.data.total_credit || "",

        hsn: res.data.hsn || "",

        rate: res.data.rate || "",

        add_gst_rate: res.data.add_gst_rate || "",

        tcs_rate: res.data.tcs_rate || "",
        round_off: res.data.round_off || "",

        financial_year: res.data.financial_year || "",

        amount: res.data.amount || "",
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = {
      ...form,
      [name]: value,
    };

    if (name === "date_of_issue") {
      updated.financial_year = getFinancialYear(value);
    }
    const credit = Number(updated.total_credit || 0);
    const rate = Number(updated.rate || 0);
    const gst = Number(updated.add_gst_rate || 0);
    const tcs = Number(updated.tcs_rate || 0);
    const roundoff = Number(updated.round_off || 0);
    let amount = (credit * rate) / 100;
    amount = amount + (amount * gst) / 100;
    amount = amount + (amount * tcs) / 100;
    amount = amount + roundoff;
    updated.amount = amount.toFixed(2);
    setForm(updated);
  };
  const handleReset = () => {
    setForm({
      bill_no: "",
      date_of_issue: "",
      licence_no: "",
      total_credit: "",
      hsn: "",
      rate: "",
      add_gst_rate: "",
      tcs_rate: "",
      round_off:"",
      financial_year: "",
      amount: "",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await updateRODTEP(id, form);

        alert("RODTEP Updated Successfully");
      } else {
        await saveRODTEP(form);

        alert("RODTEP Saved Successfully");

        handleReset();
      }
    } catch (err) {
      console.log(err);

      alert("Save Failed");
    }
  };

  return (
<div className="page rodtep-page">
<div className="rodtep-header">
        <BackButton />
<div className="rodtep-heading">

<h1 className="page-title">
RODTEP Management
</h1>

<p className="page-subtitle">
Manage RODTEP Credit Details
</p>

</div>
      </div>

<form
className="form-container rodtep-form-card rodtep-card"
onSubmit={handleSubmit}
>

<div className="card-glow"></div><div className="row">
          <div className="form-group">
            <label>Bill No</label>

            <input
              name="bill_no"
              value={form.bill_no}
              onChange={handleChange}
              placeholder="Bill No"
            />
          </div>

          <div className="form-group">
            <label>Date Of Issue</label>

            <input
              type="date"
              name="date_of_issue"
              value={form.date_of_issue}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Licence No</label>

          <input
            name="licence_no"
            value={form.licence_no}
            onChange={handleChange}
            placeholder="Licence No"
          />
        </div>
        <div className="form-group">
          <label>Financial Year</label>
          <input value={form.financial_year} readOnly />
        </div>
        <div className="form-group">
          <label>Total Credit</label>
          <input
            type="number"
            name="total_credit"
            value={form.total_credit}
            min="0"
            step="0.01"
            onChange={handleChange}
            onWheel={preventScroll}
            placeholder="Total Credit"
          />
        </div>
        <div className="row">
          <div className="form-group">
            <label>HSN</label>

            <input
              name="hsn"
              value={form.hsn}
              onChange={handleChange}
              placeholder="HSN"
            />
          </div>

          <div className="form-group">
            <label>Rate (%)</label>

            <input
              type="number"
              name="rate"
              value={form.rate}
              min="0"
              step="0.01"
              onChange={handleChange}
              onWheel={preventScroll}
              placeholder="Rate (%)"
            />
          </div>
        </div>
        <div className="form-group">
          <label>GST Rate (%)</label>

          <input
            type="number"
            name="add_gst_rate"
            value={form.add_gst_rate}
            min="0"
            step="0.01"
            onChange={handleChange}
            onWheel={preventScroll}
            placeholder="GST Rate"
          />
        </div>

        <div className="form-group">
          <label>TCS Rate (%)</label>

          <input
            type="number"
            name="tcs_rate"
            value={form.tcs_rate}
            min="0"
            step="0.01"
            onChange={handleChange}
            onWheel={preventScroll}
            placeholder="TCS Rate"
          />
        </div>
        <div className="form-group">
          <label>Round Off (+/-)</label>

          <input
            type="number"
            name="round_off"
            value={form.round_off}
            step="0.01"
            onChange={handleChange}
            onWheel={preventScroll}
            placeholder="+ / - Round Off"
          />
        </div>
        <div className="form-group">
          <label>Amount</label>

          <input value={form.amount} readOnly />
        </div>
        <div className="button-row">
          <button type="submit" className="primary-btn">
            {id ? "Update RODTEP" : "Save RODTEP"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RODTEP;
