import ThreeMapLightBar from './threeMapLightBar'
// const map=new ThreeMap()
import $ from 'jquery'
// import axios from 'axios'
// axios.get('./mapdate/gd.json').then(data=>{
//     console.log(data)
// })
const lightBarData = [
    { name: "海南省", value: 60 },
    { name: "广东省", value: 100 },
    { name: "四川省", value: 70 },
    { name: "山东省", value: 66 }
]
const flyDatas = [
    { source: { name: '海南省' }, target: { name: "四川省" } },
    { source: { name: "山东省" }, target: { name: "四川省" } },
    { source: { name: "西藏自治区" }, target: { name: "四川省" } },
    { source: { name: "新疆维吾尔自治区" }, target: { name: "四川省" } }
]
$.get("./mapdate/china.json", data => {
    // console.log(data)

    const map = new ThreeMapLightBar(data, lightBarData);
    map.drawLightBar(data);
    map.drawFlyLine(flyDatas);
})