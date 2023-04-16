import './main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import fragment from './shaders/fragment.glsl.js';
import vertex from './shaders/vertex.glsl.js';
import importsVertex from './shaders/imports.glsl.js';
import beginVertex from './shaders/beginVertex.glsl.js';
import beginNormalVertex from './shaders/beginNormalVertex.glsl';
import font from './fonts/folklore_regular.data';

export default class Sketch {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene2 = new THREE.Scene();

    this.group = new THREE.Group();
    this.group2 = new THREE.Group();

    this.group.rotation.x = Math.PI / 4;
    this.group2.rotation.x = -Math.PI / 4;

    this.scene.add(this.group);
    this.scene2.add(this.group2);

    this.container = document.getElementById('container');
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x222222, 1);
    this.renderer.useLegacyLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setScissorTest(true);
    this.container.appendChild(this.renderer.domElement);

    // this.camera = new THREE.PerspectiveCamera(
    //   70,
    //   window.innerWidth / window.innerHeight,
    //   0.001,
    //   1000
    // );

    const frustrumSize = 1.5;
    const aspect = this.width / this.height;
    this.camera = new THREE.OrthographicCamera(
      (frustrumSize * aspect) / -2,
      (frustrumSize * aspect) / 2,
      frustrumSize / 2,
      frustrumSize / -2,
      -1000,
      1000
    );
    this.camera.position.set(0, 0, -2);
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;

    this.addMesh();
    this.addLights();
    // this.setupResize();
    // this.resize();
    this.render();
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    // image cover
    this.imageAspect = 853 / 1280;
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    // optional - cover with quad
    const distance = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * distance));

    // if (w/h > 1)
    // if (this.width / this.height > 1) {
    //   this.plane.scale.x = this.camera.aspect;
    // } else {
    //   this.plane.scale.y = 1 / this.camera.aspect;
    // }

    this.camera.updateProjectionMatrix();
  }

  addLights() {
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9); // soft white light
    this.scene.add(ambLight);
    this.scene2.add(ambLight.clone());

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(0, -1, 0);
    this.scene.add(dirLight);
    this.scene2.add(dirLight.clone());
  }

  addMesh() {
    this.uniforms = {
      uTime: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uMin: { value: new THREE.Vector3(0, 0, 0) },
      uMax: { value: new THREE.Vector3(0, 0, 0) },
    };

    this.material = new THREE.MeshStandardMaterial({
      color: 0x333333,
    });

    this.material.onBeforeCompile = (shader) => {
      this.material.userData.shader = shader;
      // Uniforms
      shader.uniforms.uTime = this.uniforms.uTime;
      shader.uniforms.uMin = this.uniforms.uMin;
      shader.uniforms.uMax = this.uniforms.uMax;

      // Vertex shader
      shader.vertexShader = importsVertex + shader.vertexShader;

      // Make rounded
      const beginVertexString = /* glsl */ `#include <begin_vertex>`;
      shader.vertexShader = shader.vertexShader.replace(
        beginVertexString,
        beginVertexString + beginVertex
      );

      const beginNormalVertexString = /* glsl */ `#include <beginnormal_vertex>`;
      shader.vertexShader = shader.vertexShader.replace(
        beginNormalVertexString,
        beginNormalVertexString + beginNormalVertex
      );
    };

    const loader = new FontLoader();

    loader.load(font, (font) => {
      const geometry = new TextGeometry('Euphoria', {
        font: font,
        size: 0.1,
        height: 0.1,
        curveSegments: 50,
        bevelEnabled: false,
      });
      // geometry = new THREE.BoxGeometry(0.5, 0.1, 0.1, 100, 100, 100);
      let dummy = new THREE.BoxGeometry(0.15, 0.00001, 0.0001).toNonIndexed();
      let clone = geometry.clone();

      clone.computeBoundingBox();
      dummy.translate(clone.boundingBox.max.x, 0, 0);

      let final = mergeGeometries([dummy, clone]);

      geometry.center();
      geometry.computeBoundingBox();

      const bBox = geometry.boundingBox;
      this.uniforms.uMin.value.x = bBox.min.x;
      this.uniforms.uMax.value.x = bBox.max.x;

      // Mesh
      const mesh = new THREE.Mesh(geometry, this.material);
      const mesh2 = new THREE.Mesh(geometry, this.material);
      this.group.add(mesh);
      this.group2.add(mesh2);

      // Axes helper
      const axesHelper = new THREE.AxesHelper(5);
      this.scene.add(axesHelper);
    });
  }

  render() {
    this.time += 0.05;
    this.uniforms.uTime.value = this.time;
    window.requestAnimationFrame(this.render.bind(this));

    // Scenes
    this.renderer.setScissor(0, 0, this.width / 2, this.height);
    this.renderer.render(this.scene, this.camera);

    this.renderer.setScissor(this.width / 2, 0, this.width, this.height);
    this.renderer.render(this.scene2, this.camera);
  }
}

new Sketch();
