class Utility{
    static resetCanvas(canvas){
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Utility.drawCanvasBorder(ctx); // Dessiner la bordure du canvas
    }

    static drawCanvasBorder(ctx) {
        ctx.save();
        ctx.strokeStyle = 'black';
        let temp = ctx.lineWidth;
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, this.w, this.h);
        ctx.lineWidth = temp;
        ctx.restore();
    }
 
    static handleKeyDown(event, inputStates) {
        let key = event.code;
        inputStates[key] = true;
    }

    static handleKeyUp(event, inputStates) {
        let key = event.code;
        inputStates[key] = false;
    }

}