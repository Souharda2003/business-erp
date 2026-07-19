import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  saveGSTFee,
  updateGSTFee,
  getGSTFeeById,
} from "../../services/accounting";
import BackButton from "../../components/BackButton";
import "../../css/purchase.css";

function GSTFee() {

  const { id } = useParams();
const preventScroll = (e) => {
  e.target.blur();
};
  const [form, setForm] = useState({

    entry_date: "",
    applicant_name: "",
    amount: "",
    financial_year: "",

  });

  useEffect(() => {

    if (id) {

      loadGSTFee();

    }

  }, []);

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

  const loadGSTFee = async () => {

    try {

      const res = await getGSTFeeById(id);

      setForm({

        entry_date: res.data.entry_date
          ? res.data.entry_date.split("T")[0]
          : "",

        applicant_name: res.data.applicant_name || "",

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

    if (name === "entry_date") {

      setForm({

        ...form,

        entry_date: value,

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

      entry_date: "",
      applicant_name: "",
      amount: "",
      financial_year: "",

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (id) {

        await updateGSTFee(id, form);

        alert("GST Fee Updated Successfully");

      } else {

        await saveGSTFee(form);

        alert("GST Fee Saved Successfully");

        handleReset();

      }

    } catch (err) {

      console.log(err);

      alert("Save Failed");

    }

  };

  return (

   <div className="lc-page">
<div className="lc-header">
  <BackButton />

  <div>
    <h1 className="page-title">
      GST Fee Management
    </h1>

    <p className="page-subtitle">
      Add GST Fee Details
    </p>
  </div>
</div>
      <form
        className="form-container lc-card"
        onSubmit={handleSubmit}
      >
        <div className="form-group">

        <input
          type="date"
          name="entry_date"
          value={form.entry_date}
          onChange={handleChange}
          />
          </div>
<div className="form-group">

        <input
          name="applicant_name"
          value={form.applicant_name}
          placeholder="Applicant Name"
          onChange={handleChange}
          />

          </div>
          <div className="form-group">

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
          </div>
<div className="form-group">

        <input
          type="text"
          name="financial_year"
          value={form.financial_year}
          placeholder="Financial Year"
          readOnly
          />
          </div>

        <div className="button-row">

          <button
            type="submit"
            className="primary-btn"
          >

            {id
              ? "Update GST Fee"
              : "Save GST Fee"}

          </button>

        </div>

      </form>

    </div>

  );

}

export default GSTFee;