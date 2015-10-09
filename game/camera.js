module.exports = function (scene, canvas) {
    'use strict';

    var camera;

    camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 2, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    camera.applyGravity = true;
    //camera.ellipsoid = new BABYLON.Vector3(1, 3, 1);
    camera.checkCollisions = true;
    camera.speed = 0.08;
    camera.angularSensibility = 1000;
    return camera;
};