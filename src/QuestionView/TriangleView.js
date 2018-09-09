import QuestionView from "QuestionView/QuestionView";
import Point from "Utilities/Point";
import {arrowLine, drawRightAngle} from "Utilities/point-drawing";

export default class TriangleView extends QuestionView {
  constructor (triangle, width, height, rotation) {
    super(triangle, width, height, rotation);
    //console.log("******************************")

    this.question = triangle;
    const b  = triangle.b.val,
      s1 = triangle.s1.val,
      s2 = triangle.s2.val,
      h  = triangle.h.val;

    // AB = base, BC, AC = sides 
    this.A = new Point(0, h);
    this.B = new Point(b, h);
    this.C = new Point( (b*b + s1*s1 - s2*s2)/(2*b) , 0 );
    this.ht = new Point(this.C.x, this.A.y); //intersection of height with base

    this.overhangright=false, this.overhangleft=false;
    if (this.C.x > this.B.x) {this.overhangright = true;}
    if (this.C.x < this.A.x) {this.overhangleft = true;}

    // rotate
    this.rotation = (rotation !== undefined) ?
      this.rotate(rotation) : this.randomRotate();

    // Scale and centre
    this.scaleToFit(width,height,80);

    // labels
    this.labels = [];

    const sides = [ //[1st point, 2nd point, length]
      [this.A,this.B,triangle.b],
      [this.C,this.A,triangle.s1],
      [this.B,this.C,triangle.s2],
    ];

    // order of putting in height matters for offset
    if (this.ht.equals(this.B)) {
      sides.push([this.ht,this.C,triangle.h]);
    } else {
      sides.push([this.C,this.ht,triangle.h]);
    }

    for (let i = 0; i < 4; i++) { //sides
      if (!sides[i][2].show) continue;
      const offset = 20;
      let pos = Point.mean([sides[i][0],sides[i][1]]);
      const unitvec = Point.unitVector(sides[i][0], sides[i][1]);
      
      if ( i < 3 || triangle.isRightAngled() )
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

    //area and perimeter
    let n_info = 0;
    if (triangle.area.show) {
      const texta = triangle.area.val.toString() + "cm²";
      const textq = triangle.area.missing? "?" : texta;
      const styleq = "extra-info";
      const stylea = triangle.area.missing? "extra-answer" : "extra-info";
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
    if (triangle.perimeter.show) {
      const texta = triangle.perimeter.val.toString() + "cm";
      const textq = triangle.perimeter.missing? "?" : texta;
      const styleq = "extra-info";
      const stylea = triangle.perimeter.missing? "extra-answer" : "extra-info";
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

    // make the labels all set to question
    this.labels.forEach( l => {
      l.text = l.textq;
      l.style = l.styleq;
    });
    
    // stop them from clashing - hmm, not sure
    this.success=true;
    for (let i = 0, n=this.labels.length; i < n; i++) {
      for (let j = 0; j < i; j++) {
        const l1=this.labels[i], l2=this.labels[j];
        const d = Point.distance(l1.pos,l2.pos);
        //console.log(`d('${l1.text}','${l2.text}') = ${d}`);
        if (d < 20) {
          //console.log("too close");
          this.success=false;
        }
      }
    }

  }

  get allpoints () {
    // does not include labels - these will be positioned after rotating and scaling
    return [this.A,this.B,this.C,this.ht];
  }

  drawIn(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height); // clear
    ctx.setLineDash([]);
    // draw triangle
    ctx.beginPath();
    ctx.moveTo(this.A.x,this.A.y);
    ctx.lineTo(this.B.x,this.B.y);
    ctx.lineTo(this.C.x,this.C.y);
    ctx.lineTo(this.A.x,this.A.y);
    ctx.stroke();
    ctx.fillStyle="LightGrey";
    ctx.fill();
    ctx.closePath();

    // draw height
    if (!this.question.isRightAngled() && this.question.h.show) {
      ctx.beginPath();
      //arrowLine(ctx,this.C,this.ht,10);
      arrowLine(ctx,
        Point.mean([this.C,this.ht]).moveToward(this.C,15),
        this.C, 10
      );
      arrowLine(ctx,
        Point.mean([this.C,this.ht]).moveToward(this.ht,15),
        this.ht, 10
      );
      ctx.stroke();
      ctx.closePath();
    }

    // right-angle symbol
    if (this.question.isRightAngled() || this.question.h.show) {
      ctx.beginPath();
      if (this.A.equals(this.ht)) {
        drawRightAngle(ctx, this.B, this.ht, this.C, 15);
      } else {
        drawRightAngle(ctx, this.A, this.ht, this.C, 15);
      }
      ctx.stroke();
      ctx.closePath();
    }

    if (this.question.h.show && this.overhangright) {
      ctx.beginPath();
      ctx.setLineDash([5,3]);
      ctx.moveTo(this.B.x,this.B.y);
      ctx.lineTo(this.ht.x,this.ht.y);
      ctx.stroke();
      ctx.closePath();
    }
    if (this.question.h.show && this.overhangleft) {
      ctx.beginPath();
      ctx.setLineDash([5,3]);
      ctx.moveTo(this.A.x,this.A.y);
      ctx.lineTo(this.ht.x,this.ht.y);
      ctx.stroke();
      ctx.closePath();
    }

    //labels
    ctx.beginPath();
    this.labels.forEach(function(l){
      if (!l.hidden) {
        ctx.font = QuestionView.styles.get(l.style).font;
        ctx.fillStyle = QuestionView.styles.get(l.style).colour;
        ctx.textAlign = QuestionView.styles.get(l.style).align;
        ctx.textBaseline = QuestionView.styles.get(l.style).baseline;
        ctx.fillText(l.text,l.pos.x,l.pos.y);
      }
    });
    ctx.closePath();

  }
}
