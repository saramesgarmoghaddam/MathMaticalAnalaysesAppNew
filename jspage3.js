let currentSpace = 1;
const totalSpaces = 4;
let p5Instance = null;
let epsilon = 30;

const R = 160;       
const delta3D = 4;   


let depth = R;       


let ray = null;


const depthSlider = document.getElementById("depth");     
const depthValue = document.getElementById("depthValue");   
const depthCard  = document.getElementById("depthCard");    
const epsilonSlider = document.getElementById("epsilon");
const epsValue = document.getElementById("epsValue");
const badge = document.getElementById("point-type");
const detail = document.getElementById("result-detail");
const spaceInfo = document.getElementById("spaceInfo");

const spaceTitles = [
    "",
    "ℝ — بازه باز روی محور اعداد حقیقی",
    "ℝ² — شکل نامتقارن در صفحه",
    "ℝ³ — کره در فضای سه‌بعدی",
    " Aمجموعه گسسته — مجموعه گسسته  "
];

function removeCanvas() {
    if (p5Instance) {
        p5Instance.remove();
        p5Instance = null;
    }
}

function createSketch(space) {
    removeCanvas();
    spaceInfo.innerText = spaceTitles[space];
    badge.className = "badge neutral";
    badge.textContent = "هنوز نقطه‌ای انتخاب نشده";
    detail.textContent = "روی شکل کلیک کنید تا نقطه تحلیل شود";
    if (depthCard) {
    depthCard.style.display = (space === 3) ? "block" : "none";
}
    if (space === 1 || space === 2 || space === 4) {

    p5Instance = new p5((p) => {
        let selected = null; 

        p.setup = () => {
            let c = p.createCanvas(820, 540);
            c.parent('canvas-holder');
        };

        p.draw = () => {
            p.background(11, 19, 36);
            p.translate(p.width / 2, p.height / 2);

            if (space === 1) {
               
                p.stroke(200);
                p.strokeWeight(2);
                p.line(-400, 0, 400, 0);
                p.stroke(255);
                p.strokeWeight(4);
                p.line(-180, -30, -180, 30);
                p.line(180, -30, 180, 30);
                p.fill(255);
                p.noStroke();
                p.textSize(32);
                p.text("0", -180, 60);
                p.text("1", 180, 60);
                p.stroke(0, 255, 213);
                p.strokeWeight(12);
                p.line(-170, 0, 170, 0);
                p.noFill();
                p.stroke(255, 60, 60);
                p.strokeWeight(4);
                p.circle(-180, 0, 20);
                p.circle(180, 0, 20);
                p.fill(0, 255, 213);
                p.noStroke();
                p.textSize(40);
                p.text("(0,1)", 0, -80);
            }
            else if (space === 2) {
           
                p.stroke(200);
                p.strokeWeight(2);
                p.line(-400, 0, 400, 0);
                p.line(0, -300, 0, 300);
                p.fill(0, 255, 213, 150);
                p.stroke(0, 255, 213);
                p.strokeWeight(4);
                p.beginShape();
                p.vertex(-160, 50);
                p.vertex(-120, -80);
                p.vertex(20, -120);
                p.vertex(170, -20);
                p.vertex(90, 140);
                p.vertex(-60, 120);
                p.endShape(p.CLOSE);
            }
            else if (space === 4) {
          
                p.stroke(200);
                p.strokeWeight(2);
                p.line(-400, 0, 400, 0);
                p.line(0, -300, 0, 300);

             
                const discreteSet = [];
                for (let gx = -7; gx <= 7; gx++) {
                    for (let gy = -7; gy <= 7; gy++) {
                        if (Math.sqrt(gx*gx + gy*gy) <= 4.7) {
                            discreteSet.push({ x: gx * 50, y: gy * 50 });
                        }
                    }
                }

           
                p.fill(120, 120, 140);
                p.noStroke();
                for (let gx = -8; gx <= 8; gx++) {
                    for (let gy = -6; gy <= 6; gy++) {
                        let px = gx * 50;
                        let py = gy * 50;
                        if (Math.abs(px) <= 400 && Math.abs(py) <= 300) {
                            p.circle(px, py, 10);
                        }
                    }
                }

                p.fill(0, 255, 213, 70);
                p.noStroke();
                for (let pt of discreteSet) {
                    p.circle(pt.x, pt.y, 30);
                }

            
                p.fill(255, 220, 100);
                p.textSize(24);
                p.textAlign(p.CENTER, p.CENTER);
                p.text( 0, -250);

            
                if (selected) {
                    p.fill(255, 60, 60);
                    p.noStroke();
                    p.circle(selected.x, selected.y, 32);

                    p.noFill();
                    p.stroke(255, 255, 255, 120);
                    p.strokeWeight(2);
                    p.circle(selected.x, selected.y, epsilon * 2);

                    const isInSet = discreteSet.some(pt =>
                        Math.abs(pt.x - selected.x) < 5 && Math.abs(pt.y - selected.y) < 5
                    );

                    if (isInSet) {
                        badge.textContent ="نقطه درونی ";
                        badge.className = "badge interior";
                        detail.textContent = "در فضای گسسته، اگر نقطه متعلق به مجموعه باشد، درونی است.";
                    } else {
                        badge.textContent = "نقطه بیرونی ";
                        badge.className = "badge exterior";
                        detail.textContent = " .مفهوم مرز پیوسته وجود ندارد چون نقاط به هم متصل نیستند و چون به مجموعه متعلق نیست، بیرونی است";
                    }
                }
            }

            if (selected && (space === 1 || space === 2)) {
                p.fill(255, 60, 60);
                p.noStroke();
                p.circle(selected.x, selected.y, 14);
                p.noFill();
                p.stroke(255, 255, 255, 120);
                p.strokeWeight(2);
                p.circle(selected.x, selected.y, epsilon * 2);
                p.fill(255, 210, 80);
                p.textSize(20);
                p.text(badge.textContent, selected.x, selected.y - 40);
            }
        };

        p.mousePressed = () => {
            let mx = p.mouseX - p.width / 2;
            let my = p.mouseY - p.height / 2;

            if (space === 1) {
                if (Math.abs(my) > 15) {
                    badge.textContent = "⚠️ فقط روی محور کلیک کنید!";
                    badge.className = "badge neutral";
                    detail.textContent = "در فضای ۱ بعدی، نقاط فقط روی محور معنی دارند.";
                    selected = null;
                    return;
                }
                selected = { x: mx, y: 0 };
                let dist = Math.abs(mx);
                if (dist < 170) {
                    badge.textContent = "نقطه درونی";
                    badge.className = "badge interior";
                    detail.textContent = "هر همسایگی کوچک اطراف این نقطه کاملاً داخل بازه (0,1) است.";
                } else if (dist < 190) {
                    badge.textContent = "نقطه مرزی";
                    badge.className = "badge boundary";
                    detail.textContent = "هر همسایگی از این نقطه هم داخل و هم خارج بازه را شامل می‌شود.";
                } else {
                    badge.textContent = "نقطه بیرونی";
                    badge.className = "badge exterior";
                    detail.textContent = "یک همسایگی کوچک اطراف این نقطه کاملاً خارج از بازه است.";
                }
            }
            else if (space === 2) {
          
                const polyVertices = [
                    {x:-160, y:50},
                    {x:-120, y:-80},
                    {x:20, y:-120},
                    {x:170, y:-20},
                    {x:90, y:140},
                    {x:-60, y:120}
                ];

                if (Math.abs(mx) > 400 || Math.abs(my) > 300) {
                    selected = null;
                    badge.textContent = "هنوز نقطه‌ای انتخاب نشده";
                    badge.className = "badge neutral";
                    detail.textContent = "روی شکل کلیک کنید تا نقطه تحلیل شود";
                    return;
                }

                selected = { x: mx, y: my };

                function pointInPolygon(point, vs) {
                    let x = point.x, y = point.y;
                    let inside = false;
                    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                        let xi = vs[i].x, yi = vs[i].y;
                        let xj = vs[j].x, yj = vs[j].y;
                        let intersect = ((yi > y) != (yj > y))
                            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                        if (intersect) inside = !inside;
                    }
                    return inside;
                }

                function pointNearEdge(point, vs, margin) {
                    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                        let xi = vs[i].x, yi = vs[i].y;
                        let xj = vs[j].x, yj = vs[j].y;
                        let dx = xj - xi;
                        let dy = yj - yi;
                        let t = ((point.x - xi) * dx + (point.y - yi) * dy) / (dx*dx + dy*dy);
                        t = Math.max(0, Math.min(1, t));
                        let closest = {x: xi + t*dx, y: yi + t*dy};
                        let dist = Math.hypot(point.x - closest.x, point.y - closest.y);
                        if (dist <= margin) return true;
                    }
                    return false;
                }

                const inside = pointInPolygon(selected, polyVertices);
                const nearEdge = pointNearEdge(selected, polyVertices, 8);

                if (inside && nearEdge) {
                    badge.textContent = "نقطه مرزی";
                    badge.className = "badge boundary";
                    detail.textContent = "هر همسایگی کوچک اطراف این نقطه هم داخل و هم خارج شکل را شامل می‌شود.";
                } else if (inside) {
                    badge.textContent = "نقطه درونی";
                    badge.className = "badge interior";
                    detail.textContent = "هر همسایگی کوچک اطراف این نقطه کاملاً داخل شکل است.";
                } else if (!inside && nearEdge) {
                    badge.textContent = "نقطه مرزی";
                    badge.className = "badge boundary";
                    detail.textContent = "هر همسایگی اطراف این نقطه هم داخل هم خارج شکل را قطع می‌کند.";
                } else {
                    badge.textContent = "نقطه بیرونی";
                    badge.className = "badge exterior";
                    detail.textContent = "یک همسایگی کوچک اطراف این نقطه کاملاً خارج از شکل است.";
                }
            }
            else if (space === 4) {
                
                const gridX = Math.round(mx / 50) * 50;
                const gridY = Math.round(my / 50) * 50;

                if (Math.hypot(mx - gridX, my - gridY) > 40) {
                    badge.textContent = "⚠️ نزدیک یک نقطه کلیک کنید!";
                    badge.className = "badge neutral";
                    detail.textContent = "در فضای گسسته فقط نقاط شبکه وجود دارند. نزدیک دایره‌ها کلیک کنید.";
                    selected = null;
                    return;
                }

                selected = { x: gridX, y: gridY };
            }
        };
    });
}
else if (space === 3) {
    
    if (depthCard) depthCard.style.display = "block";

    if (!depthCard.querySelector('.point-selector')) {
        const pointSelectorHTML = `
            <div class="point-selector">
                <p class="hint">نقطه فعال را انتخاب کنید:</p>
                <div class="point-buttons">
                    <button class="point-btn active" data-index="0">۱</button>
                    <button class="point-btn" data-index="1">۲</button>
                    <button class="point-btn" data-index="2">۳</button>
                </div>
            </div>
        `;
        depthCard.insertAdjacentHTML('beforeend', pointSelectorHTML);
    }

    let pointDepths = [160, 160, 160]; 

    p5Instance = new p5((p) => {
        let activePointIndex = 0;

        const dirs = [
            p.createVector(1, 0, 0),//x
            p.createVector(0, 1, 0),//y
            p.createVector(0, 0, 1)//z
        ];

        p.setup = () => {
            let c = p.createCanvas(820, 540, p.WEBGL);
            c.parent('canvas-holder');
        };

        p.draw = () => {
            p.background(11, 19, 36);
            p.orbitControl();

            p.ambientLight(140);
            p.directionalLight(255, 255, 255, 0.4, 1, -0.5);

            p.stroke(200);
            p.strokeWeight(2);
            p.line(-300, 0, 0, 300, 0, 0);
            p.line(0, -300, 0, 0, 300, 0);
            p.line(0, 0, -300, 0, 0, 300);

           
            p.noStroke();
            p.fill(0, 255, 213, 70);
            p.sphere(R - delta3D);

            
            p.noFill();
            p.stroke(255, 200, 0);
            p.strokeWeight(2);
            p.sphere(R);

           
            dirs.forEach((dir, i) => {
               
                let currentDepth = pointDepths[i];
                let point = dir.copy().mult(currentDepth);

        
                p.push();
                p.translate(point.x, point.y, point.z);
                p.noStroke();
                p.fill(255, 60, 60);
                p.emissiveMaterial(255, 60, 60);
                p.sphere(12);
                p.pop();

                p.push();
                p.translate(point.x, point.y, point.z);
                p.fill(255);
                p.noStroke();
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(24);
                p.text(String(i + 1), 0, -30, 0);
                p.pop();

                if (i === activePointIndex) {
                    p.push();
                    p.translate(point.x, point.y, point.z);
                    p.noFill();
                    p.stroke(255, 255, 255, 160);
                    p.strokeWeight(2);
                    p.sphere(epsilon);
                    p.pop();
                }
            });

            let activeDepth = pointDepths[activePointIndex];
            if (activeDepth < R - delta3D) {
                badge.textContent = `نقطه درونی (نقطه ${activePointIndex + 1})`;
                badge.className = "badge interior";
                detail.textContent = "هر همسایگی کوچک اطراف این نقطه کاملاً داخل کره است.";
            } else if (Math.abs(activeDepth - R) <= delta3D) {
                badge.textContent = `نقطه مرزی (نقطه ${activePointIndex + 1})`;
                badge.className = "badge boundary";
                detail.textContent = "هر همسایگی از این نقطه هم داخل و هم خارج کره را شامل می‌شود.";
            } else {
                badge.textContent = `نقطه بیرونی (نقطه ${activePointIndex + 1})`;
                badge.className = "badge exterior";
                detail.textContent = "یک همسایگی کوچک اطراف این نقطه کاملاً خارج از کره است.";
            }
        };

   
        p.setActivePoint = function(index) {
            activePointIndex = index;

            depthSlider.value = pointDepths[index];
            depthValue.textContent = pointDepths[index];
        };

        p.setDepth = function(newDepth) {
            pointDepths[activePointIndex] = newDepth;
        };
    });

  
    depthSlider.value = 160;
    depthValue.textContent = 160;

  
    depthSlider.addEventListener("input", () => {
        let newDepth = Number(depthSlider.value);
        depthValue.textContent = newDepth;
        if (p5Instance) {
            p5Instance.setDepth(newDepth);
        }
    });

  
    document.querySelectorAll('.point-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.point-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const index = Number(btn.dataset.index);
            if (p5Instance) {
                p5Instance.setActivePoint(index);
            }
        });
    });
}
}


epsilonSlider.addEventListener("input", () => {
    epsilon = Number(epsilonSlider.value);
    epsValue.textContent = epsilon;
});

if (depthSlider) {
    depthSlider.addEventListener("input", () => {
        depth = Number(depthSlider.value);
        depthValue.textContent = depth;
    });
}


document.getElementById("prevBtn").addEventListener("click", () => {
    currentSpace = currentSpace === 1 ? totalSpaces : currentSpace - 1;
    createSketch(currentSpace);
});

document.getElementById("nextBtn").addEventListener("click", () => {
    currentSpace = currentSpace === totalSpaces ? 1 : currentSpace + 1;
    createSketch(currentSpace);
});



createSketch(currentSpace);