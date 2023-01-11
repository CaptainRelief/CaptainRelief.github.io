import * as CANNON from "https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js"
import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';


const canvas = document.getElementById("c");
var world = new CANNON.World();


// Create the ground as a PlaneBufferGeometry with a MeshBasicMaterial
var groundGeometry = new THREE.PlaneBufferGeometry(10, 10);
var groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);

// Rotate and position the ground
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;

var characterGeometry = new THREE.BoxGeometry(1, 1, 1)
var characterMaterial = new THREE.MeshBasicMaterial({ transparent: true, color: 0xff0000 });
var character = new THREE.Mesh(characterGeometry, characterMaterial);

character.position.set(0, 0, 0);
character.opacity = 0;

// Create a sprite using a texture
var spriteMap = new THREE.TextureLoader().load("haamu.png");
var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap });
var sprite = new THREE.Sprite(spriteMaterial);

sprite.position.set(0, 5, 0);
// Scale the sprite
sprite.scale.set(10, 10, 1);

sprite.material.opacity = 1;

// Add the sprite as a child of the cube
character.add(sprite);

var camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);
camera.lookAt(character.position);

var renderer = new THREE.WebGLRenderer(canvas);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls( camera, renderer.domElement );

var scene = new THREE.Scene();
scene.add(character);
scene.add(camera);

// Add the ground to the scene
scene.add(ground);

// Create a physics body for the ground
var groundBody = new CANNON.Body({
    mass: 0, // mass of 0 makes it immovable
    position: new CANNON.Vec3(0, -0.5, 0), // position it at the bottom of the scene
    shape: new CANNON.Plane()
  });
  world.addBody(groundBody);

  
// Create a physics body for the character
var characterBody = new CANNON.Body({
    mass: 1, // 1 kg
    position: new CANNON.Vec3(0, 0, 0),
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  });
  world.addBody(characterBody);
  world.addBody(groundBody);

var contactMaterial = new CANNON.ContactMaterial(groundMaterial, characterMaterial, {
    friction: 0.01,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3,
    frictionEquationStiffness: 1e8,
    frictionEquationRegularizationTime: 3
});
world.addContactMaterial(contactMaterial);

  // Create a constraint to keep the character on the ground
    var characterGroundConstraint = new CANNON.LockConstraint(characterBody, groundBody);
  world.addConstraint(characterGroundConstraint);

  var force = new CANNON.Vec3(); // force vector
  var forceDirection = new CANNON.Vec3(); // force direction
  
  document.addEventListener("keydown", onDocumentKeyDown, false);
  document.addEventListener("keyup", onDocumentKeyUp, false);
  
  const movementSpeed = 0.001;

  function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        // W key
        forceDirection.set(0, 0, -1); // set the force direction
    } else if (keyCode == 83) {
        // S key
        forceDirection.set(0, 0, 1); // set the force direction
    } else if (keyCode == 65) {
        // A key
        forceDirection.set(-1, 0, 0); // set the force direction
    } else if (keyCode == 68) {
        // D key
        forceDirection.set(1, 0, 0); // set the force direction
    }
    force.copy(forceDirection.scale(movementSpeed)); // set the force
    characterBody.applyLocalForce(force, new CANNON.Vec3()); // apply the
}
  function onDocumentKeyUp(event) {
    forceDirection.set(0, 0, 0);
    force.set(0, 0, 0);
    }
    


var timeStep = (1 / 60);

function render() {
    world.step(timeStep);
    requestAnimationFrame(render);
    character.position.copy(characterBody.position);
    character.quaternion.copy(characterBody.quaternion);
    renderer.render(scene, camera);
}

render();

function cleanup() {
    world.remove(groundBody);
    world.remove(characterBody);
}