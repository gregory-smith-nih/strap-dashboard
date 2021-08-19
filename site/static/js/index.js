let module = {}
let log = console.log

module.exports = {}
class Group extends fabric.Group {
  constructor (canvas, x, y) {
    super([], {
      left: x,
      top: y,
      angle: 0,
      selectable: false
    })
    this._canvas = canvas
  }
  add (obj) {
    super.add(obj)
    console.log('add', { obj })
    if (this.width < obj.width) this.width = obj.width
    if (this.height < obj.height) this.height = obj.height
    obj.setCoords()
    this.setCoords()
    obj.dirty = true
    this._canvas.renderAll()
  }
  addText (s) {
    let textAlign = 'center'
    let originX = 'center'
    // if (s[0] === "-") {
    //   textAlign = "left"
    //   originX = "left"
    //   s = s.substring(1)
    // } else if (s[0] == "+") {
    //   textAlign = "right";
    //   originX = "right"
    //   s = s.substring(1)
    // }
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
    let text = this.text
    console.log({ text })
    this.text.set('text', s)
    this.setCoords()
    this._canvas.renderAll()
  }
}
module.export = Group

class BoxText extends Group {
  constructor (canvas, x, y, w, h, s, dashed=false) {
    super(canvas, x, y)
    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    this.box = new fabric.Rect({
      width: w,
      height: h,
      fill: '#eef',
      originX: 'center',
      originY: 'center',
      selectable: false,
      stroke: "#000",
      strokeWidth: 1,
      strokeDashArray: strokeDashArray,
    })
    this.add(this.box)
    this.addText(s)
  }
}
module.export = BoxText

class BoxText2 extends Group {
  constructor (canvas, x, y, w, h, s, max = 100, dashed=false) {
    super(canvas, x, y)
    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    this.max = max
    this.value = 0
    this.bgbox = new fabric.Rect({
      width: w,
      height: h,
      fill: '#eef',
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
      fill: '#cec',
      originX: 'center',
      originY: 'center',
      selectable: false,
    })
    this.add(this.bgbox)
    this.add(this.fgbox)
    this.addText(s)
  }
  percent (percent) {
    let bgbox = this.bgbox
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
  constructor (canvas, x, y, r, s, dashed=false) {
    super(canvas, x, y)
    let strokeDashArray = []
    if (dashed) strokeDashArray = [5, 5]
    this.circle = new fabric.Circle({
      radius: r,
      fill: '#eef',
      originX: 'center',
      originY: 'center',
      selectable: false,
      stroke: "#000",
      strokeWidth: 1,
      strokeDashArray: strokeDashArray,
    })
    this.add(this.circle)
    this.addText(s)
  }
}
module.export = CircleText

class SQSWidget extends BoxText2 {
  constructor (canvas, x, y, name, max = 10000, w = 50, dashed=false) {
    super(canvas, x, y + w / 2, 100, w, name, max, dashed)
    this.name = name
    MakeWidget(this)
    this.update(this)
    setInterval(this.update, 5000, this)
  }
  update (that) {
    let promise = $.get('/api/sqs/' + that.name)
    promise.done(response => {
      let obj = JSON.parse(response)
      console.log(obj.ApproximateNumberOfMessages)
      that.updateValue(obj.ApproximateNumberOfMessages)
      that.updateText(that.name + ':\n' + that.value)
    })
  }
}
module.export = SQSWidget

class S3Widget extends BoxText {
  constructor (canvas, x, y, name, h = 50, dashed=false) {
    super(canvas, x, y + h / 2, 100, h, name, dashed)
    this.name = name
    log(this)
    MakeWidget(this)
    this.box.fill = '#383'
    this.menu = new Menu(canvas, x, y, 50, 25)
    this.name = name
    this.onclickURL = null
  }
  addMenuItem (title, data, callback) {
    this.menu.addMenuItem(title, data, callback)
  }
  onclick (that) {
    that.menu.show(that)
  }
}
module.export = S3Widget

class APIWidget extends CircleText {
  constructor (canvas, x, y, name, r = 50, dashed=false) {
    super(canvas, x, y, r, name, dashed)
    this.menu = new Menu(canvas, x, y, 50, 25)
    this.name = name
    this.onclickURL = null
    MakeWidget(this)
  }
  update (that) {}
  addMenuItem (title, data, callback) {
    this.menu.addMenuItem(title, data, callback)
  }
  onclick (that) {
    that.menu.show(that)
  }
}
module.export = APIWidget

class LibWidget extends CircleText {
  constructor (canvas, x, y, name, r = 25, dashed=true) {
    super(canvas, x, y, r, name, dashed)
    this.circle.fill = "yellow"
    this.menu = new Menu(canvas, x, y, 50, 25)
    this.name = name
    this.onclickURL = null
    MakeWidget(this)
  }
  repaint () {
    this.updateText(this.name + ':' + this.value)
  }
  update (that) {}
  addMenuItem (title, data, callback) {
    this.menu.addMenuItem(title, data, callback)
  }
  onclick (that) {
    that.menu.show(that)
  }
}
module.export = LibWidget

function MakeWidget (that) {
  that.arrows = new Arrows(that)
  that.toWidget = function (obj, dashed) {
    that.arrows.toWidget(obj, dashed)
  }
  that.toWidget = that.toWidget.bind(that)
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
    console.log('towidget', { toWidget })
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
    console.log(title)
    let box = new BoxText(
      this._canvas,
      0,
      this.h * this.items.length,
      this.w,
      this.h,
      title
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
    console.log('__ONCLICK__', item)
    item._onclick(item._data)
    item._parent.hide(item)
  }
  show (friend) {
    if (this.visible) return
    this._canvas.add(this)
    for (let item of this.items) {
      console.log(item)
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
    console.log('hide', { that })
    for (let item of that.items) {
      console.log(item)
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
