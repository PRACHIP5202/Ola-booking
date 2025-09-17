import React from 'react'
import { useNavigate } from 'react-router-dom'
import { famousPlaces } from '../data/location'
import { useState } from 'react'
import { useEffect } from 'react'

function InputPage() {
    const [from, setFrom]= useState("")
    const [to, setTo] = useState("")
    const navigate = useNavigate()

    useEffect(()=> {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                async (position) =>{
                    const{latitude, longitude} = position.coords

                    const res= await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
                    const data = await res.json();
                    setFrom(data.display_name || "Current Location")

                },
                (error)=>{
                    console.error("Error getting location: ", error);
                    setFrom("Could not detect ur location");
                }
            );
        }
    }, []);

    const handleNext =() =>{
        if(from && to){
            navigate("/map", {state: {from, to}});
        }else{
            alert("Plz select destination");
        }
    };
  return (
    <div style={styles.container}>
      <h2>Book uy ride</h2>
      <div style={styles.inputBox}>
        <label>From: </label>
        <input type="text" value={from} readOnly/>
      </div>

      <div style={styles.inputBox}>
        <label>To: </label>
        <select value={to} onChange={(e)=> setTo(e.target.value)}>
            <option value="">--Select Destination --</option>
            {famousPlaces.map((place, i)=>(
                <option Key={i} value={place}>{place}</option>
            ))}
        </select>
      </div>

      <button style={styles.btn} onClick={handleNext}>
        Next ➡
      </button>
    </div>
  );
}

const styles = {
  container: { padding: "20px", textAlign: "center" },
  inputBox: { margin: "10px 0" },
  btn: {
    padding: "10px 20px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px"
  }
};

export default InputPage;
