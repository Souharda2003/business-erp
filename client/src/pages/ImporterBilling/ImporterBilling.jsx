import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import {
  saveImporterBilling,
  updateImporterBilling,
  getImporterBillingById,
} from "../../services/importerBilling";
import "../../css/importerBilling.css";
function ImporterBilling() {
  const { id } = useParams();
const preventScroll = (e) => {
  e.target.blur();
};
  const [form, setForm] = useState({
    invoice_no: "",
    lc_no: "",
    entry_date: "",
    importer_name: "",
    lc_payment: "",
    extra_charge: "",
    item_total: 0,
    grand_total: 0,
  });
  const [currentItem, setCurrentItem] = useState({
    quantity: "",
    unit: "KG",
    bag: "",
    price: "",
    amount: 0,
  });
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const units = [
    "KG",
    "GM",
    "MG",
    "TON",
    "MT",
    "BAG",
    "PCS",
    "BOX",
    "CTN",
    "DOZEN",
    "LTR",
    "ML",
    "ROLL",
    "SET",
    "PAIR",
    "NOS",
  ];
  useEffect(() => {
    if (id) {
      loadImporterBilling();
    }
  }, [id]);

  const loadImporterBilling = async () => {
    try {
      const res = await getImporterBillingById(id);

      setForm({
        invoice_no: res.data.invoice_no || "",

        lc_no: res.data.lc_no || "",

        entry_date: res.data.entry_date || "",

        importer_name: res.data.importer_name || "",

        lc_payment: res.data.lc_payment || "",

        extra_charge: res.data.extra_charge || "",

        item_total: res.data.item_total || 0,

        grand_total: res.data.grand_total || 0,
      });

      setItems(res.data.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  const calculateAmount = (data) => {
    const bag = Number(data.bag || 0);

    const price = Number(data.price || 0);

    return bag * price;
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...currentItem,

      [name]: value,
    };

    updated.amount = calculateAmount(updated);

    setCurrentItem(updated);
  };

  const calculateTotals = (list, extraCharge) => {
    let total = 0;

    list.forEach((item) => {
      total += Number(item.amount);
    });

    const grand = total + Number(extraCharge || 0);

    setForm((prev) => ({
      ...prev,

      item_total: total,

      grand_total: grand,
    }));
  };

  const addItem = () => {
    if (
      currentItem.quantity === "" ||
      currentItem.bag === "" ||
      currentItem.price === ""
    ) {
      alert("Please fill all item details");

      return;
    }

    if (editIndex !== null) {
      const updatedItems = [...items];

      updatedItems[editIndex] = currentItem;

      setItems(updatedItems);

      calculateTotals(updatedItems, form.extra_charge);

      setEditIndex(null);
    } else {
      const updatedItems = [...items, currentItem];

      setItems(updatedItems);

      calculateTotals(updatedItems, form.extra_charge);
    }

    setCurrentItem({
      quantity: "",

      unit: "KG",

      bag: "",

      price: "",

      amount: 0,
    });
  };

  const editItem = (index) => {
    setCurrentItem(items[index]);

    setEditIndex(index);
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((item, i) => i !== index);

    setItems(updatedItems);

    calculateTotals(updatedItems, form.extra_charge);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...form,

      [name]: value,
    };

    let total = 0;

    items.forEach((item) => {
      total += Number(item.amount);
    });

    updated.item_total = total;

    updated.grand_total = total + Number(updated.extra_charge || 0);

    setForm(updated);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.lc_no.trim() === "") {
      alert("Please Enter LC No");

      return;
    }

    if (form.importer_name.trim() === "") {
      alert("Please Enter Importer Name");

      return;
    }

    if (items.length === 0) {
      alert("Please Add At Least One Item");

      return;
    }

    const payload = {
      invoice_no: form.invoice_no,

      lc_no: form.lc_no,

      entry_date: form.entry_date,

      importer_name: form.importer_name,

      lc_payment: Number(form.lc_payment || 0),

      item_total: Number(form.item_total || 0),

      extra_charge: Number(form.extra_charge || 0),

      grand_total: Number(form.grand_total || 0),

      items,
    };

    try {
      let res;

      if (id) {
        res = await updateImporterBilling(
          id,

          payload,
        );

        alert(res.data.message);

        await loadImporterBilling();

        return;
      }

      res = await saveImporterBilling(payload);

      alert(res.data.message);

      setForm({
        invoice_no: "",

        lc_no: "",

        entry_date: "",

        importer_name: "",

        lc_payment: "",

        extra_charge: "",

        item_total: 0,

        grand_total: 0,
      });

      setItems([]);

      setCurrentItem({
        quantity: "",

        unit: "KG",

        bag: "",

        price: "",

        amount: 0,
      });

      setEditIndex(null);
    } catch (err) {
      console.log(err);

      console.log(err.response);

      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Save Failed");
      }
    }
  };
 return (
  <div className="page importer-page">

    <div className="importer-header">

      <BackButton />

      <div className="importer-heading">

        <h1 className="page-title">
          Importer Billing
        </h1>

        <p className="page-subtitle">
          Create and manage importer billing information.
        </p>

      </div>

    </div>

    <form
      className="form-container importer-card"
      onSubmit={handleSubmit}
    >

      <div className="row">

        <div className="form-group">

          <label>Invoice No</label>

          <input
            type="text"
            name="invoice_no"
            value={form.invoice_no}
            onChange={handleChange}
            placeholder="Enter Invoice Number"
          />

        </div>

        <div className="form-group">

          <label>LC No</label>

          <input
            type="text"
            name="lc_no"
            value={form.lc_no}
            onChange={handleChange}
            placeholder="Enter LC Number"
            required
          />

        </div>

      </div>

      <div className="row">

        <div className="form-group">

          <label>Entry Date</label>

          <input
            type="date"
            name="entry_date"
            value={form.entry_date}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-group">

          <label>LC Payment</label>

          <input
            type="number"
            name="lc_payment"
            value={form.lc_payment}
            onChange={handleChange}
            min="0"
            step="0.01"
            onWheel={preventScroll}
            placeholder="Enter LC Payment"
          />

        </div>

      </div>

      <div className="form-group">

        <label>Importer Name</label>

        <input
          type="text"
          name="importer_name"
          value={form.importer_name}
          onChange={handleChange}
          placeholder="Enter Importer Name"
          required
        />

      </div>

      <hr />

      <h3 className="section-title">
        Add Item Details
      </h3>
            <div className="row">

        <div className="form-group">

          <label>Quantity</label>

          <input
            type="number"
            name="quantity"
            value={currentItem.quantity}
            onChange={handleItemChange}
            min="0"
            step="0.01"
            onWheel={preventScroll}
            placeholder="Enter Quantity"
          />

        </div>

        <div className="form-group">

          <label>Unit</label>

          <select
            name="unit"
            value={currentItem.unit}
            onChange={handleItemChange}
          >

            <option value="KG">KG</option>

            <option value="GM">GM</option>

            <option value="MG">MG</option>

            <option value="TON">TON</option>

            <option value="MT">MT</option>

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

          </select>

        </div>

      </div>

      <div className="row">

        <div className="form-group">

          <label>Bag</label>

          <input
            type="number"
            name="bag"
            value={currentItem.bag}
            onChange={handleItemChange}
            min="0"
            step="0.01"
            onWheel={preventScroll}
            placeholder="Enter Bag"
          />

        </div>

        <div className="form-group">

          <label>Price</label>

          <input
            type="number"
            name="price"
            value={currentItem.price}
            onChange={handleItemChange}
            min="0"
            step="0.01"
            onWheel={preventScroll}
            placeholder="Enter Price"
          />

        </div>

      </div>

      <div className="form-group">

        <label>Amount</label>

        <input
          value={Number(currentItem.amount).toFixed(2)}
          readOnly
        />

      </div>

      <div className="button-row">

        <button
          type="button"
          className="primary-btn importer-btn"
          onClick={addItem}
        >
          {editIndex !== null ? "Update Item" : "Add Item"}
        </button>

      </div>

      <hr />

      <h3 className="section-title">
        Item List
      </h3>

      <div className="table-wrapper">

        <table className="item-table">

          <thead>

            <tr>

              <th>SL</th>

              <th>Quantity</th>

              <th>Unit</th>

              <th>Bag</th>

              <th>Price</th>

              <th>Amount</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>
            {items.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="empty-row"
                >
                  No Item Added
                </td>

              </tr>

            ) : (

              items.map((item, index) => (

                <tr key={index}>

                  <td>{index + 1}</td>

                  <td>{item.quantity}</td>

                  <td>{item.unit}</td>

                  <td>{item.bag}</td>

                  <td>{Number(item.price).toFixed(2)}</td>

                  <td>{Number(item.amount).toFixed(2)}</td>

                  <td>

                    <div className="action-buttons">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => editItem(index)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteItem(index)}
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <hr />

      <h3 className="summary-title">
        Billing Summary
      </h3>

      <div className="summary-box">

        <div className="form-group">

          <label>Extra Charge</label>

          <input
            type="number"
            name="extra_charge"
            value={form.extra_charge}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Enter Extra Charge"
            onWheel={preventScroll}
          />

        </div>

        <div className="row">

          <div className="form-group">

            <label>Item Total</label>

            <input
              value={Number(form.item_total).toFixed(2)}
              readOnly
            />

          </div>

          <div className="form-group">

            <label>Grand Total</label>

            <input
              value={Number(form.grand_total).toFixed(2)}
              readOnly
            />

          </div>

        </div>
                <div className="summary-row">

          <span>Item Total</span>

          <span>
            ₹ {Number(form.item_total).toFixed(2)}
          </span>

        </div>

        <div className="summary-row">

          <span>Extra Charge</span>

          <span>
            ₹ {Number(form.extra_charge || 0).toFixed(2)}
          </span>

        </div>

        <div className="summary-total">

          <span>Grand Total</span>

          <span>
            ₹ {Number(form.grand_total).toFixed(2)}
          </span>

        </div>

      </div>

      <div className="button-row">

        <button
          type="submit"
          className="primary-btn importer-btn"
        >
          {id
            ? "Update Importer Billing"
            : "Save Importer Billing"}
        </button>

      </div>

    </form>

  </div>
);
}
export default ImporterBilling;