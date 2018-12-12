import { Component, ElementRef, AfterContentInit, NgZone, ChangeDetectorRef } from '@angular/core';
import * as THREE from 'three-full';
//import * as Stats from 'stats.js';
//import { OrbitControls } from 'three';
//import { Scene } from 'three';


@Component({
    selector: 'three-study',
    templateUrl: `./app.component.html`
})
export class AppComponent implements AfterContentInit {
    //public stats: Stats;
    public winWidth: number = window.innerWidth;
    public winHeight: number = window.innerHeight;
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public controls: THREE.OrbitControls;
    public renderer: THREE.WebGLRenderer;
    public cube: THREE.Mesh;
    public sphere: THREE.Mesh;
    public torus: THREE.Mesh;
    private anmationFrame: any; //requestAnimationFrame

    constructor(
        private elementRef: ElementRef,
        private zone: NgZone,
        private cd: ChangeDetectorRef
    ){
        //this.stats = new Stats();
    }

    ngAfterContentInit(){
        //this.initSettingThree();
        //this.createBoxGeometry();
        //this.createSphereGeometry();
        //this.createTorusGeometry();
        //this.setPointLight();
        //this.animateScene();
    }

    public init(){
        //this.elementRef.nativeElement.appendChild(this.stats.dom);
    }

    public initSettingThree(){
        const FIELD_OF_VIEW = 75;
        const ASPECT = this.winWidth / this.winHeight;
        const NEAR = 0.1;
        const FAR = 10000;
        const axes = new THREE.AxesHelper(5);
        const grid = new THREE.GridHelper(100, 10);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, ASPECT, NEAR, FAR);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.winWidth, this.winHeight);

        this.elementRef.nativeElement.appendChild(this.renderer.domElement);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 50;

        this.scene.add(axes);
        this.scene.add(grid);

        this.zone.run(() => { this.cd.markForCheck(); });
    }

    public setPointLight(){
        const pointLight = new THREE.PointLight(0xFFFFFF, 0.5);
        //pointLight.position.x = 100;
        //pointLight.position.y = 100;
        //pointLight.position.z = 30;
        pointLight.position.set(-35, 77, 80);
        this.scene.add(pointLight);
    }

    public createBoxGeometry(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const meterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, meterial);
        this.scene.add(this.cube);
        this.camera.position.z = 5;
    }

    public createSphereGeometry(){
        const geometry = new THREE.SphereGeometry(1, 15, 15);
        const meterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        
        this.sphere = new THREE.Mesh(geometry, meterial);
        this.scene.add(this.sphere);
        this.camera.position.z = 5;
    }

    public createTorusGeometry(){
        const geometry = new THREE.TorusGeometry(5, 1, 30, 30);
        const meterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

        this.torus = new THREE.Mesh(geometry, meterial);
        this.scene.add(this.torus);
        this.camera.position.z = 20;
    }

    public animateScene = () => {
        this.anmationFrame = requestAnimationFrame(this.animateScene);

        //animate code
        //this.cube.rotation.x += 0.01;
        //this.cube.rotation.y += 0.01;

        //this.sphere.rotation.x += 0.05;
        //this.sphere.rotation.y += 0.01;
        //this.cube.rotation.z += 0.01;
        this.torus.rotation.y += 0.01;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
