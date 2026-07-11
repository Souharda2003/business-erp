import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  saveTaxAuditFee,
  updateTaxAuditFee,
  getTaxAuditFeeById,
} from "../../services/accounting";
import BackButton from "../../components/BackButton";
import "../../css/purchase.css";
function TaxAuditFee() {
  const { id } = useParams();
  const [form, setForm] = useState({
    date: "",
    name: "",
    amount: "",
    financial_year: "",
  });
  useEffect(() => {
    if (id) {
      loadTaxAuditFee();
    }
  }, []);
  const preventScroll = (e) => {
  e.target.blur();
};
const getFinancialYear = (date) => {

  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();

  const month = d.getMonth() + 1;

  if (month >= 4) {

    return `${year}-${year + 1}`;

  }

  return `${year - 1}-${year}`;

};
  const loadTaxAuditFee = async () => {

    try {

      const res = await getTaxAuditFeeById(id);

      setForm({

        date: res.data.date
          ? res.data.date.split("T")[0]
          : "",

        name: res.data.name || "",

        amount: res.data.amount || "",

        financial_year: res.data.financial_year || "",

      });

    } catch (err) {

      console.log(err);

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name === "amount" && Number(value) < 0) {

      return;

    }

    if (name === "date") {

      setForm({

        ...form,

        date: value,

        financial_year: getFinancialYear(value),

      });

      return;

    }

    setForm({

      ...form,

      [name]: value,

    });

  };

  const handleReset = () => {

    setForm({

      date: "",
      name: "",
      amount: "",
      financial_year: "",

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (id) {

        await updateTaxAuditFee(id, form);

        alert("Tax Audit Fee Updated Successfully");

      } else {

        await saveTaxAuditFee(form);

        alert("Tax Audit Fee Saved Successfully");

        handleReset();

      }

    } catch (err) {

      console.log(err);

      alert("Save Failed");

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
          Tax Audit Fee Management
        </h1>
      </div>
      <form
        className="form-container"
        onSubmit={handleSubmit}
      >

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <input
          name="name"
          value={form.name}
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          placeholder="Amount"
          min="0"
          step="0.01"
          onChange={handleChange}
          onWheel={preventScroll}
        />

        <input
          name="financial_year"
          value={form.financial_year}
          placeholder="Financial Year"
          readOnly
        />

        <div className="button-row">

          <button
            type="submit"
            className="primary-btn"
          >
            {id
              ? "Update Tax Audit Fee"
              : "Save Tax Audit Fee"}
          </button>

        </div>

      </form>

    </div>

  );

}

export default TaxAuditFee;