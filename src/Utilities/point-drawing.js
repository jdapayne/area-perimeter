import Point from "Utilities/Point";

/* Canvas drawing, using the Point class */
export function dashedLine(ctx,x1,y1,x2,y2) {
  // Work if given two points instead:
  if (x1 instanceof Point && x2 instanceof Point) {
    const p1 = x1, p2 = x2;
    x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
  }

  const length = Math.hypot(x2-x1,y2-y1);
  const dashx = (y1-y2)/length; // unit vector perpendicular to line
  const dashy = (x2-x1)/length;
  const midx = (x1+x2)/2;
  const midy = (y1+y2)/2;

  // draw the base line
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);

  // draw the dash
  ctx.moveTo(midx+5*dashx,midy+5*dashy);
  ctx.lineTo(midx-5*dashx,midy-5*dashy);

  ctx.moveTo(x2,y2);
}

export function arrowLine(ctx,pt1,pt2,size,m) {
  if (!m) m=0.5;

  let unit = Point.unitVector(pt1,pt2);
  unit.x *= size;
  unit.y *= size;
  let normal = {x: -unit.y, y: unit.x};
  normal.x *= m;
  normal.y *= m;

  const control1 = pt2.clone()
    .translate(-unit.x,-unit.y)
    .translate(normal.x,normal.y);

  const control2 = pt2.clone()
    .translate(-unit.x,-unit.y)
    .translate(-normal.x,-normal.y);

  ctx.moveTo(pt1.x,pt1.y);
  ctx.lineTo(pt2.x,pt2.y);
  ctx.lineTo(control1.x,control1.y);
  ctx.moveTo(pt2.x,pt2.y);
  ctx.lineTo(control2.x,control2.y);
}

export function drawRightAngle (ctx, A, O, C, size) {
  const unitOA = Point.unitVector(O,A);
  const unitOC = Point.unitVector(O,C);
  const ctl1 = O.clone().translate(unitOA.x*size,unitOA.y*size);
  const ctl2 = ctl1.clone().translate(unitOC.x*size,unitOC.y*size);
  const ctl3 = O.clone().translate(unitOC.x*size,unitOC.y*size);
  ctx.moveTo(ctl1.x,ctl1.y);
  ctx.lineTo(ctl2.x,ctl2.y);
  ctx.lineTo(ctl3.x,ctl3.y);
}


