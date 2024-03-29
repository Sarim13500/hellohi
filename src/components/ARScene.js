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
        
        // Change this to a location 0.001 degrees of latitude north of you, so that you will face it
        arjs.add(box, 10.759166, 59.909562); 

        // Start the GPS
        arjs.startGps();

        const rotationStep = 2 * Math.PI / 180;


        let mousedown = false, lastX =0;

        window.addEventListener("mousedown", e=> {
            mousedown = true;
        });

        window.addEventListener("mouseup", e=> {
            mousedown = false;
        });

        window.addEventListener("mousemove", e=> {
            if(!mousedown) return;
            if(e.clientX < lastX) {
                camera.rotation.y -= rotationStep;
                if(camera.rotation.y < 0) {
                    camera.rotation.y += 2 * Math.PI;
                }
            } else if (e.clientX > lastX) {
                camera.rotation.y += rotationStep;
                if(camera.rotation.y > 2 * Math.PI) {
                    camera.rotation.y -= 2 * Math.PI;
                }
            }
            lastX = e.clientX;
        });

        function render() {
            if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
                renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
                const aspect = canvas.clientWidth / canvas.clientHeight;
                camera.aspect = aspect;
                camera.updateProjectionMatrix();
            }
            cam.update();
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        render();

        return () => {
        };
    }, []);

    return <canvas ref={canvasRef} style={{ backgroundColor: 'black', width: '100%', height: '100%' }} />;
};

export default ARScene;
