// create a wrapper around native canvas element (with id="c")
var canvas = new fabric.Canvas('c');
canvas.selection = false;
let circleText = new CircleText(100, 100, 50, "Greg Smith", greg);
let boxText = new BoxText(300, 300, 100, 100, "ElasticSearch", es);
canvas.add(circleText);
canvas.add(boxText);

canvas.on('mouse:down', function (options) {
  if (options.target && options.target.onclick) options.target.onclick(options.target);
});

function greg() {
  alert("GREG SMITH");
}

function es(obj) {
  alert(obj.text.text);
}