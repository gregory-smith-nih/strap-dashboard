class BoxText extends Group {
  constructor(x, y, w, h, s, callback) {
    super(x, y, callback);
    this.box = new fabric.Rect({
      width: w,
      height: h,
      fill: '#eef',
      originX: 'center',
      originY: 'center',
      selectable: false
    });
    this.add(this.box);
    this.addText(s);
  }
}
module.export = BoxText;
