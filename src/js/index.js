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

const canvas_data = {
	text: '测试测试Test',
	font_size: 40,
	sx: 0,
	sy: 0,
	angle: 0,
	fake_scale: 100
}

new Vue({
	el: '#app',
	data: {
		sx_range: [],
		sy_range: [],
		canvas_width: 0,
		canvas_height: 0,
		poster: '', // 海报url base64
		is_show_poster: false, // 是否显示海报
		canvas_data: {}
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

			this.sx_range = [0, this.canvas_width]
			this.sy_range = [0, this.canvas_height]

			this.draw(canvas)
		},

		/**
		 * 绘制canvas
		 * @param {canvas} canvas 			需要绘制的canvas对象
		 * @param {number} canvas_scale 	当前预览canvas与生成海报的canvas之间的比例大小
		 */
		draw(canvas, canvas_scale = 1) {
			let ctx = canvas.getContext('2d')

			// 这个scale才是真实的，data里面的scale是为了range控件放大了100倍
			let scale = this.canvas_data.fake_scale / 100

			let font_size = this.canvas_data.font_size * canvas_scale

			ctx.fillStyle = "red"
        	ctx.fillRect (0, 0, canvas.width, canvas.height)

			ctx.fillStyle = '#fff'
			ctx.textBaseline = 'top'
			ctx.font = `${font_size}px 宋体` //设置字体

			let text_info = ctx.measureText(this.canvas_data.text)

			let sx = +this.canvas_data.sx * canvas_scale,
				sy = +this.canvas_data.sy * canvas_scale

			let translate_x = text_info.width / 2 + sx,
				translate_y = (font_size * 1.2) / 2 + sy

			ctx.translate(translate_x, translate_y);

			ctx.rotate(this.canvas_data.angle * Math.PI / 180);

			ctx.scale(scale, scale);

			ctx.translate(-translate_x, -translate_y);

			ctx.fillText(this.canvas_data.text, sx, sy);

			return canvas
		},

		// 重置
		reset() {
			this.canvas_data = Object.assign({}, canvas_data)
		},

		/**
		 * 生成海报
		 */
		createPoster() {
			let expect_width = 2000,
				canvas_ratio = this.canvas_width / this.canvas_height,
				expect_height = 2000 / canvas_ratio

			let	canvas_scale = expect_width / this.canvas_width

			let canvas = document.createElement('canvas')

			canvas.width = expect_width
			canvas.height = expect_height

			let temp = this.draw(canvas, canvas_scale)

			this.poster = temp.toDataURL('image/jpeg', 0.92);
			
			this.is_show_poster = true
		}

	},

	beforeCreate() {
		this.$nextTick(function () {
			this.canvas_data = Object.assign({}, canvas_data)
		})
	},

	created() {
		this.init_data = JSON.parse(JSON.stringify(this.canvas_data))
	},

	mounted() {
		this.drawText()
	},

	watch: {
		canvas_data: {
			handler() {
				this.drawText()
			},
			deep: true
		}
	},

})