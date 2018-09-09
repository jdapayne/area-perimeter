import QuestionView from "QuestionView/QuestionView";
import Point from "Utilities/Point";
import {arrowLine, drawRightAngle} from "Utilities/point-drawing";

export default class RectangleView extends QuestionView {
  constructor (question, width, height, rotation) {
    super(question, width, height, rotation);

    this.A = new Point(0,0);
    this.B = new Point(0,question.h.val);
    this.C = new Point(question.b.val,question.h.val);
    this.D = new Point(question.b.val,0);

    // rotate
    this.rotation = (rotation !== undefined) ?
      this.rotate(rotation) : this.randomRotate();

    // Scale and centre
    this.scaleToFit(width,height,80);

    // labels
    this.labels = [];

    const sides = [ //[1st point, 2nd point, length]
      [this.A,this.B,question.h],
      [this.B,this.C,question.b],
    ];

    if (question.show_opposites) {
      sides.push([this.C,this.D,question.h]);
      sides.push([this.D,this.A,question.b]);
    }

    for (let i = 0, n=sides.length; i < n; i++) { //sides
      if (!sides[i][2].show) continue;
      const offset = 20;
      let pos = Point.mean([sides[i][0],sides[i][1]]);
      const unitvec = Point.unitVector(sides[i][0], sides[i][1]);
      
      pos.translate(-unitvec.y*offset, unitvec.x*offset); 

      const texta = sides[i][2].val.toString() + "cm";
      const textq = sides[i][2].missing? "?" : texta;
      const styleq = "normal";
      const stylea = sides[i][2].missing? "answer" : "normal";

      this.labels.push({
        pos: pos,
        texta: texta,
        textq: textq,
        stylea: stylea,
        styleq: styleq
      });
    }

    let n_info = 0;
    if (question.area.show) {
      const texta = question.area.val.toString() + "cm²";
      const textq = question.area.missing? "?" : texta;
      const styleq = "extra-info";
      const stylea = question.area.missing? "extra-answer" : "extra-info";
      this.labels.push(
        {
          texta: "Area = " + texta,
          textq: "Area = " + textq,
          styleq: styleq,
          stylea: stylea,
          pos: new Point(10, height - 10 - 15*n_info),
        }
      );
      n_info++;
    }

    if (question.perimeter.show) {
      const texta = question.perimeter.val.toString() + "cm";
      const textq = question.perimeter.missing? "?" : texta;
      const styleq = "extra-info";
      const stylea = question.perimeter.missing? "extra-answer" : "extra-info";
      this.labels.push(
        {
          pos: new Point(10, height - 10 - 20*n_info),
          texta: "Perimeter = " + texta,
          textq: "Perimeter = " + textq,
          styleq: styleq,
          stylea: stylea
        }
      );
    }

    this.labels.forEach( l => {
      l.text = l.textq;
      l.style = l.styleq;
    });

  }

  get allpoints () {
    return [this.A,this.B,this.C,this.D];
  }

  drawIn(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear
    ctx.setLineDash([]);

    // draw rectangle
    ctx.beginPath();
    ctx.moveTo(this.A.x,this.A.y);
    ctx.lineTo(this.B.x,this.B.y);
    ctx.lineTo(this.C.x,this.C.y);
    ctx.lineTo(this.D.x,this.D.y);
    ctx.lineTo(this.A.x,this.A.y);
    ctx.stroke();
    ctx.fillStyle="LightGrey";
    ctx.fill();
    ctx.closePath();

    // right angles
    const size = Math.min(
      15,
      Math.min(Point.distance(this.A,this.B),Point.distance(this.B,this.C))/3
    );
    ctx.beginPath();
    drawRightAngle(ctx,this.A,this.B,this.C, size);
    drawRightAngle(ctx,this.B,this.C,this.D, size);
    drawRightAngle(ctx,this.C,this.D,this.A, size);
    drawRightAngle(ctx,this.D,this.A,this.B, size);
    ctx.stroke();
    ctx.closePath();

    //labels
    this.labels.forEach(function(l){
      if (!l.hidden) {
        ctx.font = QuestionView.styles.get(l.style).font;
        ctx.fillStyle = QuestionView.styles.get(l.style).colour;
        ctx.textAlign = QuestionView.styles.get(l.style).align;
        ctx.textBaseline = QuestionView.styles.get(l.style).baseline;
        ctx.fillText(l.text,l.pos.x,l.pos.y);
      }
    });
  }
}
