import { useState, useEffect } from "react";
import {
  savePurchase,
  updatePurchase,
  getPurchaseById,
} from "../services/purchase";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../css/purchase.css";
function Purchase() {
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      loadPurchase();
    }
  }, []);
  const preventScroll = (e) => {
    e.target.blur();
  };
  const loadPurchase = async () => {
    try {
      const res = await getPurchaseById(id);

      setForm({
        purchase_date: res.data.purchase_date
          ? res.data.purchase_date.split("T")[0]
          : "",

        invoice_no: res.data.invoice_no || "",

        supplier: res.data.supplier || "",

        product_name: res.data.product_name || "",

        quantity: res.data.quantity || "",

        unit: res.data.unit || "TON",

        unit_price: res.data.unit_price || "",

        cgst_percent: res.data.cgst_percent || "",

        sgst_percent: res.data.sgst_percent || "",

        round_off: res.data.round_off || 0,
      });
    } catch (err) {
      console.log(err);

      alert("Purchase Not Found");
    }
  };
  const [form, setForm] = useState({
    purchase_date: "",
    invoice_no: "",
    supplier: "",
    product_name: "",
    quantity: "",
    unit: "TON",
    unit_price: "",
    cgst_percent: "",
    sgst_percent: "",
    round_off: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "unit_price") {
      if (Number(value) < 0) {
        return;
      }
    }

    setForm({
      ...form,

      [name]: value,
    });
  };

  const taxableAmount = (
    Number(form.quantity || 0) * Number(form.unit_price || 0)
  ).toFixed(2);

  const cgstAmount = (
    (Number(taxableAmount) * Number(form.cgst_percent || 0)) /
    100
  ).toFixed(2);

  const sgstAmount = (
    (Number(taxableAmount) * Number(form.sgst_percent || 0)) /
    100
  ).toFixed(2);

  const totalGST = (Number(cgstAmount) + Number(sgstAmount)).toFixed(2);

  const totalAmount = (
    Number(taxableAmount) +
    Number(totalGST) +
    Number(form.round_off || 0)
  ).toFixed(2);
  const handleSubmit = async (e) => {
    e.preventDefault();
      if (form.invoice_no.trim() === "") {
        alert("Invoice Number is Required");

        return;
      }

      if (form.purchase_date === "") {
        alert("Purchase Date is Required");

        return;
      }

      if (form.supplier.trim() === "") {
        alert("Supplier Name is Required");

        return;
      }

      if (form.product_name.trim() === "") {
        alert("Product Name is Required");

        return;
      }

      if (Number(form.quantity) <= 0) {
        alert("Enter Valid Quantity");

        return;
      }

      if (Number(form.unit_price) <= 0) {
        alert("Enter Valid Unit Price");

        return;
      }
      const data = {
        ...form,
        
        taxable_amount: taxableAmount,
        
        cgst_amount: cgstAmount,
        
        sgst_amount: sgstAmount,
        
        total_gst: totalGST,
        
        total_amount: totalAmount,
      };
      
      try {
        if (id) {
          await updatePurchase(id, data);
          
          alert("Purchase Updated Successfully");
        } else {
          await savePurchase(data);
          
          alert("Purchase Saved Successfully");
          
          setForm({
            purchase_date: "",
            
            invoice_no: "",
            
            supplier: "",
            
            product_name: "",
            
            quantity: "",
            
            unit: "TON",
            
            unit_price: "",

            cgst_percent: "",

            sgst_percent: "",

            round_off: 0,
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
            Purchase Management
          </h1>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group">
              <label>Invoice No</label>

              <input
                name="invoice_no"
                value={form.invoice_no}
                placeholder="Invoice No"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date</label>

              <input
                type="date"
                name="purchase_date"
                value={
                  form.purchase_date ? form.purchase_date.split("T")[0] : ""
                }
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label>Supplier</label>

              <input
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Product Name</label>

              <input
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              placeholder="Quantity"
              step="0.001"
              min="0"
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
          <div className="form-group">
            <label>Unit Price</label>

            <input
              type="number"
              name="unit_price"
              value={form.unit_price}
              min="0"
              step="0.01"
              onChange={handleChange}
              onWheel={preventScroll}
            />
          </div>
          <label>Taxable Amount</label>

          <input value={taxableAmount} readOnly />

          <div className="row">
            <label>CGST (%)</label>
            <input
              type="number"
              name="cgst_percent"
              value={form.cgst_percent}
              placeholder="CGST %"
              step="0.01"
              onChange={handleChange}
              onWheel={preventScroll}
            />

            <input value={cgstAmount} placeholder="CGST Amount" readOnly />
          </div>
          <div className="row">
            <label>SGST (%)</label>
            <input
              type="number"
              name="sgst_percent"
              value={form.sgst_percent}
              placeholder="SGST %"
              step="0.01"
              onChange={handleChange}
              onWheel={preventScroll}
            />

            <input value={sgstAmount} placeholder="SGST Amount" readOnly />
          </div>
          <label>Total GST</label>

          <input value={totalGST} readOnly />
          <label>Round Off</label>

          <input
            type="number"
            name="round_off"
            step="0.01"
            value={form.round_off}
            placeholder="Round Off (+/-)"
            onChange={handleChange}
            onWheel={preventScroll}
          />
          <label>Grand Total</label>

          <input value={totalAmount} readOnly />
          <button type="submit" className="primary-btn">
            {id ? "Update Purchase" : "Save Purchase"}
          </button>
        </form>
      </div>
    );
  };

export default Purchase;
