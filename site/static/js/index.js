let module = {}
let log = console.log

module.exports = {}
class Group extends fabric.Group {
  constructor (canvas, x, y, name) {
    super([], {
      left: x,
      top: y,
      angle: 0,
      selectable: false
    })
    this.name = name;
    this._canvas = canvas
    this.x = x
    this.y = y
  }
  setDirty(obj) {
    if (this.width < obj.width) this.width = obj.width
    if (this.height < obj.height) this.height = obj.height
    obj.setCoords()
    this.setCoords()
    obj.dirty = true
    this._canvas.renderAll()
  }
  add (obj) {
    super.add(obj)
    this.setDirty(obj)
  }
  addText (s) {
    let textAlign = 'center'
    let originX = 'center'
    this.text = new fabric.Text(s, {
      fontSize: 10,
      textAlign,
      originX,
      originY: 'center',
      borderColor: '#000',
      hasBorders: true,
      selectable: true
    })
    this.add(this.text)
  }
  updateText (s) {
    this.text.set('text', s)
    this.setCoords()
    this._canvas.renderAll()
  }
}
module.export = Group

class BoxText extends Group {
  constructor (canvas, x, y, name, w, h, dashed=false, color="#eef") {
    super(canvas, x, y, name)
    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    this.box = new fabric.Rect({
      width: w,
      height: h,
      fill: color,
      originX: 'center',
      originY: 'center',
      selectable: false,
      stroke: "#000",
      strokeWidth: 1,
      strokeDashArray: strokeDashArray,
    })
    this.add(this.box)
    this.addText(name)
  }
}
module.export = BoxText

class BoxText2 extends Group {
  constructor (canvas, x, y, name, w, h, max = 100, dashed=false, color="#eef", color2="#cec") {
    super(canvas, x, y, name)
    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    this.max = max
    this.value = 0
    this.bgbox = new fabric.Rect({
      width: w,
      height: h,
      fill: color,
      originX: 'center',
      originY: 'center',
      selectable: false,
      stroke: "#000",
      strokeWidth: 1,
      strokeDashArray: strokeDashArray,
    })
    this.fgbox = new fabric.Rect({
      width: w,
      height: 0,
      fill: color2,
      originX: 'center',
      originY: 'center',
      selectable: false,
    })
    this.add(this.bgbox)
    this.add(this.fgbox)
    this.addText(name)
  }
  percent (percent) {
    let h = this.bgbox.height * percent
    this.fgbox.set('height', h)
    this.fgbox.dirty = true
    this.setCoords()
    this._canvas.renderAll()
  }

  updateValue (value) {
    this.value = value
    this.percent(value / this.max)
  }
}
module.export = BoxText2

class CircleText extends Group {
  constructor (canvas, x, y, name, r, dashed=false, color="#eef") {
    super(canvas, x, y, name)
    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    this.circle = new fabric.Circle({
      width: r,
      height: r,
      radius: r,
      fill: color,
      originX: 'center',
      originY: 'center',
      selectable: false,
      stroke: "#000",
      strokeWidth: 1,
      strokeDashArray: strokeDashArray,
    })
    this.add(this.circle)
    this.addText(name)
  }
}
module.export = CircleText

class EllipseText extends Group {
  constructor (canvas, x, y, name, w, h, dashed=false, color="#eef") {
    super(canvas, x, y, name)
    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    this.ellipse = new fabric.Ellipse({
      rx: w/2,
      ry: h/2,
      width: w,
      height: h,
      fill: color,
      originX: 'center',
      originY: 'center',
      selectable: false,
      stroke: "#000",
      strokeWidth: 1,
      strokeDashArray: strokeDashArray,
    })
    this.add(this.ellipse)
    this.addText(name)
  }
}
module.export = EllipseText

class PolygonText extends Group {
  constructor (canvas, x, y, name, dashed=false, color="#eef") {
    super(canvas, x, y, name)
    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    this.polygon = new fabric.Polygon([], {
      fill: color,
      originX: 'center',
      originY: 'center',
      selectable: false,
      stroke: "#000",
      strokeWidth: 1,
      strokeDashArray: strokeDashArray,
    })
    log(this.polygon)
    this.add(this.polygon)
    this.addText(name)
  }
  setPoints(arr) {
    let points = []
    let minx = 10000000
    let miny = 10000000
    let maxx = -10000000
    let maxy = -10000000
    while (arr.length) {
      let y = arr.pop()
      let x = arr.pop()
      if (minx > x) minx = x
      if (miny > y) miny = y
      if (maxx < x) maxx = x
      if (maxy < y) maxy = y
      points.push({x, y})
    }
    this.polygon.points = points
    this.polygon.width = maxx - minx
    this.polygon.height = maxy - miny
    this.setDirty(this.polygon)
    log(this.polygon)
  }
}
module.export = PolygonText

class SQSWidget extends BoxText2 {
  constructor (canvas, x, y, name, w = 100, h= 50, max = 10000, dashed=false, color="#eef") {
    super(canvas, x, y + w / 2, name, w, h, max, dashed, color)
    MakeWidget(this)
    this.update(this)
    setInterval(this.update, 5000, this)
  }
  update (that) {
    let promise = $.get('/api/sqs/' + that.name)
    promise.done(response => {
      let obj = JSON.parse(response)
      that.updateValue(obj.ApproximateNumberOfMessages)
      that.updateText(that.name + ':\n' + that.value)
    })
  }
}
module.export = SQSWidget

class S3Widget extends PolygonText {
  constructor (canvas, x, y, name, dashed=false, color="#090", w=100, h=50) {
    super(canvas, x, y, name, dashed, color)
    let w2 = w / 2
    let h2 = h / 2
    this.setPoints([-w2, -h2, w2, -h2, w2/2, h2, -w2/2, h2])
    this.menu = new Menu(canvas, x, y, 50, 25)
    MakeWidget(this)
  }
}
module.export = S3Widget

