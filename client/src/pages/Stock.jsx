import { useEffect, useState } from "react";

import { getStock } from "../services/stock";

import "../css/stock.css";

function Stock() {

    const [stockList, setStockList] = useState([]);

    useEffect(() => {

        loadStock();

    }, []);

    const loadStock = async () => {

        try {

            const res = await getStock();

            setStockList(res.data);

        }

        catch {

            setStockList([]);

        }

    };

    return (

        <div className="page">

            <h1 className="page-title">

                Stock Management

            </h1>

            <table>

                <thead>

                    <tr>

                        <th>Product</th>

                        <th>Quantity</th>

                        <th>Unit</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        stockList.length > 0 ?

                        stockList.map((item, index) => (

                            <tr key={index}>

                                <td>{item.product_name}</td>

                                <td>{item.quantity}</td>

                                <td>{item.unit}</td>

                                <td>

                                    {

                                        item.quantity < 10

                                        ?

                                        "Low Stock"

                                        :

                                        "Available"

                                    }

                                </td>

                            </tr>

                        ))

                        :

                        <tr>

                            <td colSpan="4">

                                No Stock Available

                            </td>

                        </tr>

                    }

                </tbody>

            </table>

        </div>

    );

}

export default Stock;