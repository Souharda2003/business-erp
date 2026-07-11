import { useState } from "react";

function Upload() {

    const [file, setFile] = useState(null);

    const handleChange = (e) => {

        setFile(e.target.files[0]);

    };

    const handleUpload = () => {

        if (!file) {

            alert("Please Select File");

            return;

        }

        alert("File Uploaded Successfully");

    };

    return (

        <div
            style={{

                background: "#fff",

                padding: "20px",

                borderRadius: "10px",

                boxShadow: "0 2px 10px rgba(0,0,0,.08)"

            }}
        >

            <h2>

                Upload Document

            </h2>

            <br />

            <input

                type="file"

                onChange={handleChange}

            />

            <br />

            <br />

            <button

                className="primary-btn"

                onClick={handleUpload}

            >

                Upload

            </button>

        </div>

    );

}

export default Upload;