class DBWidget extends EllipseText {
  constructor (canvas, x, y, name, w = 100, h = 50, dashed=false, color="#090") {
    super(canvas, x, y, name, w, h, dashed, color)
    this.box = new BoxText(canvas, -w/2, 0, "", w, h, dashed, color)
    this.add(this.box)
    this.box.sendToBack()
    this.width = w;
    this.height = h*2;
    MakeWidget(this)
    this.box.menu = this.menu
    log(this.menu)
    this.menu.top = x + h / 2
  }
}
module.export = DBWidget

class APIWidget extends CircleText {
  constructor (canvas, x, y, name, r = 50, dashed=false) {
    super(canvas, x, y, name, r, dashed)
    MakeWidget(this)
  }
}
module.export = APIWidget

class LibWidget extends CircleText {
  constructor (canvas, x, y, name, r = 25, dashed=true) {
    super(canvas, x, y, name, r, dashed)
    this.circle.fill = "yellow"
    MakeWidget(this)
  }
}
module.export = LibWidget

function MakeWidget (that) {
  that.menu = new Menu(canvas, that.x, that.y, 50, 25)
  that.arrows = new Arrows(that)

  that.toWidget = function (obj, dashed) {
    that.arrows.toWidget(obj, dashed)
  }
  that.toWidget = that.toWidget.bind(that)

  that.addMenuItem = function addMenuItem (title, data, callback) {
    this.menu.addMenuItem(title, data, callback)
  }
  that.addMenuItem = that.addMenuItem.bind(that)


  if (!that.update) {
    that.update = function update(that) {}
    that.update = that.update.bind(that)
  }
  if (!that.onclick) {
    that.onclick = function onclick (that) {
      that.menu.show(that)
    }
    that.onclick = that.onclick.bind(that)
  }
}

colors = ['red', 'white', 'white']
n = 0

function computePorts (widget) {
  widget.topPort = {}
  widget.bottomPort = {}
  widget.leftPort = {}
  widget.rightPort = {}
  widget.topPort.x = widget.left + widget.width / 2
  widget.topPort.y = widget.top
  widget.bottomPort.x = widget.left + widget.width / 2
  widget.bottomPort.y = widget.top + widget.height
  widget.leftPort.x = widget.left
  widget.leftPort.y = widget.top + widget.height / 2
  widget.rightPort.x = widget.left + widget.width
  widget.rightPort.y = widget.top + widget.height / 2
}

class Arrows {
  constructor (fromWidget) {
    this.fromWidget = fromWidget
    this.toWidgets = []
    this.lines = []
  }
  toWidget (toWidget, dashed=false) {
    this.toWidgets.push(toWidget)
    let fromWidget = this.fromWidget
    computePorts(fromWidget)
    computePorts(toWidget)

    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    let x0 = fromWidget.left + fromWidget.width / 2
    let y0 = fromWidget.top + fromWidget.height / 2
    let x1 = toWidget.left + toWidget.width / 2
    let y1 = toWidget.top + toWidget.height / 2
    let line0 = new fabric.Line([x0, y0, x1, y1], { stroke: "red", selectable: false, strokeDashArray: strokeDashArray })
    this.fromWidget._canvas.add(line0)

    // let p0 = [fromWidget[fromPort].x, fromWidget[fromPort].y]
    // let p1 = [fromWidget[fromPort].x + tx, fromWidget[fromPort].y + ty]
    // let p2 = [fromWidget[fromPort].x + tx, toWidget[toPort].y]
    // let p3 = [toWidget[toPort].x, toWidget[toPort].y]
    // let l0 = p0.concat(p1)
    // let l1 = p1.concat(p2)
    // let l2 = p2.concat(p3)
    // log('l0', { l0 })
    // log('l1', { l1 })
    // log('l2', { l2 })
    // let line0 = new fabric.Line(l0, { stroke: colors[n] })
    // let line1 = new fabric.Line(l1, { stroke: colors[n] })
    // let line2 = new fabric.Line(l2, { stroke: colors[n] })
    // this.fromWidget._canvas.add(line0)
    // this.fromWidget._canvas.add(line1)
    // this.fromWidget._canvas.add(line2)
  }
}

class Menu extends Group {
  constructor (canvas, x, y, w, h) {
    super(canvas, x, y)
    this.x = x
    this.y = y
    this.w = w
    this.h = h

    this.items = []
    let that = this
    this.addMenuItem('(x)', that, nop)
    this.visible = false
  }
  addMenuItem (title, data, callback) {
    let box = new BoxText(
      this._canvas,
      0,
      this.h * this.items.length,
      title,
      this.w,
      this.h
    )
    box.box.stroke = 'black'
    box.box.strokeWidth = 1
    box._parent = this
    box._onclick = callback
    box._data = data
    box.onclick = this.onclick
    this.add(box)
    this.items.push(box)
  }
  onclick (item) {
    item._onclick(item._data)
    item._parent.hide(item)
  }
  show (friend) {
    if (this.visible) return
    this._canvas.add(this)
    for (let item of this.items) {
      this._canvas.add(item)
      this._canvas.bringToFront(item)
    }
    this._canvas.bringToFront(this)
    this._canvas.renderAll()
    this.visible = true
  }
  hide (friend) {
    if (!this.visible) return
    let that = this
    for (let item of that.items) {
      that._canvas.remove(item)
    }
    that._canvas.remove(that)
    that._canvas.renderAll()
    this.visible = false
  }
}
module.export = Menu
function nop (menuitem) {
  console.log({ menuitem })
}
