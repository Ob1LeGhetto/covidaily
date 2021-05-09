import * as THREE from '../node_modules/three/build/three.module.js';
import {
    OBJLoader
} from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import {
    OrbitControls
} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, controls, container;

function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function randomGreen() {
    let green = randomNum(100, 200).toFixed(0);
    let blue = randomNum(0, (green / 1.75)).toFixed(0);
    let red = randomNum(0, (green / 1.75)).toFixed(0);
    return "rgb(" + red + "," + green + "," + blue + ")";
}

function init() {
    container = document.createElement('div');
    container.setAttribute("id", "virus");
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 12000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.background = new THREE.Color('rgba(237, 247, 235, 0.393)');

    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(0, 100, 0);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    scene.add(camera);

    // function loadModel() {
    //     object.position.y = randomNum(-2000, 2000);
    //     object.position.z = randomNum(-2500, -7000);
    //     scene.add(object);
    // }

    // const manager = new THREE.LoadingManager(loadModel);

    function onError() {}

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
        }
    }

    const loader = new OBJLoader();

    function generateViruses(n) {
        for (let i = 0; i < n; i++) {
            loader.load('virus.obj', (object) => {
                let z1 = randomNum(-8000, -4000);
                let z2 = randomNum(4000, 8000);

                object.position.x = randomNum(-4000, 4000);
                object.position.y = randomNum(-2000, 2000);
                object.position.z = randomNum(z1, z2);
                
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshPhongMaterial({
                            color: randomGreen(),
                            shininess: 10,
                            // flatShading: true,
                            // skinning: true,
                            specular: 0x000000
                        });
                    }
                });
                scene.add(object);
            }, onProgress, onError)
        }

    }

    generateViruses(5);


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.zoomSpeed = 5;
    controls.enabled = false;

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
    controls.update();
    let viruses = scene.children.slice(3, scene.children.length);
    viruses.forEach(element => {
        element.rotation.x += 0.001;
        element.rotation.y += -0.001;
    });
}

init();
animate()