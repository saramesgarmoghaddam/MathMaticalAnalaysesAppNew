/* ===== p5 Wireframe / Network Shapes ===== */
new p5(p=>{
  let nodes=[];
  const NODE_COUNT = 22;

  p.setup=()=>{
    const c=p.createCanvas(window.innerWidth,220);
    c.parent('p5-header');
    for(let i=0;i<NODE_COUNT;i++){
      nodes.push({
        x:p.random(p.width),
        y:p.random(p.height),
        dx:p.random(-0.4,0.4),
        dy:p.random(-0.3,0.3)
      });
    }
  };

  p.windowResized=()=>p.resizeCanvas(window.innerWidth,220);

  p.draw=()=>{
    p.clear();
    p.stroke(120,200,255,140);
    p.strokeWeight(1);

    // move nodes
    nodes.forEach(n=>{
      n.x+=n.dx; n.y+=n.dy;
      if(n.x<0||n.x>p.width) n.dx*=-1;
      if(n.y<0||n.y>p.height) n.dy*=-1;
    });

    // draw connections
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const d=p.dist(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);
        if(d<90){
          p.line(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);
        }
      }
    }

    // draw nodes
    p.noFill();
    nodes.forEach(n=>{
      p.circle(n.x,n.y,4);
    });
  };
});

/* ===== Logic ===== */
let active=null;

function openExercise(el){
  if(active) return;
  active=el;
  el.classList.add('expanded');
  document.body.style.overflow='hidden';
  document.getElementById('overlay').classList.add('active');
}

function closeExercise(e){
  e.stopPropagation();
  active.classList.remove('expanded');
  document.body.style.overflow='';
  document.getElementById('overlay').classList.remove('active');
  active=null;
}

function toggleAnswer(e,btn){
  e.stopPropagation();
  const a=btn.nextElementSibling;
  a.style.display=a.style.display==='block'?'none':'block';
}

(() => {
  const R = 120;   // شعاع دایره
  const EPS = 6;   // تلرانس مرزی
  const CENTER = { x: 300, y: 180 };

  const basePoints = [
    { id: 1, x: 40, y: 30, color:"#ff6666", type:null },
    { id: 2, x: -90, y: 10, color:"#66ff66", type:null },
    { id: 3, x: 120, y: 0, color:"#6666ff", type:null },
    { id: 4, x: -120, y: 0, color:"#ffff66", type:null },
    { id: 5, x: 60, y: -40, color:"#ff66ff", type:null },
    { id: 6, x: -60, y: 80, color:"#66ffff", type:null },
    { id: 7, x: 0, y: 0, color:"#ffa366", type:null },
    { id: 8, x: 0, y: -80, color:"#a366ff", type:null },
  ];

  const mainCanvas = document.getElementById("setCanvas");
  const ctx = mainCanvas.getContext("2d");

  let points = JSON.parse(JSON.stringify(basePoints));
  let draggedIndex = null;

  const toCanvas = (pt) => ({ cx: CENTER.x + pt.x, cy: CENTER.y - pt.y });
  const trueClass = (pt) => {
    const d = Math.hypot(pt.x, pt.y);
    if(Math.abs(d-R)<=EPS) return "boundary";
    if(d<R-EPS) return "inside";
    return "outside";
  };

  function drawAxesAndCircle(){
    ctx.clearRect(0,0,mainCanvas.width,mainCanvas.height);
    ctx.strokeStyle="rgba(180,220,255,0.6)";
    ctx.beginPath();
    ctx.moveTo(0,CENTER.y); ctx.lineTo(mainCanvas.width,CENTER.y);
    ctx.moveTo(CENTER.x,0); ctx.lineTo(CENTER.x,mainCanvas.height);
    ctx.stroke();

    ctx.strokeStyle="#fff";
    ctx.beginPath();
    ctx.arc(CENTER.x,CENTER.y,R,0,Math.PI*2);
    ctx.stroke();
  }

  function drawPoints(){
    points.forEach(p=>{
      const {cx,cy}=toCanvas(p);
      ctx.fillStyle=p.color;
      ctx.beginPath();
      ctx.arc(cx,cy,7,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle="#fff";
      ctx.fillText(`#${p.id}`,cx+10,cy-10);
    });
  }

  function drawMain(){ drawAxesAndCircle(); drawPoints(); }

  function hitTest(mx,my){
    for(let i=points.length-1;i>=0;i--){
      const {cx,cy}=toCanvas(points[i]);
      if(Math.hypot(mx-cx,my-cy)<=8) return i;
    }
    return null;
  }

  function canvasToReal(mx,my){ return {x:mx-CENTER.x,y:CENTER.y-my}; }

  mainCanvas.addEventListener("mousedown",e=>{
    const rect=mainCanvas.getBoundingClientRect();
    const mx=e.clientX-rect.left, my=e.clientY-rect.top;
    draggedIndex=hitTest(mx,my);
  });

  mainCanvas.addEventListener("mousemove",e=>{
    if(draggedIndex!==null){
      const rect=mainCanvas.getBoundingClientRect();
      const mx=e.clientX-rect.left, my=e.clientY-rect.top;
      points[draggedIndex]={...points[draggedIndex],...canvasToReal(mx,my)};
      drawMain();
    }
  });

  mainCanvas.addEventListener("mouseup",e=>{
    if(draggedIndex!==null){
      const rect = document.querySelector(".boxes-panel").getBoundingClientRect();
      const mouseX = e.clientX, mouseY = e.clientY;
      const boxes = document.querySelectorAll(".box");
      boxes.forEach(box=>{
        const b = box.getBoundingClientRect();
        if(mouseX>=b.left && mouseX<=b.right && mouseY>=b.top && mouseY<=b.bottom){
          points[draggedIndex].type = box.dataset.type;
        }
      });
      draggedIndex = null;
      drawMain();
    }
  });

  window.finishExercise=function(e){
    e.stopPropagation();
    const ans=document.getElementById("exercise1-answer");
    let correct=0, wrong=0;
    let report="این نقاط در فضای متریک دوبعدی هستند (x,y). دسته‌بندی فاصله از مرکز:<br>";
    points.forEach(p=>{
      const truth=trueClass(p);
      if(p.type===truth){correct++; report+=`✔ نقطه ${p.id} درست (${truth})<br>`;}
      else{wrong++; report+=`✘ نقطه ${p.id} اشتباه: انتخاب ${p.type||"هیچ"}، واقعاً ${truth}<br>`;}
    });
    report+=`<hr>درست: ${correct} | غلط: ${wrong}`;
    ans.style.display="block";
    ans.innerHTML=report;
  };

  drawMain();
})();
