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
let active = null;

const faMap = {
  inside: "داخلی",
  boundary: "مرزی",
  outside: "بیرونی"
};


function openExercise(el){
  if(active) return;
  active = el;
  el.classList.add('expanded');
  document.body.style.overflow = 'hidden';
  document.getElementById('overlay').classList.add('active');
}

function closeExercise(e){
  e.stopPropagation();
  active.classList.remove('expanded');
  document.body.style.overflow = '';
  document.getElementById('overlay').classList.remove('active');
  active = null;
}

function toggleAnswer(e,btn){
  e.stopPropagation();
  const a = btn.nextElementSibling;
  a.style.display = a.style.display === 'block' ? 'none' : 'block';
}

(() => {

  const R = 120;
  const EPS = 6;
  const CENTER = { x: 300, y: 180 };

  const basePoints = [
    { id: 1, x: 40, y: 30, color:"#ff6666", type:null, hidden:false },
    { id: 2, x: -90, y: 10, color:"#66ff66", type:null, hidden:false },
    { id: 3, x: 120, y: 0, color:"#6666ff", type:null, hidden:false },
    { id: 4, x: -120, y: 0, color:"#ffff66", type:null, hidden:false },
    { id: 5, x: 60, y: -40, color:"#ff66ff", type:null, hidden:false },
    { id: 6, x: -60, y: 80, color:"#66ffff", type:null, hidden:false },
    { id: 7, x: 0, y: 0, color:"#ffa366", type:null, hidden:false },
    { id: 8, x: 0, y: -80, color:"#a366ff", type:null, hidden:false },
  ];

  const mainCanvas = document.getElementById("setCanvas");
  const ctx = mainCanvas.getContext("2d");

  let points = JSON.parse(JSON.stringify(basePoints));
  let selectedBoxType = null;

  const toCanvas = (pt) => ({ cx: CENTER.x + pt.x, cy: CENTER.y - pt.y });

  const trueClass = (pt) => {
    const d = Math.hypot(pt.x, pt.y);
    if(Math.abs(d - R) <= EPS) return "boundary";
    if(d < R - EPS) return "inside";
    return "outside";
  };

  /* ===== انتخاب باکس ===== */
  document.querySelectorAll(".box").forEach(box=>{
    box.addEventListener("click",e=>{
      e.stopPropagation();
      document.querySelectorAll(".box").forEach(b=>b.classList.remove("selected"));
      box.classList.add("selected");
      selectedBoxType = box.dataset.type;
    });
  });

  function drawAxesAndCircle(){
    ctx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

    ctx.strokeStyle = "rgba(180,220,255,0.6)";
    ctx.beginPath();
    ctx.moveTo(0, CENTER.y);
    ctx.lineTo(mainCanvas.width, CENTER.y);
    ctx.moveTo(CENTER.x, 0);
    ctx.lineTo(CENTER.x, mainCanvas.height);
    ctx.stroke();

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, R, 0, Math.PI*2);
    ctx.stroke();
  }

  function drawPoints(){
    points.forEach(p=>{
      if(p.hidden) return;

      const {cx,cy} = toCanvas(p);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI*2);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.fillText(`#${p.id}`, cx+10, cy-10);
    });
  }

  function drawMain(){
    drawAxesAndCircle();
    drawPoints();
  }

  function hitTest(mx,my){
    for(let i = points.length-1; i >= 0; i--){
      if(points[i].hidden) continue;

      const {cx,cy} = toCanvas(points[i]);
      if(Math.hypot(mx-cx, my-cy) <= 8) return i;
    }
    return null;
  }

  /* ===== کلیک روی نقطه ===== */
  mainCanvas.addEventListener("click",e=>{
    if(!selectedBoxType) return;

    const rect = mainCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const idx = hitTest(mx,my);
    if(idx !== null){
      points[idx].type = selectedBoxType;
      points[idx].hidden = true;
      drawMain();
    }
  });
window.finishExercise = function(e){
  e.stopPropagation();

  const ans = document.getElementById("exercise1-answer");

  // اگر پاسخ باز است → فقط ببند و تمام
  if(ans.style.display === "block"){
    ans.style.display = "none";
    return;
  }

  // محاسبه و نمایش پاسخ تمرین 1
  let correct = 0, wrong = 0;
  let report = "این نقاط در فضای متریک دوبعدی هستند (x,y). دسته‌بندی فاصله از مرکز:<br>";

  points.forEach(p=>{
    const truth = trueClass(p);
    const userFa = p.type ? faMap[p.type] : "هیچ";
    const truthFa = faMap[truth];

    if(p.type === truth){
      correct++;
      report += `✔ نقطه ${p.id} درست (${truthFa})<br>`;
    }else{
      wrong++;
      report += `✘ نقطه ${p.id} اشتباه: انتخاب شما: ${userFa}، پاسخ صحیح: ${truthFa}<br>`;
    }
  });

  report += `<hr>درست: ${correct} | غلط: ${wrong}`;
  ans.innerHTML = report;

  // حالا پاسخ تمرین 1 را نمایش بده
  ans.style.display = "block";

  // سپس همه پاسخ‌های دیگر (تمرین 2 تا 6) را ببند
  document.querySelectorAll(".answer").forEach(a=>{
    if(a !== ans){
      a.style.display = "none";
    }
  });
};




window.resetExercise = function(e){
  e.stopPropagation();

  // بازگرداندن نقاط به حالت اولیه
  points = JSON.parse(JSON.stringify(basePoints));

  // پاک کردن انتخاب باکس
  selectedBoxType = null;
  document.querySelectorAll(".box").forEach(b=>{
    b.classList.remove("selected");
  });

  // پاک کردن نتیجه
  const ans = document.getElementById("exercise1-answer");
  ans.innerHTML = "";
  ans.style.display = "none";

  drawMain();
};

  drawMain();
})();
function toggleAnswer(e, btn) {
  e.stopPropagation();

  const currentAnswer = btn.nextElementSibling;

  // باز یا بسته کردن پاسخ تمرین جاری
  currentAnswer.style.display = currentAnswer.style.display === 'block' ? 'none' : 'block';

  // بستن همه پاسخ‌های دیگر شامل تمرین 1
  document.querySelectorAll(".answer").forEach(ans=>{
    if(ans !== currentAnswer){
      ans.style.display = "none";
    }
  });
}

