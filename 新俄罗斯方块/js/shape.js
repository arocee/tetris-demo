"use strict"
/**
*  形状类
*  @author zhuhongyang
*  @date 2016/3/20
*/
function ShapeFactory(){
    if(ShapeFactory.unique){
        return ShapeFactory.unique; 
    }
	Object.defineProperty(ShapeFactory, 'unique', {
		value: this
	});
}
ShapeFactory.prototype = {
	constructor: ShapeFactory,
	currentShapeContainer: [],  // 当前形状
	nextShapeContainer: [], // 下一个形状
	panelContatainer: [],  // 已掉落的形状
	shapes: shapes,
	colors: shapeColors,
	init: function(){
		var shape = new Shape(),
			id = 1;
		
		for(var i = 0; i < baseVerticalUnit; i ++) {
			shape.boxes.push([]);
			for(var j = 0; j < baseHorizontalUnit; j ++) {
				shape.boxes[i].push(new Box(id ++, j, i));
			}
		}

		this.panelContatainer.push(shape);
	},
	makeNew: function(){
		var shape = new Shape(),
			that = this,
			type = Math.floor(Math.random() * this.shapes.length);  // TODO 可优化

		shape.boxes.push(
			new Box(1, 0, 0), 
			new Box(2, 1, 0), 
			new Box(3, 2, 0), 
			new Box(4, 3, 0),
			new Box(5, 3, 1),
			new Box(6, 3, 2),
			new Box(7, 3, 3),
			new Box(8, 2, 3),
			new Box(9, 1, 3),
			new Box(10, 0, 3),
			new Box(11, 0, 2),
			new Box(12, 0, 1),
			new Box(13, 1, 1),
			new Box(14, 2, 1),
			new Box(15, 2, 2),
			new Box(16, 1, 2)
		);

		shape.boxes.forEach(function(box){
			box.setBgColor(that.colors[type]);
			if(that.shapes[type].indexOf(box.id) != -1){
				box.changeActive(true);
			}
		});

		this.nextShapeContainer.push(shape);
		
		if(!this.currentShapeContainer.length){
			this.currentShapeContainer.push(this.nextShapeContainer.pop());
			this.makeNew();
		}
	}
}

