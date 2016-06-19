"use strict"
/**
*  游戏类
*  @author zhuhongyang
*  @date 2016/3/20
*/
function Game(shapeFactory, view, score){
    if(Game.unique){
        return Game.unique; 
    }
	Object.defineProperty(Game, 'unique', {
		value: this
	});

	this.shapeFactory = shapeFactory,
	this.view = view,
	this.gameTimer,
	this.score = score,  // 计分系统
	this.sycronize = false, // 保证运动的原子性
	this.pause = false, // 游戏暂停

	this.init();
}
Game.prototype = {
	constructor: Game,
	counter: 0,
	delayTimer: delayTimer,
	init: function(){
		var that = this,
			changeAble = true,
			leftAble = true,
			rightAble = true;
		document.addEventListener('keydown', function(e){
			switch(e.keyCode){
				case 39:
				case 68:
					//右
					if(rightAble && !that.sycronize && !that.pause){
						that.sycronize = true,
						rightAble = false;
						// 间隔延迟
						setTimeout(function(){
							rightAble = true;
						}, that.delayTimer);
						that.shapeFactory.currentShapeContainer[0].moveX(1, that.shapeFactory.panelContatainer[0]);
						that.sycronize = false;
					}
					break;
				case 37:
				case 65:
					//左
					if(leftAble && !that.sycronize && !that.pause){
						that.sycronize = true,
						leftAble = false;
						// 间隔延迟
						setTimeout(function(){
							leftAble = true;
						}, that.delayTimer);
						that.shapeFactory.currentShapeContainer[0].moveX(-1, that.shapeFactory.panelContatainer[0]);
						that.sycronize = false;
					}
					break;
				case 40:
				case 83:
					//下
					that.shapeFactory.currentShapeContainer[0].changeSpeed(true);
					break;
				case 38:
				case 87:
					//上
					if(changeAble && !that.sycronize && !that.pause){
						that.sycronize = true,
						changeAble = false;
						// 间隔延迟
						setTimeout(function(){
							changeAble = true;
						}, that.delayTimer);
						that.shapeFactory.currentShapeContainer[0].rotate(that.shapeFactory.panelContatainer[0]);
						that.sycronize = false;
					}
					break;
				case 80:
					// 暂停
					that.pause = !that.pause;
					break;
			}
		});
		document.addEventListener('keyup', function(e){
			switch(e.keyCode){
				case 40:
				case 83:
					//下
					that.shapeFactory.currentShapeContainer[0].changeSpeed(false);
					break;
			}
		});
	},
	thread: function(){
		/* 游戏主线程 */
		var that = this;
		this.gameTimer = window.requestAnimationFrame(function(){
			if(!that.shapeFactory.nextShapeContainer.length){
				that.shapeFactory.makeNew();			
			}

			if(!that.sycronize){
				(++ that.counter == 1000) && (that.counter = 1);

				that.sycronize = true;
				if(that.counter % that.shapeFactory.currentShapeContainer[0].moveFrequency === 0 && !that.pause){
					var touched = that.shapeFactory.currentShapeContainer[0].moveY(that.shapeFactory.panelContatainer[0]);
					if(touched){
						var prevShape = that.shapeFactory.currentShapeContainer.pop();
						prevShape.boxes.filter(function(box){
							return box.active;
						}).forEach(function(box){
							var x = box.x + prevShape.x + baseLeft,
								y = box.y + prevShape.y + baseTop,
								bgColor = box.bgColor;

							try
							{
								that.shapeFactory.panelContatainer[0].boxes[y][x].setBgColor(bgColor).changeActive(true);
							}
							catch (e)
							{
								//alert('game over!');
							}
						});

						// 对满排的进行消减
						var fullFloorLength = that.shapeFactory.panelContatainer[0].removeFloorIfFull();
						if(fullFloorLength > 0){
							// 计分
							that.score.evaluateScore(fullFloorLength);
						}

						that.shapeFactory.currentShapeContainer.push(that.shapeFactory.nextShapeContainer.pop());
					}
				}
				that.sycronize = false;
			}

			if(that.counter % that.view.drawFrap === 0){
				that.view.draw(that.pause);
			}

			that.thread();
		});
	},
	newGame: function(){
		this.thread();
		
	}
}
