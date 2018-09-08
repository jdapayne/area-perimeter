import {randElem} from "Utilities/Utilities"
import triangle_data from "./triangle_data.json"

export default class Triangle {
  /* Polymorphic constructor:
   * Triangle({b:Number,s1:Number,s2:Number,h:Number},options)
   *   Returns triangle with given sides
   * Triangle(maxside:Number,options)
   *   Returns random triangle with side lengths up to that side
   */

  constructor (x,type,options) {
    let sides;
    if ( x.b && x.s1 && x.s2 ) sides = x;
    else {
      const max_side = Number.isInteger(x) ? x : 500;
      sides = randElem(triangle_data.filter(t => 
        Math.max(t.b,t.s1,t.s2) <= max_side
      ));
    }

    this.b = {val: sides.b, show: true, missing: false}
    this.h = {val: sides.h, show: true, missing: false}
    this.s1 = {val: sides.s1, show: sides.s1 !== sides.h, missing: false}
    this.s2 = {val: sides.s2, show: sides.s2 !== sides.h, missing: false}
    this.area = {
      val: this.b.val*this.h.val/2,
      show: false,
      missing: true
    };
    this.perimeter = {
      val: this.b.val+this.s1.val+this.s2.val,
      show: false,
      missing: true
    }

    //selectively hide/missing depending on type
    switch(type) {
      case 'area':
        this.area.show=true;
        this.area.missing=true;
        break;
      case "perimeter":
        this.perimeter.show=true;
        this.perimeter.missing=true;
        break;
      case "rev-area":
        this.area.show=true;
        this.area.missing=false;
        if (Math.random()<0.5) this.h.missing=true;
        else this.b.missing=true;
        break;
      case "rev-perimeter":
        this.perimeter.show=true;
        this.perimeter.missing=false;
        randElem([this.b,this.s1,this.s2]).missing=true;
        break;
      default:
    }

  }

  get maxSide () {
    return Math.max(this.b,this.s1,this.s2);
  }

  isRightAngled () {
    return (this.h.val === this.s1.val || this.h.val === this.s2.val)
  }

}
