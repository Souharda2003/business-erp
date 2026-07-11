import "../css/analytics.css";

function Chart() {

    return (

        <div className="chart-box">

            <h3>

                Monthly Sales Overview

            </h3>

            <div
                style={{

                    height: "300px",

                    display: "flex",

                    justifyContent: "space-around",

                    alignItems: "flex-end"

                }}
            >

                <div style={{height:"120px",width:"40px",background:"#1976d2"}}></div>

                <div style={{height:"180px",width:"40px",background:"#42a5f5"}}></div>

                <div style={{height:"220px",width:"40px",background:"#64b5f6"}}></div>

                <div style={{height:"160px",width:"40px",background:"#90caf9"}}></div>

                <div style={{height:"260px",width:"40px",background:"#1976d2"}}></div>

            </div>

        </div>

    );

}

export default Chart;