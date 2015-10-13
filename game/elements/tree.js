

module.exports = function (scene) {
    'use strict';

    var tree, treeTop, treeMaterial;

    treeMaterial = new BABYLON.StandardMaterial("texture1", scene);
    treeMaterial.diffuseTexture = new BABYLON.Texture("assets/images/tree.jpg", scene);

    tree = BABYLON.Mesh.CreateCylinder("tree", 15, 1, 1, 15, 1, scene, false);
    tree.setEnabled(false);
    tree.material = treeMaterial;
    tree.checkCollisions = true;

    treeTop = BABYLON.Mesh.CreateSphere("sphere", 1.0, 21.0, scene);
    treeTop.parent = tree;
    treeTop.position.y = 15;
    return tree;

};

