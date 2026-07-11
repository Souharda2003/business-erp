import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import {
  saveDrawback,
  updateDrawback,
  getDrawbackById,
  getInvoiceList,
  getProductList,
} from "../services/drawback";
import "../css/drawback.css";
function Drawback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceList, setInvoiceList] = useState([]);
  const loadInvoices = async () => {
    try {
      const res = await getInvoiceList();

      setInvoiceList(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const preventScroll = (e) => {
    e.target.blur();
  };
  const [productList, setProductList] = useState([]);
  const loadProducts = async () => {
    try {
      const res = await getProductList();

      console.log("PRODUCTS =", res.data);

      setProductList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("ERROR =", err);

      console.log("RESPONSE =", err.response);

      console.log("DATA =", err.response?.data);

      alert(JSON.stringify(err.response?.data));
    }
  };
  useEffect(() => {
    loadInvoices();

    loadProducts();
  }, []);
  const [form, setForm] = useState({
    shipping_bill: "",
    shipping_bill_date: "",
    invoice_no: "",
    product_name: "",
    quantity: "",
    unit: "KG",
    dollar_rate: "",
    drawback_rate: "",
    drawback_amount: 0,
    customs_location: "",
    export_date: "",
    status: "Pending",
  });
  useEffect(() => {
    if (id) {
      loadDrawback();
    }
  }, [id]);
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };
  const loadDrawback = async () => {
    try {
      const res = await getDrawbackById(id);
      setForm({
        shipping_bill: res.data.shipping_bill,
        shipping_bill_date: res.data.shipping_bill_date
          ? res.data.shipping_bill_date.toString().substring(0, 10)
          : "",
        export_date: formatDate(res.data.export_date),
        invoice_no: res.data.invoice_no,
        product_name: res.data.product_name,
        quantity: res.data.quantity,
        unit: res.data.unit,
        dollar_rate: res.data.dollar_rate,
        drawback_rate: res.data.drawback_rate,
        drawback_amount: Number(res.data.drawback_amount || 0),
        customs_location: res.data.customs_location,
        status: res.data.status,
      });
      calculateDrawback(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e) => {
    const updated = {
      ...form,
      [e.target.name]: e.target.value,
    };
    calculateDrawback(updated);
  };
  const calculateDrawback = (data) => {
    const quantity = Number(data.quantity || 0);

    const dollarRate = Number(data.dollar_rate || 0);

    const drawbackRate = Number(data.drawback_rate || 0);

    const amount = (quantity * dollarRate * drawbackRate) / 100;

    setForm({
      ...data,

      drawback_amount: amount.toFixed(2),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        const res = await updateDrawback(id, form);

        alert(res.data.message);
      } else {
        const res = await saveDrawback(form);

        alert(res.data.message);
      }

      navigate("/drawback-history", { replace: true });
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
          Drawback Management
        </h1>
      </div>
      <form className="form-container" onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div className="form-group" style={{ flex: 2 }}>
            <label>Shipping Bill</label>

            <input
              name="shipping_bill"
              value={form.shipping_bill}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Shipping Bill Date</label>

            <input
              type="date"
              name="shipping_bill_date"
              value={form.shipping_bill_date || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Invoice No</label>
          <input
            list="invoiceList"
            name="invoice_no"
            value={form.invoice_no}
            onChange={handleChange}
          />

          <datalist id="invoiceList">
            {invoiceList.map((item) => (
              <option key={item.invoice_no} value={item.invoice_no} />
            ))}
          </datalist>
        </div>
        <div className="form-group">
          <label>Product Name</label>
          <input
            list="productList"
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
          />

          <datalist id="productList">
            {Array.isArray(productList) &&
              productList.map((item) => (
                <option key={item.product_name} value={item.product_name} />
              ))}
          </datalist>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div className="form-group" style={{ flex: 2 }}>
            <label>Quantity</label>

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              min="0"
              step="0.001"
              onChange={handleChange}
              onWheel={preventScroll}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Unit</label>

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
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div className="form-group" style={{ flex: 1 }}>
            <label>Dollar Rate</label>

            <input
              type="number"
              name="dollar_rate"
              value={form.dollar_rate}
              onChange={handleChange}
              onWheel={preventScroll}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Drawback Rate (%)</label>

            <input
              type="number"
              name="drawback_rate"
              value={form.drawback_rate}
              onChange={handleChange}
              onWheel={preventScroll}
            />
          </div>
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
          <label>Drawback Amount</label>
          <input
            value={Number(form.drawback_amount || 0).toFixed(2)}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Export Date</label>

          <input
            type="date"
            name="export_date"
            value={form.export_date}
            onChange={handleChange}
          />
        </div>
        <button className="primary-btn" type="submit">
          {id ? "Update Drawback" : "Save Drawback"}
        </button>
      </form>
    </div>
  );
}

export default Drawback;
