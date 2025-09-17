import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

import React from 'react'

function SummaryPage() {
    const {state}= useLocation();
    const navigate = useNavigate();
    const {from, to, vehicle, distance, fare} = state || {};

    const handleDownload =()=>{
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Journey Summanry", 20,20);

        doc.setFontSize(12);
        doc.text(`From: ${from}`,20,40)
        doc.text(`To: ${to}`, 20, 50);
        doc.text(`Vehicle: ${vehicle}`, 20, 60);
        doc.text(`Distance: ${distance} km`, 20, 70);
        doc.text(`Fare: ₹${fare}`, 20, 80);

        doc.save("JouneySummary.pdf");
    };

    if(!state){
        return(
            <div style={styles.page}>
                <h2>No Journey Data Found</h2>
                <button style={styles.btn} onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
        )
    }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Journey Summary</h2>
      <div style={styles.card}>
        <p><strong>From:</strong> {from}</p>
        <p><strong>To:</strong> {to}</p>
        <p><strong>Vehicle:</strong> {vehicle}</p>
        <p><strong>Distance:</strong> {distance} km</p>
        <p><strong>Fare:</strong> ₹{fare}</p>
      </div>

      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        <button style={styles.btn} onClick={handleDownload}>
          Download PDF
        </button>
        <button style={styles.btnAlt} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
   );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    height: "100vh",
    justifyContent: "center",
  },
  title: {
    fontSize: "26px",
    marginBottom: "20px",
    color: "#333",
  },
  card: {
    backgroundColor: "white",
    padding: "20px 30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    fontSize: "18px",
    lineHeight: "1.6",
    textAlign: "left",
  },
  btn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #28a745, #20c997)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.2s",
  },
  btnAlt: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.2s",
  },
};

export default SummaryPage
