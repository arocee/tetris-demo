"use strict"
/**
*  常量、工具
*  @author zhuhongyang
*  @date 2016/3/20
*/
Object.defineProperties(window, {
	baseSize: {
		value: 30 // 方块的基本宽度
	},
	baseLeft: {
		value: 0 // 游戏主界面的左边
	},
	baseTop: {
		value: 0 // 游戏主界面的上边
	},
	baseHorizontalUnit: {
		value: 10
	},
	baseVerticalUnit: {
		value: 20	
	},
	gameBgColor: {
		value: '#CBCBCB' // 背景颜色
	},
	infoBgColor: {
		value: '#5D5D5D'
	},
	shapeSize: {
		value: 4 // 4 * 4的形状
	},
	delayTimer: {
		value: 20 // 按键延迟
	},
	normalSpeed: {
		value: 50 // 初始下落速度
	},
	accSpeed: {
		value: 2  // 加速下落速度
	},
	drawCircle: {
		value: 2  // 绘制频率
	},
	lightFrequency: {
		value: 7  // 提示文字闪烁频率
	},
	shapes: {
		value: [[13, 14, 15, 16], [5, 12, 13, 14], [11, 13, 15, 16], [11, 12, 15, 16], // 田字形、条形、山形、L形左、
			[11, 14, 15, 16], [12, 13, 15, 16], [11, 13, 14, 16]   // L形右、Z形左, Z形右
				/*,[13, 14], [2, 12, 13, 14, 16],  [1,2,3,12,14], [1,2,3,13,16], [13]*/ // 怪异形状
		]
	},
	shapeColors: {
		value: ['red', 'green', 'yellow', 'aqua', 'blue', 'maroon', 'purple'
			/*, 'black', 'white', 'blueviolet', 'brown', 'cornflowerblue'*/
		]
	},
	borderColor: {
		value: '#000'  // 边框颜色
	}
});
Object.defineProperties(window, {
	baseHorizontalWidth: {
		value: baseHorizontalUnit * baseSize  // 游戏主内容区水平宽度
	},
	baseVerticalHeight: {
		value: baseVerticalUnit * baseSize  // 游戏主内容区垂直高度
	},
	infoWidth: {
		value: (shapeSize + 2) * baseSize  // 额外信息区的宽度
	},
	baseShapeTop: {
		value: - shapeSize + 1  // 形状初始位置上
	},
	baseShapeLeft: {
		value: (baseHorizontalUnit - shapeSize) / 2 // 形状初始位置左
	}
});

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());