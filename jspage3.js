let index = 0;
const track = document.getElementById("track");
const total = 4;

function draw3DAxes(p, len = 300) {
  p.push();
  p.strokeWeight(2);

  // X axis
  p.stroke(255, 80, 80);
  p.line(-len, 0, 0, len, 0, 0);

  // Y axis
  p.stroke(80, 255, 140);
  p.line(0, -len, 0, 0, len, 0);

  // Z axis
  p.stroke(80, 150, 255);
  p.line(0, 0, -len, 0, 0, len);

  p.pop();
}

document.getElementById("next").onclick = () => {
  index = (index + 1) % total;
  update();
};
document.getElementById("prev").onclick = () => {
  index = (index - 1 + total) % total;
  update();
};

function update() {
  track.style.transform = `translateX(${-index * 860}px)`;
}

/* ---------- R ---------- */
new p5(p => {
  let selectedPoint=null, label="";

  p.setup = () => p.createCanvas(820, 480).parent("r1");

  p.draw = () => {
    p.background(10);
    p.translate(p.width/2,p.height/2);
    p.stroke(140); p.line(-300,0,300,0);
    p.stroke(0,255,213); p.strokeWeight(4);
    p.line(-180,0,180,0);

    if(selectedPoint){
      p.fill(255,60,60); p.noStroke();
      p.circle(selectedPoint.x,selectedPoint.y,9);
      p.fill(255,210,80); p.textSize(14);
      p.text(label, selectedPoint.x, selectedPoint.y-16);
    }
  };

  p.mousePressed=()=>{
    const x=p.mouseX-p.width/2, y=p.mouseY-p.height/2;
    selectedPoint={x,y};
    if(Math.abs(x+180)<6||Math.abs(x-180)<6) label="نقطه مرزی";
    else if(x>-180&&x<180) label="نقطه درونی";
    else label="نقطه بیرونی";
  };
});

/* ---------- R² ---------- */
new p5(p => {
  const poly=[{x:-160,y:50},{x:-120,y:-80},{x:20,y:-120},{x:170,y:-20},{x:90,y:140},{x:-60,y:120}];
  let selectedPoint=null,label="";

  p.setup=()=>p.createCanvas(820,480).parent("r2");

  p.draw=()=>{
    p.background(10);
    p.translate(p.width/2,p.height/2);
    p.stroke(140); p.line(-300,0,300,0); p.line(0,-200,0,200);
    p.fill(0,255,213,120); p.stroke(0,255,213); p.strokeWeight(2);
    p.beginShape(); poly.forEach(v=>p.vertex(v.x,v.y)); p.endShape(p.CLOSE);

    if(selectedPoint){
      p.fill(255,60,60); p.noStroke();
      p.circle(selectedPoint.x,selectedPoint.y,9);
      p.fill(255,210,80); p.textSize(14);
      p.text(label,selectedPoint.x,selectedPoint.y-16);
    }
  };

  p.mousePressed=()=>{
    const x=p.mouseX-p.width/2,y=p.mouseY-p.height/2;
    selectedPoint={x,y};
    label=pointInPolygon({x,y})?"نقطه درونی":"نقطه بیرونی";
  };

  function pointInPolygon(pt){
    let inside=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      let xi=poly[i].x,yi=poly[i].y,xj=poly[j].x,yj=poly[j].y;
      let intersect=((yi>pt.y)!==(yj>pt.y))&&(pt.x<(xj-xi)*(pt.y-yi)/(yj-yi+0.00001)+xi);
      if(intersect) inside=!inside;
    }
    return inside;
  }
});

/* ---------- R³ Sphere ---------- */
new p5(p=>{
  let selectedPoint=null, label="";

  p.setup=()=>p.createCanvas(820,480,p.WEBGL).parent("r3");

  p.draw=()=>{
    p.background(10); 
    p.orbitControl(); 
    p.ambientLight(120);

    // محورها
    draw3DAxes(p,260);

    // کره
    p.noStroke(); 
    p.ambientMaterial(0,255,213); 
    p.sphere(120);

    // نقطه و برچسب روی صفحه (۲بعدی)
    if(selectedPoint){
      p.resetMatrix();
      p.fill(255,60,60); p.noStroke();
      p.circle(selectedPoint.x+p.width/2, selectedPoint.y+p.height/2, 9);

      p.fill(255,210,80); p.textSize(14);
      p.text(label, selectedPoint.x+p.width/2, selectedPoint.y+p.height/2-18);
    }
  };

p.mousePressed = () => {
  selectedPoint = { x: p.mouseX, y: p.mouseY };

  const dx = p.mouseX - p.width/2;
  const dy = p.mouseY - p.height/2;
  const d = Math.sqrt(dx*dx + dy*dy);
  if (Math.abs(d-120)<6) label="نقطه مرزی";
  else if (d<120) label="نقطه درونی";
  else label="نقطه بیرونی";
};

});


/* ---------- R³ Pyramid with Hole ---------- */
new p5(p=>{
  let selectedPoint=null, label="";

  p.setup=()=>p.createCanvas(820,480,p.WEBGL).parent("r4");

  p.draw=()=>{
    p.background(10); 
    p.orbitControl(); 
    p.ambientLight(120);

    // محورها
    draw3DAxes(p,260);

    // کره‌ی حفره
    p.push();
    p.translate(0,40,0);
    p.fill(10); p.noStroke();
    p.sphere(100);
    p.pop();

    // هرم نیمه‌شفاف
    p.fill(0,255,213,150); 
    p.stroke(0,255,213);
    p.beginShape(p.TRIANGLES);
    p.vertex(0,-120,0); p.vertex(-120,100,-60); p.vertex(120,100,-60);
    p.vertex(0,-120,0); p.vertex(120,100,-60); p.vertex(0,100,120);
    p.vertex(0,-120,0); p.vertex(0,100,120); p.vertex(-120,100,-60);
    p.vertex(-120,100,-60); p.vertex(120,100,-60); p.vertex(0,100,120);
    p.endShape();

    // نقطه و برچسب روی صفحه (۲بعدی)
    if(selectedPoint){
      p.resetMatrix();
      p.fill(255,60,60); p.noStroke();
      p.circle(selectedPoint.x+p.width/2, selectedPoint.y+p.height/2, 9);

      p.fill(255,210,80); p.textSize(14);
      p.text(label, selectedPoint.x+p.width/2, selectedPoint.y+p.height/2-18);
    }
  };

  p.mousePressed=()=>{
    const x=p.mouseX-p.width/2, y=p.mouseY-p.height/2;
    selectedPoint={x,y};
    const d=Math.sqrt(x*x+y*y);
    if(Math.abs(d-100)<6) label="نقطه مرزی (حفره)";
    else if(d<100) label="نقطه بیرونی (داخل حفره)";
    else label="نقطه درونی";
  };
});


