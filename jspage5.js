/* ===== p5 Wireframe / Network Shapes Fullscreen ===== */
new p5(p=>{
  let nodes = [];
  const NODE_COUNT = 22;

  p.setup = () => {
    const c = p.createCanvas(window.innerWidth, window.innerHeight);
    c.position(0, 0);       // قرار دادن canvas در موقعیت 0,0
    c.style('z-index', '-1'); // پشت سر همه عناصر
    c.style('position', 'fixed'); // ثابت در پس‌زمینه
    for(let i=0; i<NODE_COUNT; i++){
      nodes.push({
        x: p.random(p.width),
        y: p.random(p.height),
        dx: p.random(-0.4,0.4),
        dy: p.random(-0.3,0.3)
      });
    }
  };

  p.windowResized = () => p.resizeCanvas(window.innerWidth, window.innerHeight);

  p.draw = () => {
    p.clear();
    p.stroke(120,200,255,140);
    p.strokeWeight(2);
    

    // حرکت نودها
    nodes.forEach(n=>{
      n.x += n.dx; n.y += n.dy;
      if(n.x < 0 || n.x > p.width) n.dx *= -1;
      if(n.y < 0 || n.y > p.height) n.dy *= -1;
    });

    // رسم خطوط بین نودها
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const d = p.dist(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);
        if(d < 200){
          p.line(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);
        }
      }
    }

    // رسم نودها
    p.noFill();
    nodes.forEach(n=>{
      p.circle(n.x,n.y,4);
    });
  };
});
