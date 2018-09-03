export default class Point {
    constructor (x,y) {
        this.x = x;
        this.y = y;
    }

    rotate (angle) {
        var newx, newy;
        newx = Math.cos(angle)*this.x - Math.sin(angle)*this.y;
        newy = Math.sin(angle)*this.x + Math.cos(angle)*this.y;
        this.x = newx;
        this.y = newy
    }

    scale (sf) {
        this.x = this.x * sf;
        this.y = this.y * sf;
    }

    translate(x,y) {
        this.x += x;
        this.y += y
    }

    clone() {
        return new Point(this.x,this.y);
    }

    static fromPolar (r,theta) {
        return new Point(
            Math.cos(theta)*r,
            Math.sin(theta)*r
        )
    }

    static fromPolarDeg (r,theta) {
        theta = theta*Math.PI/180;
        return Point.fromPolar(r,theta)
    }

    static mean(points) {
        let sumx = points.map(p => p.x).reduce((x,y)=>x+y);
        let sumy = points.map(p => p.y).reduce((x,y)=>x+y);
        let n = points.length;

        return new Point(sumx/n,sumy/n);
    }

    static min(points) {
        let minx = points.reduce((x,p)=>Math.min(x,p.x),Infinity);
        let miny = points.reduce((y,p)=>Math.min(y,p.y),Infinity);
        return new Point(minx,miny)
    }
        
    static max(points) {
        let maxx = points.reduce((x,p)=>Math.max(x,p.x),-Infinity);
        let maxy = points.reduce((y,p)=>Math.max(y,p.y),-Infinity);
        return new Point(maxx,maxy)
    }

    static center(points) {
        const minx = points.reduce((x,p)=>Math.min(x,p.x),Infinity);
        const miny = points.reduce((y,p)=>Math.min(y,p.y),Infinity);
        const maxx = points.reduce((x,p)=>Math.max(x,p.x),-Infinity);
        const maxy = points.reduce((y,p)=>Math.max(y,p.y),-Infinity);
        return new Point( (maxx + minx)/2 , (maxy+miny)/2);
    }
}
