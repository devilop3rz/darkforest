'use strcit';


var BatMobil =  BatMobil || {};

BatMobil.game = (function () {

    'use strict';
    var createScene, canvas, engine, scene, fpsBox;
    
    var Skybox = require('./skybox');
    var Camera = require('./camera');


    fpsBox = document.getElementById('fps');
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);
   

    createScene = function () {
        var scene, camera, light, cylinder, ground, skybox;

        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0, 0.2, 0.2);
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        scene.collisionsEnabled = true;
        scene.ambientColor = new BABYLON.Color3(.3, 1, .3);
        
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.05;
        scene.fogStart = 20.0;
        scene.fogEnd = 60.0;
        scene.fogColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        camera = new Camera(scene, canvas);
        skybox = new Skybox(scene);

        //light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, .1, 0), scene);
        light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -1, -2), scene);
        light.intensity = .21;
        light.position = new BABYLON.Vector3(-300,300,600);
        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

        var treeMaterial = new BABYLON.StandardMaterial("texture1", scene);
        treeMaterial.diffuseTexture = new BABYLON.Texture("assets/images/tree.jpg", scene);


        //treeMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
        
        cylinder = BABYLON.Mesh.CreateCylinder("cylinder", 15, 1, 1, 8, 1, scene, false);
        cylinder.position.y = 7.5;
        cylinder.position.x = -50 + Math.random() * 100;
        cylinder.position.z = -50 + Math.random() * 100;
        cylinder.material = treeMaterial;
        cylinder.checkCollisions = true;

        for(var i = 0; i < 50; i++) {
              var cylinderClone = cylinder.clone('clonedCylinder'+i);
         
            cylinderClone.position.x = -50 + Math.random() * 100;
            cylinderClone.position.z = -50 + Math.random() * 100;
           shadowGenerator.getShadowMap().renderList.push(cylinderClone);
        }
        
        ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
        ground.checkCollisions = true;
        ground.receiveShadows = true;
        

        return scene;
    };
    scene = createScene();

    engine.runRenderLoop(function () {
        //var cylinder = scene.getMeshByName('cylinder');
        // cylinder.rotation.y += 0.005;
        fpsBox.innerHTML =  engine.getFps().toFixed();
        scene.render();
    });
    
    window.addEventListener("resize", function () {
        engine.resize();
    });
})();

