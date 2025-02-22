import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

function MapTemp() {

    const mapRef = useRef()
    const mapContainerRef = useRef()

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibmV1cm9jb2RlciIsImEiOiJjbTdmdHoxOXYwcmptMmxxM2NuZ2d5a2FiIn0.ZvI5-Xd-lsB-c2Fhou3KDQ'
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/examples/clg45vm7400c501pfubolb0xz',
            center: [-87.661557, 41.893748],
            zoom: 10.7
        });

        mapRef.current.on('click', (event) => {
            const features = mapRef.current.queryRenderedFeatures(event.point, {
                layers: ['chicago-parks']
            });
            if (!features.length) {
                return;
            }
            const feature = features[0];

            const popup = new mapboxgl.Popup({ offset: [0, -15] })
                .setLngLat(feature.geometry.coordinates)
                .setHTML(
                    `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                )
                .addTo(mapRef.current);
        });

        return () => {
            mapRef.current.remove()
        }
    }, [])

    return (
        <>
            <div id='map-container' ref={mapContainerRef} />
        </>
    );
}

export default MapTemp;