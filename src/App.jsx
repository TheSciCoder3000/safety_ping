<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Map from './pages/map';
import Account from './pages/Account';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
=======
import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import { db, storage } from './firebase';
import { collection, addDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function App() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    location: null,
    time: '',
    date: '',
    image: null
  });

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibmV1cm9jb2RlciIsImEiOiJjbTdmdHoxOXYwcmptMmxxM2NuZ2d5a2FiIn0.ZvI5-Xd-lsB-c2Fhou3KDQ';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/examples/clg45vm7400c501pfubolb0xz',
      center: [-87.661557, 41.893748],
      zoom: 10.7
    });

    mapRef.current.on('click', (event) => {
      setFormData({
        ...formData,
        location: event.lngLat,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      });
      setShowForm(true);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

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

      const docRef = await addDoc(collection(db, 'pins'), {
        description: formData.description,
        pinId: pinId,
        location: formData.location,
        time: formData.time,
        date: formData.date,
        image: imageUrl
      });

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
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding pin');
    }
  };

  return (
    <>
      <div id='map-container' ref={mapContainerRef} />
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
>>>>>>> b116a487e51ff3856130348d9618126ca28d7a9b
    </>
  );
}

export default App;