function Shape(){
	this.x = baseShapeLeft;
	this.y = baseShapeTop;
	this.boxes = [];
}
Shape.prototype = {
	constructor: Shape,
	size: shapeSize,
	moveFrequency: normalSpeed,
	moveX: function(dir, panel){
		// 左右运动
		var getBorder = this.boundaryLimit(dir),
			touched = this.touchCheck(dir, panel);
		if(!getBorder && !touched){
			this.x += dir;
		}
		return getBorder || touched;
	},
	moveY: function(panel){
		// 向下运动
		var getBorder = this.boundaryLimit(0),
			touched = this.touchCheck(0, panel);
		if(!getBorder && !touched){
			this.y += 1;
		}
		return getBorder || touched;
	},
	changeSpeed: function(isAcc){
		// 改变速度
		if(!isAcc){
			this.moveFrequency = normalSpeed;
		} else {
			this.moveFrequency = accSpeed;
		}
	},
	rotate: function(panel){
		/* 翻转 */
		var currentWrapper = this.size,
			rangeLeft = 1,
			that = this, 
			prevActive = [],
			newActive = [],
			rotateable = true;  // 默认可以进行翻转
		do
		{
			var innerCount = Math.pow((currentWrapper - 2), 2),
				range = [rangeLeft, this.boxes.length - innerCount];
			
			this.boxes.forEach(function(box, index){
				// 是否循环到该层
				if(box.id >= range[0] && box.id <= range[1]){
					if(box.active){
						var b = range[0] - 1,
							i = (index - b + currentWrapper - 1) % (range[1] - b) + b;

						if(that.boxes[i].y + that.y >= baseVerticalUnit || that.boxes[i].x + that.x + 1 <= 0 || that.boxes[i].x + that.x >= baseHorizontalUnit){
							// 只要有一个会出现在界外就不能翻转
							rotateable = false;
							return false;
						} 

						panel.boxes.forEach(function(panelBoxes){
							panelBoxes.forEach(function(panelBox){
								if(!panelBox.active) return true;
								if(that.boxes[i].y + that.y == panelBox.y && that.boxes[i].x + that.x == panelBox.x){
									// 当然如果碰到了已下落的方块也不能翻转
									rotateable = false;
									return false;
								}	
							});
						});

						prevActive.push(index);
						newActive.push(i);
					}
				}
			});
			if(!rotateable){
				break;
			}
			rangeLeft = range[1] + 1;
		}
		while (currentWrapper -= 2);

		if(rotateable){
			prevActive.forEach(function(i){
				that.boxes[i].changeActive(false);
			});
			newActive.forEach(function(i){
				that.boxes[i].changeActive(true);
			});	
		}
	},
	boundaryLimit: function(dir){
		// 边界限制
		var getBorder = false,
			checkFn,
			that = this;
		switch (dir)
		{
		case 0:
			// 向下
			checkFn = function(box){
				return box.y + that.y + 1 == baseVerticalUnit;
			}
			break;
		case -1:
			// 向左
			checkFn = function(box){
				return box.x + that.x == 0;
			}
			break;
		case 1:
			// 向右
			checkFn = function(box){
				return box.x + that.x + 1 == baseHorizontalUnit;
			}
			break;
		
		}
		if(this.boxes.some(function(box){
			return box.active && checkFn(box);
		})){
			// 到达下面
			getBorder = true;
		}
		checkFn = null;

		return getBorder;
	},
	touchCheck: function(dir, panel){
		// 碰撞检测
		var checkFn,
			that = this;
		switch (dir)
		{
		case 0:
			// 向下
			checkFn = function(box){
				return panel.boxes.some(function(panelBoxes){
					return panelBoxes.some(function(panelBox){
						return panelBox.active && ((box.y + that.y + 1 == panelBox.y) && (box.x + that.x == panelBox.x));
					});
				});
			}
			break;
		case -1:
			// 向左
			checkFn = function(box){
				return panel.boxes.some(function(panelBoxes){
					return panelBoxes.some(function(panelBox){
						return panelBox.active && ((box.x + that.x - 1 == panelBox.x) && (box.y + that.y == panelBox.y));
					});
				});
			}
			break;
		case 1:
			// 向右
			checkFn = function(box){
				return panel.boxes.some(function(panelBoxes){
					return panelBoxes.some(function(panelBox){
						return panelBox.active && ((box.x + that.x + 1 == panelBox.x) && (box.y + that.y == panelBox.y));
					});
				});
			}
			break;
		}

		return this.boxes.some(function(box){
			// 碰撞！
			return box.active && checkFn(box);
		});
	},
	removeFloorIfFull: function(){
		var index = this.boxes.length - 1,
			activeLength,
			fullFloorLength = 0,
			that = this;
		for(; index >= 0; index --){
			activeLength = 0;

			if(this.boxes[index].every(function(box){
				return box.active;
			})){
				// 此排已满
				this.boxes[index].forEach(function(box){
					box.changeActive(false);
				});
				this.boxes.unshift(this.boxes.splice(index, 1)[0]);
				
				// 需要重新设置x，y
				this.boxes.forEach(function(floor, y){
					floor.forEach(function(box, x){
						box.changePos(x, y);
					});
				});
				index ++,
				fullFloorLength ++;
			}
		}

		return fullFloorLength; // 用于计分
	}
}

function Box(id, x, y, active, bgColor){
	this.id = id;
	this.x = x;
	this.y = y;
	this.active = active;
	this.bgColor = bgColor;
}
Box.prototype = {
	constructor: Box,
	baseSize: baseSize,
	setBgColor: function(bgColor){
		this.bgColor = bgColor;
		return this;
	},
	changePos: function(x, y){
		(x != undefined) && (this.x = x);
		(y != undefined) && (this.y = y);
		return this;
	},
	changeActive: function(active){
		this.active = active;
		return this;
	}
}