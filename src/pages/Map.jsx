import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/css/Maps.css';
import { db, auth } from '../api/firebase'; // Import auth from Firebase
import { collection, addDoc, doc, getDoc, updateDoc, setDoc, getDocs } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';

function Map() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    details: '',
    location: null,
    time: '',
    date: '',
    categories: '',
    reports: ''
  });
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState([]);
  const [isAddingPin, setIsAddingPin] = useState(false); // Toggle for "add pin" mode
  const [userId, setUserId] = useState(null); // State to store the current user's ID

  // Fetch the current user's ID when the component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID if the user is logged in
      } else {
        setUserId(null); // Clear the user ID if the user is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmV1cm9jb2RlciIsImEiOiJjbTdmdHoxOXYwcmptMmxxM2NuZ2d5a2FiIn0.ZvI5-Xd-lsB-c2Fhou3KDQ'; //API Key
    const initializeMap = (position) => {
      const { latitude, longitude } = position.coords;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/examples/clg45vm7400c501pfubolb0xz',
        center: [longitude, latitude], 
        zoom: 10.7
      });

      mapRef.current = map;

      const fetchPins = async () => {
        const querySnapshot = await getDocs(collection(db, 'pins'));
        querySnapshot.forEach((doc) => {
          const pinData = doc.data();
          new mapboxgl.Marker()
            .setLngLat(pinData.location)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(pinData.description))
            .addTo(mapRef.current);
        });
      };

      fetchPins();

      map.on('click', (event) => {
        if (isAddingPin) {
          setFormData({
            ...formData,
            location: event.lngLat,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
          });
          setShowForm(true); // Show the form when a pin location is clicked
        }
      });

      if (isAddingPin) {
        map.getCanvas().style.cursor = 'crosshair';
      } else {
        map.getCanvas().style.cursor = 'grab';
      }
    };

    const handleLocationError = (error) => {
      console.error('Error getting user location: ', error);
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/examples/clg45vm7400c501pfubolb0xz', // Ensure this style URL is valid
        center: [-87.661557, 41.893748], // Default center
        zoom: 10.7
      });

      mapRef.current = map;

      const fetchPins = async () => {
        const querySnapshot = await getDocs(collection(db, 'pins'));
        querySnapshot.forEach((doc) => {
          const pinData = doc.data();
          new mapboxgl.Marker()
            .setLngLat(pinData.location)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(pinData.description))
            .addTo(mapRef.current);
        });
      };

      fetchPins();

      map.on('click', (event) => {
        if (isAddingPin) {
          setFormData({
            ...formData,
            location: event.lngLat,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
          });
          setShowForm(true); // Show the form when a pin location is clicked
        }
      });

      if (isAddingPin) {
        map.getCanvas().style.cursor = 'crosshair';
      } else {
        map.getCanvas().style.cursor = 'grab';
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(initializeMap, handleLocationError);
    } else {
      handleLocationError(new Error('Geolocation is not supported by this browser.'));
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [isAddingPin]); // Re-run effect when isAddingPin changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert LngLat object to a plain object
      const location = {
        lng: formData.location.lng,
        lat: formData.location.lat
      };

      // Get the current pin ID and increment it
      const pinIdDocRef = doc(db, 'metadata', 'pinId');
      const pinIdDoc = await getDoc(pinIdDocRef);
      let pinId = 1000;
      if (pinIdDoc.exists()) {
        pinId = pinIdDoc.data().currentId + 1;
        await updateDoc(pinIdDocRef, { currentId: pinId });
      } else {
        await setDoc(pinIdDocRef, { currentId: pinId });
      }

      // Add the pin to Firestore with the user ID
      const docRef = await addDoc(collection(db, 'pins'), {
        description: formData.description,
        details: formData.details,
        categories: formData.categories,
        reports: formData.reports,
        pinId: pinId,
        location: location,
        time: formData.time,
        date: formData.date,
        userId: userId // Include the user ID in the pin document
      });

      // Add the pin to the map
      new mapboxgl.Marker()
        .setLngLat(formData.location)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(formData.description))
        .addTo(mapRef.current);

      alert('Pin added successfully');
      setShowForm(false);
      setFormData({
        description: '',
        details: '',
        location: null,
        date: '',
        time: '',
        categories: '',
        reports: ''
      });
      setIsAddingPin(false); // Exit "add pin" mode after submission
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding pin');
    }
  };

  const handleToggleAddPin = () => {
    setIsAddingPin(!isAddingPin);
    setShowForm(false); // Hide the form when exiting "Add Pin Mode"
  };

  return (
    <>
      <div id='map-container' ref={mapContainerRef} className="map-container" />
      {loading && <p>Loading map and pins...</p>}
      {showForm && (
        <form onSubmit={handleSubmit} className="pin-form">
          <label>
            Situation/Event:
            <input type="text" name="description" value={formData.description} onChange={handleInputChange} required />
          </label>
          <label>
            Details:
            <input name="details" value={formData.details} onChange={handleInputChange}required />
          </label>
          <label>
            Time:
            <input type="text" name="time" value={formData.time} onChange={handleInputChange} required />
          </label>
          <label>
            Date:
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={formData.location ? `${formData.location.lng}, ${formData.location.lat}` : ''} readOnly />
          </label>
          <label>
            Categories:
            <select name="categories" value={formData.categories} onChange={handleInputChange}>
              <option value="">Select a category</option>
              <option value="road">Road Related</option>
              <option value="emergency">Flooding</option>
              <option value="health">Stranded</option>
              <option value="politics">Medical Related</option>
            </select>
            <label>
              Type of Report: 
              <select name="reports" value={formData.reports} onChange={handleInputChange}>
                <option value="sos">SOS/Emergencies</option>
                <option value="hazards">Hazards</option>
              </select>
            </label>
          </label>
          <button type="submit">Add Pin</button>
        </form>
      )}
      <button
        className="toggle-add-pin"
        onClick={handleToggleAddPin}
      >
        {isAddingPin ? 'Exit Add Pin Mode' : 'Add Pin Mode'}
      </button>
      <BottomNav />
    </>
  );
}

export default Map;