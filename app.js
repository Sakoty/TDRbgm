const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("audio");
const dot = document.getElementById("dot");

let areas = [];
let route = [];
let currentArea = [];

let mode = null;
let currentBGM = "";

// =====================
// モード切替
// =====================

areaBtn.onclick = ()=>{
  mode = "area";
  currentArea = [];
};

areaFinishBtn.onclick = ()=>{
  if(currentArea.length < 3) return;

  const file = bgmInput.files[0];
  if(!file) return;

  areas.push({
    polygon:[...currentArea],
    bgm:file.name
  });

  currentArea = [];
  draw();
};

routeBtn.onclick = ()=>{
  mode = "route";
  route = [];
};

// =====================
// マウス操作
// =====================

canvas.addEventListener("mousedown", e=>{
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if(mode === "area"){
    currentArea.push({x,y});
  }

  if(mode === "route"){
    route.push({x,y});
  }

  draw();
});

canvas.addEventListener("mousemove", e=>{
  if(mode !== "route") return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  route.push({x,y});
  draw();
});

// =====================
// 描画
// =====================

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // エリア
  areas.forEach(a=>{
    ctx.beginPath();
    ctx.moveTo(a.polygon[0].x, a.polygon[0].y);
    a.polygon.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.closePath();
    ctx.strokeStyle="yellow";
    ctx.stroke();
  });

  // 作成中
  if(currentArea.length){
    ctx.beginPath();
    ctx.moveTo(currentArea[0].x, currentArea[0].y);
    currentArea.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.strokeStyle="red";
    ctx.stroke();
  }

  // ルート
  if(route.length){
    ctx.beginPath();
    ctx.moveTo(route[0].x, route[0].y);
    route.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.strokeStyle="cyan";
    ctx.stroke();
  }
}

// =====================
// 多角形判定
// =====================

function isInside(point, polygon){
  let inside = false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const xi=polygon[i].x, yi=polygon[i].y;
    const xj=polygon[j].x, yj=polygon[j].y;

    const intersect =
      ((yi>point.y)!=(yj>point.y)) &&
      (point.x < (xj-xi)*(point.y-yi)/(yj-yi)+xi);

    if(intersect) inside=!inside;
  }
  return inside;
}

// =====================
// 再生
// =====================

playBtn.onclick = ()=>{
  let i=0;

  function move(){
    if(i>=route.length) return;

    const p = route[i];

    dot.style.left = p.x+"px";
    dot.style.top = p.y+"px";
    dot.style.display="block";

    for(let a of areas){
      if(isInside(p,a.polygon)){
        if(currentBGM !== a.bgm){
          audio.src = "audio/"+a.bgm;
          audio.play();
          currentBGM = a.bgm;
        }
      }
    }

    i++;
    setTimeout(move,50);
  }

  move();
};

// =====================
// Firebase
// =====================

saveBtn.onclick = async ()=>{
  await db.collection("maps").doc("fixedMap").set({
    areas, route
  });
  alert("保存完了");
};

loadBtn.onclick = async ()=>{
  const doc = await db.collection("maps").doc("fixedMap").get();
  if(doc.exists){
    const data = doc.data();
    areas = data.areas;
    route = data.route;
    draw();
  }
};

// =====================
// リセット
// =====================

resetBtn.onclick = ()=>{
  areas=[];
  route=[];
  currentArea=[];
  ctx.clearRect(0,0,canvas.width,canvas.height);
  audio.pause();
  dot.style.display="none";
};
