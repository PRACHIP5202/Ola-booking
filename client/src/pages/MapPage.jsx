import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet"
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function MapPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [fromCoords, setFromCoords] = useState(null);
    const [toCoords, setToCoords] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationStatus, setLocationStatus] = useState("Getting your location...");

    const { from, to } = state || {};

    useEffect(() => {
        const fetchCoords = async () => {
            console.log("Starting to fetch coordinates...");
            console.log("To location:", to);
            
            if (!to) {
                setError("Destination location is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Get user's current location
                setLocationStatus("Getting your current location...");
                const getCurrentLocation = () => {
                    return new Promise((resolve, reject) => {
                        if (!navigator.geolocation) {
                            reject(new Error('Geolocation is not supported by this browser'));
                            return;
                        }

                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                resolve([position.coords.latitude, position.coords.longitude]);
                            },
                            (error) => {
                                let errorMessage = 'Unable to get your location';
                                switch(error.code) {
                                    case error.PERMISSION_DENIED:
                                        errorMessage = 'Location access denied by user. Please enable location access.';
                                        break;
                                    case error.POSITION_UNAVAILABLE:
                                        errorMessage = 'Location information is unavailable.';
                                        break;
                                    case error.TIMEOUT:
                                        errorMessage = 'Location request timed out.';
                                        break;
                                    default:
                                        errorMessage = 'An unknown error occurred while getting location.';
                                        break;
                                }
                                reject(new Error(errorMessage));
                            },
                            {
                                enableHighAccuracy: true,
                                timeout: 10000,
                                maximumAge: 60000
                            }
                        );
                    });
                };

                console.log("Getting current location...");
                const currentLocation = await getCurrentLocation();
                console.log("Current location:", currentLocation);
                setFromCoords(currentLocation);

                // Fetch coordinates for destination
                setLocationStatus("Finding destination...");
                console.log("Fetching coordinates for destination...");
                const toRes = await fetch(`http://localhost:4000/api/geocode?q=${encodeURIComponent(to)}`);
                
                console.log("Destination response status:", toRes.status);
                
                if (!toRes.ok) {
                    throw new Error(`Failed to fetch destination coordinates: ${toRes.status}`);
                }
                
                const toData = await toRes.json();
                console.log("Destination data received:", toData);

                if (toData && toData.length > 0 && toData[0]) {
                    const toLatLng = [parseFloat(toData[0].lat), parseFloat(toData[0].lon)];
                    console.log("Setting destination coordinates:", toLatLng);
                    setToCoords(toLatLng);
                } else {
                    throw new Error(`No coordinates found for destination: ${to}`);
                }

                console.log("Successfully fetched all coordinates");
                setLocationStatus("Route loaded successfully!");

            } catch (error) {
                console.error('Error fetching coordinates:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoords();
    }, [to]);

    console.log("Current state - Loading:", loading, "FromCoords:", fromCoords, "ToCoords:", toCoords, "Error:", error);

    // Show error state
    if (error) {
        return (
            <div style={{ 
                height: "100vh", 
                width: "100%", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
                alignItems: "center",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f8f9fa"
            }}>
                <h2 style={{ color: "red", marginBottom: "20px" }}>Error</h2>
                <p style={{ marginBottom: "20px", maxWidth: "400px", fontSize: "16px" }}>{error}</p>
                {error.includes('Location access denied') && (
                    <div style={{ marginBottom: "20px" }}>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            To use this feature, please:
                            <br />1. Click the location icon in your browser's address bar
                            <br />2. Select "Allow" for location access
                            <br />3. Refresh the page
                        </p>
                    </div>
                )}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => navigate(-1)} style={styles.btn}>Go Back</button>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{...styles.btn, background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)"}}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Show loading state
    if (loading) {
        return (
            <div style={{ 
                height: "100vh", 
                width: "100%", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
                alignItems: "center",
                backgroundColor: "#f8f9fa"
            }}>
                <h2 style={{ marginBottom: "20px", fontSize: "28px", color: "#333" }}>Loading...</h2>
                <p style={{ fontSize: "18px", color: "#666", marginBottom: "10px" }}>{locationStatus}</p>
                <p style={{ marginTop: "10px", fontSize: "14px", color: "#888", maxWidth: "300px", textAlign: "center" }}>
                    Destination: {to}
                </p>
                <div style={{ marginTop: "30px" }}>
                    <div style={styles.spinner}></div>
                </div>
            </div>
        );
    }

    // Show map when coordinates are available
    if (fromCoords && toCoords) {
        // Calculate center point between current location and destination for better map view
        const centerLat = (fromCoords[0] + toCoords[0]) / 2;
        const centerLon = (fromCoords[1] + toCoords[1]) / 2;
        const mapCenter = [centerLat, centerLon];

        return (
            <div style={styles.pageContainer}>
                <h2 style={styles.title}>Your Route</h2>
                
                <div style={styles.mapWrapper}>
                    <MapContainer
                        center={mapCenter}
                        zoom={12}
                        style={styles.mapContainer}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={fromCoords}>
                            <Popup>📍 Your Current Location</Popup>
                        </Marker>

                        <Marker position={toCoords}>
                            <Popup>🏁 Destination: {to}</Popup>
                        </Marker>

                        <Polyline 
                            positions={[fromCoords, toCoords]} 
                            color="blue" 
                            weight={4}
                            opacity={0.8}
                        />
                    </MapContainer>
                </div>

                <div style={styles.buttonContainer}>
                    <button 
                        onClick={() => navigate("/vehicle", { 
                            state: { 
                                from: "Your Current Location",
                                to: to,
                                fromCoords: fromCoords,
                                toCoords: toCoords
                            } 
                        })} 
                        style={styles.btn}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
                        }}
                    >
                        Next ➡
                    </button>
                </div>
            </div>
        );
    }

    // Fallback state
    return (
        <div style={{ 
            height: "100vh", 
            width: "100%", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center",
            backgroundColor: "#f8f9fa"
        }}>
            <h2 style={{ color: "#333", marginBottom: "20px" }}>No Route Data</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>Unable to load map coordinates</p>
            <button onClick={() => navigate(-1)} style={styles.btn}>Go Back</button>
        </div>
    );
}

const styles = {
    // Page container for centering content
    pageContainer: {
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        boxSizing: "border-box"
    },
    
    // Enhanced title styling
    title: {
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "28px",
        fontWeight: "bold",
        color: "#333",
        margin: "0 0 30px 0"
    },
    
    // Square map wrapper for centering
    mapWrapper: {
        width: "min(90vw, 90vh, 600px)", // Responsive square size
        height: "min(90vw, 90vh, 600px)", // Same as width for square
        maxWidth: "600px",
        maxHeight: "600px",
        border: "3px solid #333",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        marginBottom: "30px"
    },
    
    // Map container fills the wrapper
    mapContainer: {
        height: "100%",
        width: "100%",
        borderRadius: "12px"
    },
    
    // Button container styling
    buttonContainer: {
        textAlign: "center",
        width: "100%"
    },
    
    btn: {
        padding: "12px 30px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "25px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        transform: "translateY(0)",
    },
    
    // Loading spinner styles
    spinner: {
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        animation: "spin 2s linear infinite",
        margin: "0 auto"
    }
};

// Add CSS animation for spinner
const spinnerStyles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject spinner styles into document
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = spinnerStyles;
    document.head.appendChild(style);
}

export default MapPage