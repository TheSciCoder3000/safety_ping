import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/css/Maps.css';
import { db, storage } from '../api/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, setDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import BottomNav from '../components/BottomNav';

function Map() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    location: null,
    time: '',
    date: '',
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState([]);
  const [isAddingPin, setIsAddingPin] = useState(false); // Toggle for "add pin" mode

  // Initialize the map and fetch pins
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmV1cm9jb2RlciIsImEiOiJjbTdmdHoxOXYwcmptMmxxM2NuZ2d5a2FiIn0.ZvI5-Xd-lsB-c2Fhou3KDQ'; // Replace with your valid token

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/examples/clg45vm7400c501pfubolb0xz', // Ensure this style URL is valid
      center: [-87.661557, 41.893748], // Default center
      zoom: 10.7
    });

    mapRef.current = map;

    // // Add sample pins for demonstration
    // const samplePins = [
    //   {
    //     description: 'Trial Sample',
    //     location: { lng: -87.661557, lat: 41.893748 },
    //     time: '12:00 PM',
    //     date: '2023-10-01',
    //     image: 'https://via.placeholder.com/150'
    //   },
    //   {
    //     description: 'John Juvi Nadapa',
    //     location: { lng: -87.671557, lat: 41.903748 },
    //     time: '1:00 PM',
    //     date: '2023-10-02',
    //     image: 'https://via.placeholder.com/150'
    //   }
    // ];

    // samplePins.forEach(pin => {
    //   new mapboxgl.Marker()
    //     .setLngLat(pin.location)
    //     .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(pin.description))
    //     .addTo(map);
    // });

    // Fetch pins from Firestore
    const fetchPins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pins'));
        const fetchedPins = [];
        querySnapshot.forEach((doc) => {
          fetchedPins.push({ id: doc.id, ...doc.data() });
        });
        setPins(fetchedPins);
        setLoading(false);

        // Add fetched pins to the map
        fetchedPins.forEach(pin => {
          new mapboxgl.Marker()
            .setLngLat(pin.location)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(pin.description))
            .addTo(map);
        });
      } catch (error) {
        console.error('Error fetching pins: ', error);
        setLoading(false);
      }
    };

    fetchPins();

    // Handle map clicks to add new pins (only in "add pin" mode)
    const handleMapClick = (event) => {
      if (isAddingPin) {
        setFormData({
          ...formData,
          location: event.lngLat,
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString()
        });
        setShowForm(true);
      }
    };

    map.on('click', handleMapClick);

    // Change cursor based on mode
    if (isAddingPin) {
      map.getCanvas().style.cursor = 'crosshair';
    } else {
      map.getCanvas().style.cursor = 'grab';
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

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = null;
      if (formData.image) {
        const imageRef = ref(storage, `images/${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }
  
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
  
      // Add the pin to Firestore
      const docRef = await addDoc(collection(db, 'pins'), {
        description: formData.description,
        pinId: pinId,
        location: location, // Use the converted location object
        time: formData.time,
        date: formData.date,
        image: imageUrl
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
        location: null,
        time: '',
        date: '',
        image: null
      });
      setIsAddingPin(false); // Exit "add pin" mode after submission
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding pin');
    }
  };

  return (
    <>
      <div id='map-container' ref={mapContainerRef} className="map-container" />
      {loading && <p>Loading map and pins...</p>}
      {showForm && (
        <form onSubmit={handleSubmit} className="pin-form">
          <label>
            Description:
            <input type="text" name="description" value={formData.description} onChange={handleInputChange} required />
          </label>
          <label>
            Image:
            <input type="file" name="image" onChange={handleImageChange} />
          </label>
          <button type="submit">Add Pin</button>
        </form>
      )}
      <div className="pin-list">
        <h3>Pin IDs:</h3>
        <ul>
          {pins.map((pin) => (
            <li key={pin.id}>Pin ID: {pin.pinId}</li>
          ))}
        </ul>
      </div>
      <button
        className="toggle-add-pin"
        onClick={() => setIsAddingPin(!isAddingPin)}
      >
        {isAddingPin ? 'Exit Add Pin Mode' : 'Add Pin Mode'}
      </button>
      <BottomNav />
    </>
  );
}

export default Map;