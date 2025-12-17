let particles = [];
let points = []; // نقاط گردان کوچک

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('canvasBg');
    canvas.position(0, 0);
    canvas.style('z-index', '-2');
    canvas.style('display', 'block');

    // نور محیطی و جهت‌دار برای درخشش بهتر
    ambientLight(80);
    directionalLight(200, 200, 200, 0, 0, -1);
    pointLight(255, 255, 255, 0, 0, 300); // نور نقطه‌ای برای درخشش

    // ۷ شکل اصلی
    for (let i = 0; i < 7; i++) {
        particles.push(new ShapeParticle());
    }

    // ۱۲ نقطه گردان کوچک
    for (let i = 0; i < 12; i++) {
        points.push(new PointParticle());
    }
}

function draw() {
    clear();

    for (let p of particles) {
        p.update();
        p.display();
    }

    for (let pt of points) {
        pt.update();
        pt.display();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// کلاس شکل‌های اصلی — درخشان با رنگ ثابت
class ShapeParticle {
    constructor() {
        this.reset();
        this.rotX = random(TWO_PI);
        this.rotY = random(TWO_PI);
        this.rotZ = random(TWO_PI);
        this.rotSpeedX = random(-0.01, 0.01);
        this.rotSpeedY = random(-0.015, 0.015);
        this.rotSpeedZ = random(-0.01, 0.01);
        this.fixedColor = this.chooseColor(); // رنگ ثابت
    }

    chooseColor() {
        let hue = random();
        if (hue < 0.6) return color(255, 255, 150); // زرد روشن
        else if (hue < 0.75) return color(72, 198, 255); // آبی
        else if (hue < 0.9) return color(255, 79, 216); // صورتی
        else return color(154, 107, 255); // بنفش
    }

    reset() {
        this.x = random(-width/2 - 100, width/2 + 100);
        this.y = random(-height/2 - 100, height/2 + 100);

        this.size = random(100, 200);
        this.speedX = random(-0.5, 0.5);
        this.speedY = random(-0.5, 0.5);
        this.type = floor(random(5));
        this.fixedColor = this.chooseColor(); // رنگ جدید فقط موقع ریست
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.rotX += this.rotSpeedX;
        this.rotY += this.rotSpeedY;
        this.rotZ += this.rotSpeedZ;

        // خروج و ورود از سمت مخالف
        if (abs(this.x) > width/2 + 200 || abs(this.y) > height/2 + 200) {
            if (this.x > width/2 + 100) this.x = -width/2 - 100;
            if (this.x < -width/2 - 100) this.x = width/2 + 100;
            if (this.y > height/2 + 100) this.y = -height/2 - 100;
            if (this.y < -height/2 - 100) this.y = height/2 + 100;
        }
    }

    display() {
        push();
        translate(this.x, this.y, 0);

        rotateX(this.rotX);
        rotateY(this.rotY);
        rotateZ(this.rotZ);

        // درخشش اضافه شد
        emissiveMaterial(red(this.fixedColor), green(this.fixedColor), blue(this.fixedColor));
        specularColor(red(this.fixedColor) * 1.5, green(this.fixedColor) * 1.5, blue(this.fixedColor) * 1.5);
        shininess(50); // شدت درخشش

        noFill();
        strokeWeight(random(2, 4));
        stroke(red(this.fixedColor), green(this.fixedColor), blue(this.fixedColor), 180);

        let s = this.size;

        if (this.type <= 2) {
            let detailX = this.type === 0 ? 32 : this.type === 1 ? 20 : 12;
            let detailY = this.type === 0 ? 24 : this.type === 1 ? 16 : 10;
            sphere(s / 2, detailX, detailY);
        } else if (this.type === 3) {
            let verts = [
                [0, 0, s/2], [0, 0, -s/2], [s/2, 0, 0], [-s/2, 0, 0], [0, s/2, 0], [0, -s/2, 0]
            ];
            let edges = [
                [0,2],[0,3],[0,4],[0,5],
                [1,2],[1,3],[1,4],[1,5],
                [2,4],[2,5],[3,4],[3,5]
            ];
            for (let e of edges) {
                beginShape();
                vertex(...verts[e[0]]);
                vertex(...verts[e[1]]);
                endShape();
            }
        } else {
            box(s * 0.8);
        }

        pop();
    }
}

// نقاط گردان کوچک — درخشان و چشمک‌دار
class PointParticle {
    constructor() {
        this.reset();
        this.blinkPhase = random(TWO_PI);
    }

    reset() {
        this.x = random(-width/2, width/2);
        this.y = random(-height/2, height/2);
        this.size = random(8, 20);
        this.speedX = random(-0.3, 0.3);
        this.speedY = random(-0.3, 0.3);
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.blinkPhase += 0.05;

        if (abs(this.x) > width/2 + 100) {
            this.x = this.x > 0 ? -width/2 - 50 : width/2 + 50;
        }
        if (abs(this.y) > height/2 + 100) {
            this.y = this.y > 0 ? -height/2 - 50 : height/2 + 50;
        }
    }

    display() {
        push();
        translate(this.x, this.y, 0);

        // درخشش قوی برای نقاط
        let alpha = 100 + 155 * abs(sin(this.blinkPhase));
        let baseCol = random() < 0.6 ? color(255, 255, 150) :
                      random() < 0.8 ? color(72, 198, 255) :
                      random() < 0.9 ? color(255, 79, 216) :
                                       color(154, 107, 255);

        emissiveMaterial(red(baseCol), green(baseCol), blue(baseCol));
        fill(red(baseCol), green(baseCol), blue(baseCol), alpha);
        noStroke();

        sphere(this.size / 2, 8, 6);

        pop();
    }
}