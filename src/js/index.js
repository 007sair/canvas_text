// Lib
import 'babel-polyfill' // es6
import 'amfe-flexible'  // rem

/* 以下模块使用方法，参考：/build/config/provide.config.js */
import Vue from 'vue'
// import $ from 'zepto'

// css、images资源的引入
import '@/css/main'
import oImages from '@/js/mod/assets'

// 测试环境判断
if (__DEV__) {
	require('@/index.html') /* FOR HMR */
	// var VConsole = require('vconsole')
	// new VConsole()
}

import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.use(Mint);

// 举个栗子
// import '@/js/mod/demo'

const SCREEN_WIDTH = Math.min(540, document.documentElement.clientWidth)

new Vue({
	el: '#app',
	data: {
		canvas_width: 0,
		canvas_height: 0,
		text: '测试Test',
		font_size: 40,
		angle: 0,
		dx: 100,
		dy: 50,
		fake_scale: 100,
		poster: '',
		big_scale: 1, // 实际海报大小与预览区域的比例
		is_show_poster: false // 是否显示海报
	},

	methods: {
		// 绘制文字
		drawText() {
			const BASE_WIDTH = SCREEN_WIDTH  	// canvas舞台的宽度

			let canvas = this.$refs.myCanvas

			canvas.width = BASE_WIDTH
			canvas.height = BASE_WIDTH * 0.5

			this.canvas_width = canvas.width
			this.canvas_height = canvas.height

			this.draw(canvas)
		},

		draw(canvas) {
			let ctx = canvas.getContext('2d')

			let font_size = this.font_size * this.big_scale

			ctx.fillStyle = "red";
        	ctx.fillRect (0, 0, canvas.width, canvas.height);
			

			ctx.fillStyle = '#fff';
			ctx.textBaseline = 'top';
			ctx.font = `${font_size}px 宋体`; //设置字体

			let text_info = ctx.measureText(this.text);

			let dx = +this.dx * this.big_scale,
				dy = +this.dy * this.big_scale

			let translate_x = text_info.width / 2 + dx,
				translate_y = (font_size * 1.4) / 2 + dy

			// 这个scale才是真实的，data里面的scale是为了range控件放大了100倍
			let scale = this.fake_scale / 100

			ctx.translate(translate_x, translate_y);

			ctx.rotate(this.angle * Math.PI / 180);

			ctx.scale(scale, scale);

			ctx.translate(-translate_x, -translate_y);

			ctx.fillText(this.text, dx, dy);

			return canvas
		},

		// 生成图片
		createPoster() {
			let expect_width = 2000,
				canvas_ratio = this.canvas_width / this.canvas_height,
				expect_height = 2000 / canvas_ratio

			this.big_scale = expect_width / this.canvas_width

			let canvas = document.createElement('canvas')

			canvas.width = expect_width
			canvas.height = expect_height

			let temp = this.draw(canvas)

			this.poster = temp.toDataURL('image/jpeg', 0.92);
			
			this.is_show_poster = true
		}

	},

	mounted() {
		this.drawText()
	},

	watch: {
		text() {
			this.drawText()
		},
		font_size() {
			this.drawText()
		},
		angle() {
			this.drawText()
		},
		dx() {
			this.drawText()
		},
		dy() {
			this.drawText()
		},
		fake_scale() {
			this.drawText()
		},
	},

})