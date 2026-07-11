import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import {
  saveTDSFee,
  updateTDSFee,
  getTDSFeeById,
} from "../../services/accounting";
import "../../css/purchase.css";

function TDSFee() {

  const { id } = useParams();
  const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

const currentFinancialYear =
  month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
const preventScroll = (e) => {
  e.target.blur();
};
  const [form, setForm] = useState({

    name_of_party: "",
    invoice_date: "",
    invoice_no: "",
    code: "",
    sec: "",
    sec_p: "",
    tds_percentage: "",
    gross_amount: "",
    tds_amount: "",
    net_amount: "",
    tds_payable: "",
financial_year:currentFinancialYear,
  });

  useEffect(() => {

    if (id) {

      loadTDSFee();

    }

  }, []);

  const loadTDSFee = async () => {

    try {

      const res = await getTDSFeeById(id);

      setForm({

        name_of_party: res.data.name_of_party || "",

        invoice_date: res.data.invoice_date
          ? res.data.invoice_date.split("T")[0]
          : "",

        invoice_no: res.data.invoice_no || "",

        code: res.data.code || "",

        sec: res.data.sec || "",

        sec_p: res.data.sec_p || "",

        tds_percentage: res.data.tds_percentage || "",

        gross_amount: res.data.gross_amount || "",

        tds_amount: res.data.tds_amount || "",

        net_amount: res.data.net_amount || "",

        tds_payable: res.data.tds_payable || "",

      });

    } catch (err) {

      console.log(err);

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    let updatedForm = {

      ...form,

      [name]: value,

    };

    const gross =
      Number(
        name === "gross_amount"
          ? value
          : updatedForm.gross_amount
      ) || 0;

    const percentage =
      Number(
        name === "tds_percentage"
          ? value
          : updatedForm.tds_percentage
      ) || 0;

    const tdsAmount =
      (gross * percentage) / 100;

    const netAmount =
      gross - tdsAmount;

    updatedForm.tds_amount =
      tdsAmount.toFixed(2);

    updatedForm.net_amount =
      netAmount.toFixed(2);

    updatedForm.tds_payable =
      tdsAmount.toFixed(2);

    setForm(updatedForm);

  };

  const handleReset = () => {

    setForm({

      name_of_party: "",
      invoice_date: "",
      invoice_no: "",
      code: "",
      sec: "",
      sec_p: "",
      tds_percentage: "",
      gross_amount: "",
      tds_amount: "",
      net_amount: "",
      tds_payable: "",

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (id) {

        await updateTDSFee(id, form);

        alert("TDS Fee Updated Successfully");

      } else {

        await saveTDSFee(form);

        alert("TDS Fee Saved Successfully");

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
          TDS Fee Management
        </h1>
      </div>

      <form
        className="form-container"
        onSubmit={handleSubmit}
      >

        <input
          name="name_of_party"
          value={form.name_of_party}
          placeholder="Name Of Party"
          onChange={handleChange}
        />

        <input
          type="date"
          name="invoice_date"
          value={form.invoice_date}
          onChange={handleChange}
        />

        <input
          name="invoice_no"
          value={form.invoice_no}
          placeholder="Invoice No"
          onChange={handleChange}
        />

        <input
          name="code"
          value={form.code}
          placeholder="Code"
          onChange={handleChange}
        />

        <input
          name="sec"
          value={form.sec}
          placeholder="SEC"
          onChange={handleChange}
        />

        <input
          name="sec_p"
          value={form.sec_p}
          placeholder="SEC(P)"
          onChange={handleChange}
        /><input
          type="number"
          name="tds_percentage"
          value={form.tds_percentage}
          placeholder="TDS %"
          min="0"
          step="0.01"
          onChange={handleChange}
          onWheel={preventScroll}
        />

        <input
          type="number"
          name="gross_amount"
          value={form.gross_amount}
          placeholder="Gross Amount"
          min="0"
          step="0.01"
          onChange={handleChange}
          onWheel={preventScroll}
        />

        <input
          type="number"
          name="tds_amount"
          value={form.tds_amount}
          placeholder="TDS Amount"
          readOnly
        />

        <input
          type="number"
          name="net_amount"
          value={form.net_amount}
          placeholder="Net Amount"
          readOnly
        />

        <input
          type="number"
          name="tds_payable"
          value={form.tds_payable}
          placeholder="TDS Payable"
          readOnly
        />

        <div className="button-row">

          <button
            type="submit"
            className="primary-btn"
          >

            {id
              ? "Update TDS Fee"
              : "Save TDS Fee"}

          </button>

        </div>

      </form>

    </div>

  );

}

export default TDSFee;
