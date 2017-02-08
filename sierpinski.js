window.onload = function() {
  let canvas = document.querySelector('#triangle'),
      bgColourBtn = document.querySelector('#bgColour'),
      triangle = new Sierpinski(canvas, 1, bgColourBtn.value),
      facAmount = document.querySelector('#recAmount')
      coloursBtn = document.querySelector('#coloursCkbx');

  facAmount.addEventListener('change', () => triangle.refactor(facAmount.value));

  canvas.addEventListener('click', () => {
    triangle.refactor(triangle.n+1);
    facAmount.value = triangle.n;
  });

  canvas.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    triangle.refactor(triangle.n-1);
    facAmount.value = triangle.n;
    return false;
  });

  coloursBtn.addEventListener('change', () => triangle.toggleColours(coloursBtn));

  bgColourBtn.addEventListener('change', () => {
    triangle.bgColour = bgColourBtn.value;
    triangle.refactor(triangle.n);
  });
}

class Sierpinski {

  constructor(canvas, n, bgColour) {

    // Calculates the canvas' size depending on the screen size. 
    let h = document.documentElement.clientHeight,
        w = document.documentElement.clientWidth,
        smallest = h < w ? h : w;
    this.h = 0.8 * smallest;
    this.w = 2 * Math.sqrt(3) / 3 * this.h;  // Good ol' trigonometry
    
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.n = n;
    this.maxN = 10; // Limits number of recursions
    this.bgColour = bgColour;
    this.mainTriangle();
    this.sierpinskiEffect(this.p1, this.p2, this.p3, n);
  }

  drawTriangle(p1, p2, p3) {
    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.lineTo(p3.x, p3.y);
    this.context.lineTo(p1.x, p1.y);
    this.context.fill();
  }
  /*Draws main triangle*/
  mainTriangle() {
    this.p1 = new Point(0, this.h);
    this.p2 = new Point(this.w, this.h);
    this.p3 = new Point(this.w/2, 0);
    this.context.fillStyle =  this.bgColour;
    this.drawTriangle(this.p1, this.p2, this.p3);
  }

  sierpinskiEffect(p1, p2, p3, n) {
    this.context.fillStyle = this.colours ? getRandomColor() : '#fff';
    if ( n > 0 ) {
      // Calculates midpoints in order to generate white (?) triangles.
      let mP1 = Point.mid(p1, p2),
          mP2 = Point.mid(p1, p3),
          mP3 = Point.mid(p2, p3);
      this.drawTriangle(mP1, mP2, mP3);
        if ( n > 1) {
          this.sierpinskiEffect(mP1, p2, mP3, n-1);
          this.sierpinskiEffect(p1, mP1, mP2, n-1);
          this.sierpinskiEffect(mP2, mP3, p3, n-1);
        }
    }
  }

  /*Re-draws the triangle whenever it is needed.*/
  refactor(n) {
    if (n-1 >= this.maxN || n+1 === 0) {
      return;
    }
    this.n = n;
    this.mainTriangle();
    this.sierpinskiEffect(this.p1, this.p2, this.p3, n);
  }

  toggleColours(btn) {
    this.colours = btn.checked;
    this.refactor(this.n);
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static mid(p1, p2) {
    let x = (p1.x + p2.x) / 2,
        y = (p1.y + p2.y) / 2;
    return new Point( x, y);
  }
}
/*http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript*/
function getRandomColor() {
    let letters = '0123456789ABCDEF',
        color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}