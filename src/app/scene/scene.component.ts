import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three-full';
import * as Stats from 'stats.js';
import * as dat from 'dat.gui';
//import "./js/EnableThreeExamples";

@Component({
    selector: 'scene',
    templateUrl: './scene.component.html'
})
export class SceneComponent implements AfterViewInit {

    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private cameraTarget: THREE.Vector3;
    public scene: THREE.Scene;

    public fieldOfView: number = 50;
    public nearClippingPane: number = 1;    
    public farClippingPane: number = 1100;

    public controls: THREE.OrbitControls;
    public cube: THREE.Mesh;
    public animationFrame: any;
    public stats: Stats;
    public gui: dat.GUI; 

    @ViewChild('canvas') private canvasRef: ElementRef;

    constructor(private elementRef: ElementRef) {
        this.stats = new Stats();
        this.elementRef.nativeElement.appendChild(this.stats.dom);
    }

    /* LIFECYCLE */
    ngAfterViewInit() {
        this.createScene();
        this.createLight();
        this.createCamera();
        this.createBoxGeometry();
        this.startRendering();
        this.addControls();
        this.setGui();
    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private createScene() {
        const grid = new THREE.GridHelper(100, 50);
        const axes = new THREE.AxesHelper(200);
        this.scene = new THREE.Scene();
        
        //this.scene.add(grid);
        //this.scene.add(axes);
        const loader = new THREE.ColladaLoader();
        loader.load('./assets/model/Orange_dae/Orange.dae', this.onModelLoadingCompleted);
    }

    private onModelLoadingCompleted = (collada) => {
        console.log('collada', collada);
        let modelScene = collada.scene;
        modelScene.position.set(0, 0, 0);
        this.scene.add(modelScene);
        this.render();
    }

    private createLight() {
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(-80, 180, 180);
        this.scene.add(light);
    }

    private createCamera() {
        let aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPane,
            this.farClippingPane
        );

        // Set position and look at
        this.camera.position.set(10, 10, 10);
        //this.camera.position.x = 10;
        //this.camera.position.y = 10;
        //this.camera.position.z = 10;
    }

    private getAspectRatio(): number {
        let height = this.canvas.clientHeight;
        if (height === 0) {
            return 0;
        }
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private startRendering() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.autoClear = true;        

        //this.render();
    }

    public render = () => {
        this.renderer.render(this.scene, this.camera);
        this.animationFrame = requestAnimationFrame(this.render);
        this.animationBoxGeometry();
        this.stats.update();
        this.camera.updateProjectionMatrix();
    }

    public addControls() {
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        //this.controls.addEventListener('change', this.render);
    }

    /* EVENTS */
    public onMouseDown(event: MouseEvent) {
        //console.log("onMouseDown");
        event.preventDefault();

        // Example of mesh selection/pick:
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);

        let obj: THREE.Object3D[] = [];
        this.findAllObjects(obj, this.scene);
        const intersects = raycaster.intersectObjects(obj);
        //console.log("Scene has " + obj.length + " objects");
        //console.log(intersects.length + " intersected objects found")
        intersects.forEach((i) => {
            //console.log(i.object); // do what you want to do with object
        });
    }

    private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
        // NOTE: Better to keep separate array of selected objects
        if (parent.children.length > 0) {
            parent.children.forEach((i) => {
                pred.push(i);
                this.findAllObjects(pred, i);                
            });
        }
    }

    public onMouseUp(event: MouseEvent) {
        //console.log("onMouseUp");
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event: Event) {
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        //console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.render();
    }

    @HostListener('document:keypress', ['$event'])
    public onKeyPress(event: KeyboardEvent) {
        //console.log("onKeyPress: " + event.key);
    }

    public createBoxGeometry(){
        let boxGeometrys = new CreateGeometrys(100);
        //this.cube = boxGeometrys.setBoxs();
        this.cube = boxGeometrys.setSphere();
        this.cube.forEach((cube) => {
            this.scene.add(cube);
        });
        this.camera.position.z = 10;
    }

    public animationBoxGeometry(){
        let cubes = [];
        this.cube.forEach((cube) => {
            let clock = new THREE.Clock();
            let time = clock.getElapsedTime() * 3;
            let delta = clock.getDelta();

            cube.rotation.x += 0.1;
            cube.rotation.y += 0.1;
            
            //cube.rotation.x += 30 * delta;
            //cube.rotation.y += 30 * delta;
            //cube.position.x = Math.cos(time) * 2;
            //cube.position.y = Math.sin(time) * 2;
        });
        
        // this.camera.position.x -= 0.05;
        // this.camera.position.y -= 0.05;
        // this.camera.position.z -= 0.05;

        
    }

    public setGui(){
        this.gui = new dat.GUI();
        let options = {
            reset : () => {
                console.log('reset click');
                this.camera.position.x = 10;
                this.camera.position.y = 10;
                this.camera.position.z = 10;
                //this.cube.position.x = 0;
                //this.cube.position.y = 0;
                //this.cube.position.z = 0;
            }   
        };
        let cam = this.gui.addFolder('Camera');
        //let boxCube = this.gui.addFolder('Cube');
        // boxCube.add(this.cube.position, 'x', -200, 200, 1).listen();
        // boxCube.add(this.cube.position, 'y', -200, 200, 1).listen();
        // boxCube.add(this.cube.position, 'z', -200, 200, 1).listen();
        // boxCube.open();
        cam.add(this.camera.position, 'x', -200, 200, 1).listen();
        cam.add(this.camera.position, 'y', -200, 200, 1).listen();
        cam.add(this.camera.position, 'z', -200, 200, 1).listen();
        cam.add(this.camera, 'fov', 1, 150).listen();
        
        cam.open();

        this.gui.add(options, 'reset');
    }    
}


class CreateGeometrys{
    public camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;
    public mesh: THREE.Mesh;
    public geometry = new THREE.BoxGeometry(1, 1, 1);
    public sphere = new THREE.SphereGeometry(1, 30, 30);
    public meterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

    constructor(private boxIndex: number){
        //this.setBoxs();
    }

    public setBoxs(){
        let cubes = [];
        for(let i = 0; i < this.boxIndex; i++){
            this.meterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });    
            this.mesh = new THREE.Mesh(this.geometry, this.meterial);
            this.mesh.position.x = Math.random() * 50 - i;
            this.mesh.position.y = Math.random() * 50 - i;
            this.mesh.position.z = Math.random() * 50 - i;
            this.mesh.scale.x = Math.random() + 0.5;
            this.mesh.scale.y = Math.random() + 0.5;
            this.mesh.scale.z = Math.random() + 0.5;
            cubes.push(this.mesh);
        }
        return cubes;
    }

    public setSphere(){
        let spheres = [];
        for(let i = 0; i < this.boxIndex; i++){
            this.meterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });    
            this.mesh = new THREE.Mesh(this.sphere, this.meterial);
            this.mesh.position.x = Math.random() * 50 - i;
            this.mesh.position.y = Math.random() * 50 - i;
            this.mesh.position.z = Math.random() * 50 - i;
            this.mesh.radius = Math.random() + 10;
            
            //this.cube.scale.x = Math.random() + 0.5;
            //this.cube.scale.y = Math.random() + 0.5;
            //this.cube.scale.z = Math.random() + 0.5;
            spheres.push(this.mesh);
        }
        return spheres;
    }
    
}

