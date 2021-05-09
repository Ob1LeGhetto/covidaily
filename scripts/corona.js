import * as THREE from '../node_modules/three/build/three.module.js';
import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, controls, container;

function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function randomGreen() {
    let green = 100;
    let blue = randomNum(0, green / 1.5).toFixed(0);
    let red = randomNum(0, green / 1.5).toFixed(0);
    return 'rgb(' + red + ',' + green + ',' + blue + ')';
}

function init() {
    container = document.createElement('div');
    container.setAttribute('id', 'virus');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 12000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.background = new THREE.Color('rgba(255, 255, 255)');

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 15);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    scene.add(camera);

    function onError() {}

    function onProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
        }
    }

    const loader = new OBJLoader();

    function generateViruses(n) {
        for (let i = 0; i < n; i++) {
            loader.load(
                'virus.obj',
                (object) => {
                    object.position.x = randomNum(-3000, 10000);
                    object.position.y = randomNum(-1200, 1200);
                    object.position.z = randomNum(-6000, -1000);

                    object.rotation.x = randomNum(0, 1);
                    object.rotation.y = randomNum(0, 1);
                    object.rotation.z = randomNum(0, 1);

                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = new THREE.MeshPhongMaterial({
                                color: randomGreen(),
                                shininess: 10,
                                flatShading: true,
                                skinning: true,
                                specular: 0x000000
                            });
                        }
                    });
                    scene.add(object);
                },
                onProgress,
                onError
            );
        }
    }

    generateViruses(10);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.2;
    controls.zoomSpeed = 5;
    controls.enabled = false;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function setIntervalX(sign, delay, repetitions) {
    let x = 0;
    let intervalID = window.setInterval(function () {
        if (sign === 'negative') {
            camera.translateX(-Math.abs(repetitions - x));
        } else {
            camera.translateX(repetitions - x);
        }
        if (++x === repetitions) {
            window.clearInterval(intervalID);
        }
    }, delay);
}

$('input').on('click', $('.not-selected-section'), function () {
    if ($(this).attr('id') === 'homepage') {
        setIntervalX('positive', 16, 55);
    } else if ($(this).attr('id') === 'before') {
        setIntervalX('negative', 16, 55);
    }
});

function render() {
    renderer.render(scene, camera);
    controls.update();
    let viruses = scene.children.slice(3, scene.children.length);
    viruses.forEach((element) => {
        element.rotation.x += 0.001;
        element.rotation.y += 0.001;
    });
}

init();
animate();
