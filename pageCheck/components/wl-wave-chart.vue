<template>
	<view>
		<view :style="{height: `${systemInfo.statusBarHeight + 36}px`}"></view>
		<scroll-view class="mask" :scroll-y="true">
			<canvas type="2d" class="ec-canvas2" :canvas-id="canvasId" @init="init">
			</canvas>
		</scroll-view>
	</view>
</template>

<script>
	import WxCanvas from "./wx-canvas.js";
	import * as echarts from "./echarts.js";
	export default {
		props: {
			canvasId: {
				type: String,
				default: () => {
					return "ec-canvas2";
				}
			},
		},
		data() {
			return {
				$curChart: {},
				toHandleList: [],
				option: {},

				categories: [],
				series: [{
					data: new Array(750).fill(null),
					color: '#FF0000'
				}],
				index: 0,
				minH: -400,
				maxH: 600,
				dataAry: new Array(750).fill(null),
				scrollTop: 0,

				systemInfo: null
			}
		},
		created() {
			for (let index = 0; index < 750; index++) {
				this.categories.push(index + 1)
			}
			this.initByNewWay()
			this.systemInfo = wx.getSystemInfoSync()
		},
		methods: {
			setMaxMin(maxH, minH) {
				this.minH = minH
				this.maxH = maxH
			},
			addNewData(newAddDataAry) {
				for (let i = 0; i < newAddDataAry.length; i++) {
					this.dataAry[(this.index + i) % 750] = newAddDataAry[i]
				}
				this.index = (this.index + newAddDataAry.length) % 750
				for (let i = 0; i < 50; i++) {
					this.dataAry[(this.index + i) % 750] = null
				}
				this.initDrawData()
			},

			initByNewWay(callback) {
				const that = this
				const query = wx.createSelectorQuery().in(this);
				query
					.select(".ec-canvas2")
					.fields({
						node: true,
						size: true
					})
					.exec(res => {
						const canvasNode = res[0].node;
						const canvasDpr = wx.getSystemInfoSync().pixelRatio;
						const canvasWidth = res[0].width;
						const canvasHeight = res[0].height;

						const ctx = canvasNode.getContext("2d");

						const canvas = new WxCanvas(ctx, that.canvasId, true, canvasNode);
						echarts.setCanvasCreator(() => {
							return canvas;
						});

						if (typeof callback === "function") {
							that.$curChart = callback(
								canvas,
								canvasWidth,
								canvasHeight,
								canvasDpr
							);
						} else {
							that.initChart(canvas, canvasWidth, canvasHeight, canvasDpr)
						}
					});
			},
			setOption(val) {
				if (!this.$curChart || !this.$curChart.setOption) {
					this.toHandleList.push(val);
				} else {
					this.$curChart.setOption(val);
				}
			},
			canvasToTempFilePath(opt) {
				const query = wx.createSelectorQuery().in(this);
				query
					.select(".ec-canvas2")
					.fields({
						node: true,
						size: true
					})
					.exec(res => {
						const canvasNode = res[0].node;
						opt.canvas = canvasNode;
						wx.canvasToTempFilePath(opt);
					});
			},
			initChart(canvas, width, height, canvasDpr) {
				this.$curChart = echarts.init(canvas, null, {
					width: width,
					height: height,
					devicePixelRatio: canvasDpr
				});
				canvas.setChart(this.$curChart);
				this.$curChart.setOption(this.option);
			},
			initDrawData() {
				let chartData = {
					animation: false,
					grid: {
						top: "0%",
						left: "0%",
						bottom: "0%",
						right: "-3%",
						tooltip: {
							show: false
						}
					},
					xAxis: {
						data: [],
						type: "category",
						show: false
					},
					yAxis: {
						show: false,
						min: this.minH,
						max: this.maxH
					},
					tooltip: {
						show: false,
					},
					legend: {
						selectedMode: false,
					},
					series: [{
						clickable: false,
						z: 1,
						type: "line",
						color: "#FE0000",
						data: this.dataAry,
						symbol: "none",
						smooth: true,
						lineStyle: {
							width: 1.5
						}
					}],
				};
				chartData.xAxis.data = this.categories
				this.setOption(chartData);
			},
			scroll: function(e) {
				this.scrollTop = e.detail.scrollTop
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mask {
		width: 750rpx;
		height: 260rpx;
		overflow: hidden;
	}

	.ec-canvas2 {
		margin-top: -5rpx;
		width: 100%;
		height: 270rpx;
	}
</style>
