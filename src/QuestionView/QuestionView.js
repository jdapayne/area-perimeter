import Point from "Utilities/Point";

export default class QuestionView {
  constructor(question,width,height,rotation) {
    this.question = question;
    this.answered = false;
    this.rotation = rotation;
    this.success = true;
  }

  /* * * Abstract methods   * * */
  /**/                        /**/
  /**/  get allpoints () {    /**/
  /**/      return [];        /**/
  /**/  }                     /**/
  /**/                        /**/
  /*    drawIn(canvas) {}       */
  /**/                        /**/
  /* * * * * * * * * * * * * *  */
  showAnswer() {
    if (this.answered) return; //nothing to do
    this.labels.forEach( l => {
      l.text = l.texta;
      l.style = l.stylea;
    });
    return this.answered = true;
  }

  hideAnswer() {
    if (!this.answered) return; //nothing to do
    this.labels.forEach( l => {
      l.text = l.textq;
      l.style = l.styleq;
    });
    return this.answered = false;
  }

  toggleAnswer() {
    if (this.answered) return this.hideAnswer();
    else return this.showAnswer();
  }

  scale(sf) {
    this.allpoints.forEach(function(p){
      p.scale(sf);
    });
  }

  rotate(angle) {
    this.allpoints.forEach(function(p){
      p.rotate(angle);
    });
    return angle;
  }

  translate(x,y) {
    this.allpoints.forEach(function(p){
      p.translate(x,y);
    });
  }

  randomRotate() {
    var angle=2*Math.PI*Math.random();
    this.rotate(angle);
    return angle;
  }

  scaleToFit(width,height,margin) {
    let topleft = Point.min(this.allpoints);
    let bottomright = Point.max(this.allpoints);
    let t_width = bottomright.x - topleft.x;
    let t_height = bottomright.y - topleft.y;
    this.scale(Math.min((width-margin)/t_width,(height-margin)/t_height));

    // centre
    topleft = Point.min(this.allpoints);
    bottomright = Point.max(this.allpoints);
    const center = Point.mean([topleft,bottomright]);
    this.translate(width/2-center.x,height/2-center.y); //centre
  }
}

QuestionView.styles = new Map([
  ["normal" , {font: "16px Arial", colour: "Black", align: "center", baseline: "middle"}],
  ["answer" , {font: "16px Arial", colour: "Red", align: "center", baseline: "middle"}],
  ["extra-answer", {font: "16px Arial", colour: "Red", align: "left", baseline: "bottom"}],
  ["extra-info", {font: "16px Arial", colour: "Black", align: "left", baseline: "bottom"}]
]);
