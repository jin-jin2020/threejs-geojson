import * as THREE from 'three'
import * as d3 from 'd3-geo'
const OrbitControls = require('three-orbit-controls')(THREE)
export default class ThreeMap {
    constructor(data) {
        this.camera;
        this.geojson = data;
        this.scene;
        this.renderer;
        this.mesh;
        this.init();

    }
    initRender() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 2000);
        //camera.position.z = 20;
        this.camera.up.x = 0;
        this.camera.up.y = 0;
        this.camera.up.z = 1;
        this.camera.position.set(100, 100, 100)
        this.camera.lookAt(0, 0, 0)
    }
    initScene() {
        this.scene = new THREE.Scene();
    }
    initObj() {
        let geometry = new THREE.BoxGeometry(50, 50, 50);
        let material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh)
    }
    render() {
        this.animate()
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        //this.mesh.rotation.x = this.mesh.rotation.x + 0.01;
        //this.mesh.rotation.y+=0.02;
        //console.log(this.mesh.rotation.x)
        this.renderer.render(this.scene, this.camera)
    }
    initHelper() {
        //X轴红色，Y轴绿色，Z轴蓝色。
        const axeshelper = new THREE.AxesHelper(25)
        this.scene.add(axeshelper)
    }
    //经纬度转三维坐标
    lnglatToVector(lnglat) {
        if (!this.projection) {
            this.projection = d3.geoMercator()
                .center([105.628052, 34.721229])
                .scale(400)
                .translate([0, 0])
        }
        const [y, x] = this.projection([...lnglat]);
        let z = 0;
        return [x, y, z]
    }
    //绘制网格
    getMesh(points) {
        const shape = new THREE.Shape();
        points.forEach((p, i) => {
            const [x, y] = p;
            if (i === 0) {
                shape.moveTo(x, y);
            } else if (i === points.length - 1) {
                shape.quadraticCurveTo(x, y, x, y);
            } else {
                shape.lineTo(x, y, x, y)
            }
        })
        const geometry = new THREE.ExtrudeGeometry(
            shape, {
            depth: 2,
            bevelEnabled: false
        }
        );
        let color = new THREE.Color(0xffffff);
        color.setHex(Math.random() * 0xffffff);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6
        })

        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    drawGeometry() {

        //console.log(feature);
        this.vectorjson = [];
        this.geojson.features.forEach(feature => {
            const areas = feature.geometry.coordinates;
            areas.forEach((polygon, index) => {
                const areaData = {
                    coordinates: []
                }
                polygon.forEach((points, i) => {
                    if (points[0] instanceof Array) {
                        areaData.coordinates[i] = [];
                        points.forEach((point, index) => {
                            areaData.coordinates[i].push(this.lnglatToVector(point))
                        })
                    }
                    this.vectorjson.push(areaData);
                })
            });
        })
        //console.log(this.vectorjson)
        //绘制模块
        const group = new THREE.Group();
        this.vectorjson.forEach(vector => {
            //console.log(vector.coordinates)
            vector.coordinates.forEach(coordinates => {
                const mesh = this.getMesh(coordinates)
                group.add(mesh);
            })
        })
        this.group=group;
        this.scene.add(group);
    }
    //三方库交互
    setControl() {
        this.controls = new OrbitControls(this.camera);
        this.controls.update();
    }
    mouseEvent(event) {
        if(!this.raycaster){
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
        }
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse,this.camera);
       /*  this.group.children.forEach(mesh=>{
             //mesh.material.color.set(0x005cf3)
        }) */
        const intersects=this.raycaster.intersectObjects(this.group.children);
        for(let i=0;i<intersects.length;i++){
            if(!this.temp){
                this.temp=intersects[i];
                this.oldcolor=this.temp.object.material.color.clone();
                intersects[i].object.material.color.set(0xff0000);
            }
            if(this.temp.object.uuid!=intersects[i].object.uuid){
                this.temp.object.material.color=this.oldcolor;
                this.temp=intersects[i];
                this.oldcolor=this.temp.object.material.color.clone();
                intersects[i].object.material.color.set(0xff0000);
            }
            
        }
    }
    initListen(){
        document.body.addEventListener("mousemove",this.mouseEvent.bind(this))
    }
    init() {
        this.initRender();
        this.initCamera();
        this.initScene();
        // this.initObj();
        this.initHelper();
        this.setControl();
        this.drawGeometry();
        this.render();
        this.initListen();
    }
}