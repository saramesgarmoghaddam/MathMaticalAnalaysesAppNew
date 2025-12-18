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
