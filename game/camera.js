module.exports = function (scene, canvas) {
    'use strict';

    var camera, pointerlockchange;

    camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 2, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    camera.applyGravity = true;
   // camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);
    camera.checkCollisions = true;
    camera.speed = 0.08;
    camera.inertia = 0.9;
    camera.angularSensibility = 1000;

    canvas.addEventListener('click', function() {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    }, false);

    pointerlockchange = function () {};

    // Attach events to the document
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mspointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);

    return camera;
};