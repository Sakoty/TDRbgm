const map = document.getElementById("map");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let areas = [];
let route = [];
let drawingMode = null;
let currentArea = [];

// マップ読み込み
document.getElementById("mapLoader").addEventListener("change", e=>{
  map.src = URL.createObjectURL(e.target.files[0]);
});

// モード切替
document.getElementById("areaBtn").onclick = ()=>{
  drawingMode = "area";
  currentArea = [];
};

document.getElementById("routeBtn").onclick = ()=>{
  drawingMode = "route";
  route = [];
};

// マウス操作
canvas.addEventListener("mousedown", e=>{
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if(drawingMode === "area"){
    currentArea.push({x,y});
  }

  if(drawingMode === "route"){
    route.push({x,y});
  }

  draw();
});

// 描画
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // エリア
  areas.forEach(a=>{
    ctx.beginPath();
    ctx.moveTo(a[0].x,a[0].y);
    a.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.closePath();
    ctx.strokeStyle="yellow";
    ctx.stroke();
  });

  // 作成中
  if(currentArea.length){
    ctx.beginPath();
    ctx.moveTo(currentArea[0].x,currentArea[0].y);
    currentArea.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.strokeStyle="red";
    ctx.stroke();
  }

  // ルート
  if(route.length){
    ctx.beginPath();
    ctx.moveTo(route[0].x,route[0].y);
    route.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.strokeStyle="cyan";
    ctx.stroke();
  }
}

// 保存（ローカルJSON）
document.getElementById("saveBtn").onclick = ()=>{
  const data = {areas, route};

  const blob = new Blob([JSON.stringify(data)], {type:"application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "mapData.json";
  a.click();
};
