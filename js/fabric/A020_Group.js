class Group extends fabric.Group {
    constructor(x, y, callback) {
        super([], {
            left: x,
            top: y,
            angle: 0,
            selectable: false
        });
        this.onclick = callback;
    }
    add(obj) {
        super.add(obj);
        if (this.width < obj.width) this.width = obj.width;
        if (this.height < obj.height) this.height = obj.height;
    }
    addText(s) {
        this.text = new fabric.Text(s, {
            fontSize: 10,
            originX: 'center',
            originY: 'center',
            borderColor: '#000',
            hasBorders: true,
            selectable: false
        });
        this.add(this.text);
    }
}
module.export = Group;
