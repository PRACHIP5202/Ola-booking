import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import React from 'react'

function VehiclePage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { from, to, fromCoords, toCoords } = state || {};

    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const vehicles = [
        { type: "Bike", icon: "🚲", rate: 5 },
        { type: "Car", icon: "🚗", rate: 10 },
        { type: "Mini Car", icon: "🚕", rate: 8 },
        { type: "Auto", icon: "🛺", rate: 6 },
        { type: "Parcel", icon: "📦", rate: 7 },
    ];

    const calculateDistance = (coord1, coord2) => {
        const toRad = (val) => (val * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(coord2[0] - coord1[0]);
        const dLon = toRad(coord2[1] - coord1[1]); // Fixed: coord[1] to coord1[1]
        const lat1 = toRad(coord1[0])
        const lat2 = toRad(coord2[0]);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) *
            Math.cos(lat1) * Math.cos(lat2); // Fixed: Math.con to Math.cos
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleNext = () => {
        if (!selectedVehicle) {
            alert("Please select a vehicle");
            return;
        }

        const distance = calculateDistance(fromCoords, toCoords);
        const fare = Math.round(distance * selectedVehicle.rate);

        navigate("/summary", {
            state: {
                from, to,
                distance: distance.toFixed(2),
                vehicle: selectedVehicle.type,
                fare,
            },
        });
    };

    return (
        <div style={styles.page}>
            {/* Header Section */}
            <div style={styles.header}>
                <h1 style={styles.title}>Select Your Ride</h1>
                <div style={styles.routeInfo}>
                    <p style={styles.routeText}>
                        <span style={styles.routeLabel}>From:</span> {from}
                    </p>
                    <p style={styles.routeText}>
                        <span style={styles.routeLabel}>To:</span> {to}
                    </p>
                </div>
            </div>

            {/* Vehicle Selection Grid */}
            <div style={styles.vehicleContainer}>
                <h3 style={styles.sectionTitle}>Choose Your Vehicle</h3>
                <div style={styles.vehicleGrid}>
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.type}
                            onClick={() => setSelectedVehicle(vehicle)}
                            style={{
                                ...styles.vehicleCard,
                                ...(selectedVehicle?.type === vehicle.type ? styles.selectedCard : {}),
                            }}
                            onMouseEnter={(e) => {
                                if (selectedVehicle?.type !== vehicle.type) {
                                    e.target.style.transform = "translateY(-5px)";
                                    e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedVehicle?.type !== vehicle.type) {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
                                }
                            }}
                        >
                            <div style={styles.vehicleIcon}>{vehicle.icon}</div>
                            <div style={styles.vehicleInfo}>
                                <h4 style={styles.vehicleType}>{vehicle.type}</h4>
                                <p style={styles.vehicleRate}>₹{vehicle.rate}/km</p>
                            </div>
                            {selectedVehicle?.type === vehicle.type && (
                                <div style={styles.selectedBadge}>✓</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Vehicle Info */}
            {selectedVehicle && (
                <div style={styles.selectionInfo}>
                    <div style={styles.selectionCard}>
                        <h4 style={styles.selectionTitle}>Selected Vehicle</h4>
                        <div style={styles.selectionDetails}>
                            <span style={styles.selectionIcon}>{selectedVehicle.icon}</span>
                            <div>
                                <p style={styles.selectionVehicle}>{selectedVehicle.type}</p>
                                <p style={styles.selectionRate}>₹{selectedVehicle.rate} per kilometer</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Next Button */}
            <div style={styles.buttonContainer}>
                <button 
                    style={{
                        ...styles.nextBtn,
                        ...(selectedVehicle ? styles.nextBtnEnabled : styles.nextBtnDisabled)
                    }} 
                    onClick={handleNext}
                    disabled={!selectedVehicle}
                    onMouseEnter={(e) => {
                        if (selectedVehicle) {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (selectedVehicle) {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                        }
                    }}
                >
                    Continue to Summary ➡
                </button>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },

    header: {
        textAlign: "center",
        marginBottom: "40px",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        margin: "0 auto 40px auto",
    },

    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#2c3e50",
        margin: "0 0 20px 0",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
    },

    routeInfo: {
        marginTop: "15px",
    },

    routeText: {
        margin: "8px 0",
        fontSize: "16px",
        color: "#495057",
    },

    routeLabel: {
        fontWeight: "bold",
        color: "#2c3e50",
    },

    vehicleContainer: {
        maxWidth: "800px",
        margin: "0 auto 40px auto",
    },

    sectionTitle: {
        textAlign: "center",
        fontSize: "24px",
        color: "#2c3e50",
        marginBottom: "30px",
        fontWeight: "600",
    },

    vehicleGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px",
        padding: "0 20px",
    },

    vehicleCard: {
        position: "relative",
        backgroundColor: "white",
        border: "2px solid #e9ecef",
        borderRadius: "15px",
        padding: "25px 20px",
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        minHeight: "160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },

    selectedCard: {
        border: "3px solid #667eea",
        backgroundColor: "#f8f9ff",
        transform: "translateY(-5px)",
        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.2)",
    },

    vehicleIcon: {
        fontSize: "48px",
        marginBottom: "15px",
        display: "block",
    },

    vehicleInfo: {
        textAlign: "center",
    },

    vehicleType: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#2c3e50",
        margin: "0 0 8px 0",
    },

    vehicleRate: {
        fontSize: "16px",
        color: "#28a745",
        fontWeight: "bold",
        margin: "0",
    },

    selectedBadge: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "#28a745",
        color: "white",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        fontWeight: "bold",
    },

    selectionInfo: {
        maxWidth: "400px",
        margin: "0 auto 40px auto",
        padding: "0 20px",
    },

    selectionCard: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        border: "2px solid #667eea",
    },

    selectionTitle: {
        fontSize: "20px",
        color: "#2c3e50",
        margin: "0 0 15px 0",
        textAlign: "center",
        fontWeight: "600",
    },

    selectionDetails: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },

    selectionIcon: {
        fontSize: "40px",
    },

    selectionVehicle: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#2c3e50",
        margin: "0 0 5px 0",
    },

    selectionRate: {
        fontSize: "16px",
        color: "#28a745",
        margin: "0",
        fontWeight: "600",
    },

    buttonContainer: {
        textAlign: "center",
        padding: "0 20px",
    },

    nextBtn: {
        padding: "15px 40px",
        fontSize: "18px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "25px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: "translateY(0)",
        minWidth: "200px",
    },

    nextBtnEnabled: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    },

    nextBtnDisabled: {
        backgroundColor: "#dee2e6",
        color: "#6c757d",
        cursor: "not-allowed",
        boxShadow: "none",
    },
};

export default VehiclePage