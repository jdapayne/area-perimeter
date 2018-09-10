import QuestionView from "QuestionView/QuestionView";
import Point from "Utilities/Point";
import {parallelSign, arrowLine, drawRightAngle} from "Utilities/point-drawing";

export default class ParallelogramView extends QuestionView {
  constructor (question, width, height, rotation) {
    super(question, width, height, rotation);
    rotation = Math.PI;

    this.A = new Point(0,0);
    /* Derivation of this.B, this.C
     *  B is intersection of
     *          x^2 + y^2 = s^2 (1)
     *    and   y = h           (2)
     *
     *    Substituting (2) into (1) and rearranging gives:
     *          x = sqrt(s^2-h^2) (taking only the +ve value)
     *
     *  C is just this shifted across b
     */
    this.B = new Point(
      Math.sqrt(this.question.s.val*this.question.s.val -
        this.question.h.val*this.question.h.val), this.question.h.val);
    this.C = this.B.clone().translate(this.question.b.val,0);
    this.D = new Point(this.question.b.val,0);

    this.ht1 = this.C.clone();
    this.ht2 = this.C.clone().translate(0,-this.question.h.val);

    // rotate
    this.rotation = (rotation !== undefined) ?
      this.rotate(rotation) : this.randomRotate();

    // Scale and centre
    this.scaleToFit(width,height,100);
    if (question.h.show) this.translate(20,0);

    // shift height away a bit
    this.ht1.moveToward(this.B,-10);
    this.ht2.moveToward(this.A,-10);

    // labels
    this.labels = [];

    const sides = [ //[1st point, 2nd point, length]
      [this.A,this.B,question.s],
      [this.D,this.A,question.b],
      [this.ht1,this.ht2,question.h]
    ];

    if (question.show_opposites) {
      sides.push([this.B,this.C,question.b]);
      sides.push([this.C,this.D,question.s]);
    }

    for (let i = 0, n=sides.length; i < n; i++) { //sides
      if (!sides[i][2].show) continue;
      const offset = 25;
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
    return [this.A,this.B,this.C,this.D,this.ht1,this.ht2];
  }

  drawIn(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear
    ctx.setLineDash([]);

    // draw parallelogram
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

    // parallel signs
    ctx.beginPath();
    parallelSign(ctx,this.A,this.B,5);
    parallelSign(ctx,this.D,this.C,5);
    parallelSign(ctx,this.B,this.C,5,2);
    parallelSign(ctx,this.A,this.D,5,2);
    ctx.stroke();
    ctx.closePath();

    // draw height
    if (this.question.h.show) {
      ctx.beginPath();
      arrowLine(ctx, Point.mean([this.ht1,this.ht2]),this.ht1, 8);
      arrowLine(ctx, Point.mean([this.ht1,this.ht2]),this.ht2, 8);
      ctx.stroke();
      ctx.closePath();

      // dashed line to height
      ctx.beginPath();
      ctx.setLineDash([5,3]);
      ctx.moveTo(this.D.x,this.D.y);
      ctx.lineTo(this.ht2.x,this.ht2.y);
      ctx.stroke();
      ctx.closePath();

      // RA symbol
      ctx.beginPath();
      ctx.setLineDash([]);
      drawRightAngle(ctx,this.ht1,this.ht2,this.D, 12);
      ctx.stroke();
      ctx.closePath();
    }

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
