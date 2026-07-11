import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { saveSales, updateSales, getSalesById } from "../services/sales";
import BackButton from "../components/BackButton";
import "../css/sales.css";

function Sales() {
  const preventScroll = (e) => {
    e.target.blur();
  };
  const loadSales = async () => {
    try {
      const res = await getSalesById(id);

      setForm({
        sales_date: res.data.sales_date
          ? res.data.sales_date.split("T")[0]
          : "",

        invoice_no: res.data.invoice_no || "",

        customer_name: res.data.customer_name || "",

        product_name: res.data.product_name || "",

        quantity: res.data.quantity || "",

        unit: res.data.unit || "KG",
bank_name:res.data.bank_name ||"",
        total_amount: res.data.total_amount || "",

        payment_received: res.data.payment_received || "",
      });
    } catch (err) {
      console.log(err);

      alert("Sales Record Not Found");
    }
  };
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      loadSales();
    }
  }, []);
  const [form, setForm] = useState({
    sales_date: "",
    invoice_no: "",
    customer_name: "",
    product_name: "",
    quantity: "",
    unit: "KG",
    bank_name:"",
    total_amount: "",
    payment_received: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.invoice_no.trim() === "") {
      alert("Invoice No Required");

      return;
    }

    if (form.sales_date === "") {
      alert("Sales Date Required");

      return;
    }

    if (form.customer_name.trim() === "") {
      alert("Customer Name Required");

      return;
    }

    if (form.product_name.trim() === "") {
      alert("Product Required");

      return;
    }

    if (Number(form.quantity) <= 0) {
      alert("Enter Valid Quantity");

      return;
    }

    if (Number(form.total_amount) <= 0) {
      alert("Enter Valid Amount");

      return;
    }

    try {
      if (id) {
        await updateSales(id, form);
        alert("Sales Updated Successfully");
      } else {
        await saveSales(form);
        alert("Sales Saved Successfully");
        setForm({
          sales_date: "",

          invoice_no: "",

          customer_name: "",

          product_name: "",

          quantity: "",

          unit: "KG",
          bank_name :"",

          total_amount: "",

          payment_received: ""
        });
      }
    } catch (err) {
      console.log(err);
      alert("Operation Failed");
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
          Sales Management
        </h1>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="date"
          name="sales_date"
          value={form.sales_date || ""}
          onChange={handleChange}
        />
        <input
          name="invoice_no"
          placeholder="Invoice No"
          value={form.invoice_no || ""}
          onChange={handleChange}
        />

        <input
          name="customer_name"
          placeholder="Customer Name"
          value={form.customer_name || ""}
          onChange={handleChange}
        />

        <input
          name="product_name"
          placeholder="Product Name"
          value={form.product_name || ""}
          onChange={handleChange}
        />
        <div className="row">
          <input
            type="number"
            name="quantity"
            value={form.quantity || ""}
            placeholder="Quantity"
            min = "0"
            step="0.001"
            onChange={handleChange}
            onWheel={preventScroll}
          />
          <select name="unit" value={form.unit} onChange={handleChange}>
            <option value="KG">KG</option>
            <option value="TON">TON</option>
            <option value="GM">GM</option>
            <option value="MG">MG</option>
            <option value="MT">MT</option>
            <option value="QUINTAL">QUINTAL</option>
            <option value="BAG">BAG</option>
            <option value="PCS">PCS</option>
            <option value="BOX">BOX</option>
            <option value="CTN">CTN</option>
            <option value="DOZEN">DOZEN</option>
            <option value="LTR">LTR</option>
            <option value="ML">ML</option>
            <option value="ROLL">ROLL</option>
            <option value="SET">SET</option>
            <option value="PAIR">PAIR</option>
            <option value="NOS">NOS</option>
            <option value="METER">METER</option>
            <option value="CM">CM</option>
            <option value="MM">MM</option>
            <option value="FEET">FEET</option>
            <option value="INCH">INCH</option>
            <option value="PACK">PACK</option>
            <option value="BUNDLE">BUNDLE</option>
            <option value="CAN">CAN</option>
            <option value="JAR">JAR</option>
            <option value="DRUM">DRUM</option>
            <option value="SACK">SACK</option>
            <option value="TIN">TIN</option>
          </select>
        </div>
        <input
          name="bank_name"
          placeholder="Bank Name"
          value={form.bank_name || ""}
          onChange={handleChange}
        />
        <input
          type="number"
          name="total_amount"
          value={form.total_amount || ""}
          placeholder="Total Amount"
          min ="0"
          step="0.01"
          onChange={handleChange}
          onWheel={preventScroll}
        />
        <input
          type="number"
          name="payment_received"
          value={form.payment_received || ""}
          placeholder="Amount Received"
          min = "0"
          step="0.01"
          onChange={handleChange}
          onWheel={preventScroll}
        />
        <button type="submit" className="primary-btn">
          {id ? "Update Sales" : "Save Sales"}
        </button>
      </form>
    </div>
  );
}
export default Sales;
