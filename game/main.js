'use strcit';


var BatMobil =  BatMobil || {};
 var mergeMeshes = function (meshName, arrayObj, scene) {
    var arrayPos = [];
    var arrayNormal = [];
    var arrayUv = [];
    var arrayUv2 = [];
    var arrayColor = [];
    var arrayMatricesIndices = [];
    var arrayMatricesWeights = [];
    var arrayIndice = [];
    var savedPosition = [];
    var savedNormal = [];
    var newMesh = new BABYLON.Mesh(meshName, scene);
    var UVKind = true;
    var UV2Kind = true;
    var ColorKind = true;
    var MatricesIndicesKind = true;
    var MatricesWeightsKind = true;

    for (var i = 0; i != arrayObj.length ; i++) {
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.UVKind]))
            UVKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.UV2Kind]))
            UV2Kind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.ColorKind]))
            ColorKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.MatricesIndicesKind]))
            MatricesIndicesKind = false;
        if (!arrayObj[i].isVerticesDataPresent([BABYLON.VertexBuffer.MatricesWeightsKind]))
            MatricesWeightsKind = false;
    }

    for (i = 0; i != arrayObj.length ; i++) {
        var ite = 0;
        var iter = 0;
        arrayPos[i] = arrayObj[i].getVerticesData(BABYLON.VertexBuffer.PositionKind);
        arrayNormal[i] = arrayObj[i].getVerticesData(BABYLON.VertexBuffer.NormalKind);
        if (UVKind)
            arrayUv = arrayUv.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.UVKind));
        if (UV2Kind)
            arrayUv2 = arrayUv2.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.UV2Kind));
        if (ColorKind)
            arrayColor = arrayColor.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.ColorKind));
        if (MatricesIndicesKind)
            arrayMatricesIndices = arrayMatricesIndices.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind));
        if (MatricesWeightsKind)
            arrayMatricesWeights = arrayMatricesWeights.concat(arrayObj[i].getVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind));

        var maxValue = savedPosition.length / 3;

        arrayObj[i].computeWorldMatrix(true);
        var worldMatrix = arrayObj[i].getWorldMatrix();

        for (var ite = 0 ; ite != arrayPos[i].length; ite += 3) {
            var vertex = new BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(arrayPos[i][ite], arrayPos[i][ite + 1], arrayPos[i][ite + 2]), worldMatrix);
            savedPosition.push(vertex.x);
            savedPosition.push(vertex.y);
            savedPosition.push(vertex.z);
        }

        for (var iter = 0 ; iter != arrayNormal[i].length; iter += 3) {
            var vertex = new BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(arrayNormal[i][iter], arrayNormal[i][iter + 1], arrayNormal[i][iter + 2]), worldMatrix);
            savedNormal.push(vertex.x);
            savedNormal.push(vertex.y);
            savedNormal.push(vertex.z);
        }

        var tmp = arrayObj[i].getIndices();
        for (it = 0 ; it != tmp.length; it++) {
            arrayIndice.push(tmp[it] + maxValue);
        }
        arrayIndice = arrayIndice.concat(tmp);

        arrayObj[i].dispose(false);
    }

    newMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, savedPosition, false);
    newMesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, savedNormal, false);
    if (arrayUv.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.UVKind, arrayUv, false);
    if (arrayUv2.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.UV2Kind, arrayUv, false);
    if (arrayColor.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.ColorKind, arrayUv, false);
    if (arrayMatricesIndices.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.MatricesIndicesKind, arrayUv, false);
    if (arrayMatricesWeights.length > 0)
        newMesh.setVerticesData(BABYLON.VertexBuffer.MatricesWeightsKind, arrayUv, false);

    newMesh.setIndices(arrayIndice);
    return newMesh;
    };
BatMobil.game = (function () {

    'use strict';
    var createScene, canvas, engine, scene, fpsBox;
 
    var Skybox = require('./skybox');
    var Camera = require('./camera');
    var Tree = require('./elements/tree');


    fpsBox = document.getElementById('fps');
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);
   
    var treeCollection = [];
    createScene = function () {
        var scene, camera, light, tree, treeClone, ground, skybox, shadowGenerator;

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

        light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -1, -2), scene);
        light.intensity = .21;
        light.position = new BABYLON.Vector3(-300,300,600);
        shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

        tree = new Tree(scene);
        for(var i = 0; i < 70; i++) {
            treeClone = tree.clone('clonedTree'+i);
            treeClone.position = new BABYLON.Vector3(-50 + Math.random() * 100, 7.5, -50 + Math.random() * 100);
            shadowGenerator.getShadowMap().renderList.push(treeClone);
        }

        ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 1, scene);
        ground.checkCollisions = true;
        ground.receiveShadows = true;
        ground.material = new BABYLON.StandardMaterial("ground", scene);
        ground.material.diffuseTexture = new BABYLON.Texture("assets/images/floor.jpg", scene);
        ground.material.diffuseTexture.uScale = 60;
        ground.material.diffuseTexture.vScale = 60;

        return scene;
    };
    scene = createScene();

    engine.runRenderLoop(function () {
        //var cylinder = scene.getMeshByName('cylinder');
        // cylinder.rotation.y += 0.005;
       
        scene.render();
    });
    
    window.addEventListener("resize", function () {
        engine.resize();
    });
})();
