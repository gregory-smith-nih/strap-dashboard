class CircleText extends Group {
  constructor(x, y, r, s, callback) {
    super(x, y, callback);
    this.circle = new fabric.Circle({
      radius: r,
      fill: '#eef',
      originX: 'center',
      originY: 'center',
      selectable: false
    });
    this.add(this.circle);
    this.addText(s);
  }
}
module.export = CircleText;
