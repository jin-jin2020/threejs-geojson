import ThreeMap from "./indexmap";
import * as THREE from 'three'
import { css } from "jquery";
export default class ThreeMapLightBar extends ThreeMap {
    constructor(set, geojson) {
        super(set);
        this.geojson = geojson;
        this.flydata = [];
    }
    drawLightBar(data) {
        const group = new THREE.Group();
        data.features.forEach(feature => {
            const name = feature.properties.name;
            const center = feature.properties.center;
            console.log(name)
            if (center) {
                const [x, y, z] = this.lnglatToVector(feature.properties.center)
                let geometry = new THREE.PlaneGeometry(1, 20);
                let material = new THREE.MeshBasicMaterial({
                    color: "#ffff00",
                    side: THREE.DoubleSide
                })
                this.flydata[name] = [x, y, z];
                let plane = new THREE.Mesh(geometry, material);
                plane.position.set(x, y, 12)
                //plane.rotateX(Math.PI/2)
                //plane.rotateY(Math.PI/2)
                //plane.rotateZ(Math.PI/2)//现在是第二次的时候坐标都与想象的不一样，那么就说明我们理解错了，还得看看api的含义
                //暂时放一放 应该是坐标系变了，不然不应该啊
                plane.rotation.x = Math.PI / 2;//局部坐标 第一步如果理解对的话，为何第二步不对呢
                //plane.rotation.y=Math.PI/2;//和想象的不一样，可能坐标系理解错了，后面再看吧，暂时放一放 不应该是z吗肯定哪里想错了，等着查看api吧
                group.add(plane);
                const plane2 = plane.clone();
                plane2.rotation.y = Math.PI / 2;//旋转这里有点蒙，还得看看资料 怎么个旋转法，死活没有想明白，肯定哪里没有选择对
                //先往下走，然后返回来在理解吧，赶赶进度 毕竟对api不熟悉，可能看完api就理解了 之前理解做了，坐标轴没有变，因为第二次的时候，坐标系依然是第一次的，所以应该绕
                //y轴，自己旋转一下就知道了。之前理解错了。
                plane2.material.color.set("#ffff00")
                group.add(plane2);
                group.add(this.addButtomPlate([x, y, z]));

            }
        })
        this.scene.add(group);
    }
    addButtomPlate(point) {//后面优化效果
        let geometry = new THREE.CircleGeometry(1, 6);
        let material = new THREE.MeshBasicMaterial({
            color: "#ffffff"
        })
        let circle = new THREE.Mesh(geometry, material);
        const [x, y, z] = point;
        circle.position.set(x, y, 2.5)
        return circle
    }
    drawFlyLine(datas) {
        const group = new THREE.Group();
        datas.forEach(data => {
            //console.log(data)
            const { source, target } = data;
            const [x0, y0, z0] = this.flydata[source.name];
            const [x1, y1, z1] = this.flydata[target.name];
            // console.log(x1,x0)
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(x0, y0, z0),
                new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, 50),
                new THREE.Vector3(x1, y1, z1)
            )
            const points = curve.getPoints(60);
            // let geo = new THREE.Geometry();
            // geo.vertices = points;
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const material = new THREE.LineBasicMaterial({
                color: "#ff0000"
            })
            const line = new THREE.Line(geometry, material);
            group.add(line);
        })
        this.scene.add(group)

    }
}