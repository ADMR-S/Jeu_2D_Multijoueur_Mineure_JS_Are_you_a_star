class Shape{
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
    }
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    changeColor(color){
        this.color = color;
    }
}
class Rectangle extends Shape{
    constructor(x, y, width, height, color){
        super(x, y, color);
        this.width = width;
        this.height = height;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();    
    }
    // Collisions between aligned rectangles
    rectsOverlap(o) {
    if ((this.x > (o.x + o.width)) || ((this.x + this.width) < o.x))
      return false; // No horizontal axis projection overlap
    if ((this.y > (o.y + o.height)) || ((this.y + this.height) < o.y))
      return false; // No vertical axis projection overlap
    return true;    // If previous tests failed, then both axis projections
                    // overlap and the rectangles intersect
    }
    rectOverlapsBorders(w, h) {
        if (this.x < 0 || (this.x + this.width) > w)
            return true;
        if (this.y < 0 || (this.y + this.height) > h)
            return true;
        return false;
    }
}
class Circle extends Shape{
    constructor(x, y, radius, color){
        super(x, y, color);
        this.radius = radius;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.restore();    
    }

    checkCollisionsWithWalls(w, h){
        if ((this.x + this.radius) > w) {
            return true;
        }
        else if((this.x-this.radius) < 0) {
            return true;    
        }
        if ((this.y + this.radius) > h) {
            return true;
        } else if ((this.y - this.radius) < 0) {
            return true;
        }
        return false;
    }
    circRectsOverlap(rectangle) {
        var testX=this.x;
        var testY=this.y;
        if (testX < rectangle.x) testX=rectangle.x;
        if (testX > (rectangle.x+rectangle.width)) testX=(rectangle.x+rectangle.width);
        if (testY < rectangle.y) testY=rectangle.y;
        if (testY > (rectangle.y+rectangle.height)) testY=(rectangle.y+rectangle.height);
        return (((this.x-testX)*(this.x-testX)+(this.y-testY)*(this.y-testY))< this.radius*this.radius);
    }
}