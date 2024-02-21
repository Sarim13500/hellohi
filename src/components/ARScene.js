import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js';

const ARScene = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
        const renderer = new THREE.WebGLRenderer({ canvas });

        const arjs = new THREEx.LocationBased(scene, camera);
        const cam = new THREEx.WebcamRenderer(renderer);

        const geom = new THREE.BoxGeometry(20, 20, 20);
        const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const box = new THREE.Mesh(geom, mtl);

        // Create the device orientation tracker
        const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);

        // Change this to a location close to you (e.g. 0.001 degrees of latitude north of you)
        arjs.add(box, 10.759166, 59.909562);

        arjs.startGps();

        function render() {
            if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
                renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
                const aspect = canvas.clientWidth / canvas.clientHeight;
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
            }

            // Update the scene using the latest sensor readings
            deviceOrientationControls.update();

            cam.update();
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        render();

        return () => {
            // Clean up code here
            renderer.dispose();
            // Remove event listeners if necessary
        };
    }, []);

    return <canvas ref={canvasRef} style={{ backgroundColor: 'black', width: '100%', height: '100%' }} />;
};

export default ARScene;
