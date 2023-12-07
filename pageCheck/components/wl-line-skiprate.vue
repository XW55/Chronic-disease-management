<template>
	<canvas type="2d" class="ec-canvas" :canvas-id="canvasId" @init="init">
	</canvas>
</template>

<script>
	import WxCanvas from "./wx-canvas.js";
	import * as echarts from "./echarts.js";

	export default {
		props: {
			canvasId: {
				type: String,
				default: () => {
					return "ec-canvas1";
				}
			},
		},
		data() {
			return {
				$curChart: {},
				toHandleList: [],
				option: {}
			};
		},
		created() {
			this.initByNewWay()
			this.initRateData([])
		},
		methods: {
			initRateData(HRs, totalTime) {
				let chartData = {
					grid: {
						top: "24%",
						left: "10%",
						bottom: "9%",
						right: "8%",
						tooltip: {
							show: false
						}
					},
					xAxis: {
						data: [],
						type: "category",
						boundaryGap: false,
						offset: -6,
						axisLine: {
							show: false,
							lineStyle: {
								color: "#BABCC1",
							},
						},
						axisTick: {
							show: false,
						},
						axisLabel: {
							interval: 9,
							showMaxLabel: true
						},
					},
					yAxis: {
						z: 1,
						min: 40,
						max: 120,
						name: "心率(次/分钟)",
						nameTextStyle: {
							color: "#BABCC1",
							padding: [0, 0, 0, 14],
						},
						textStyle: {
							color: "#BABCC1",
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: "#BABCC1",
							},
						},
						axisTick: {
							show: false,
						},
						splitLine: {
							lineStyle: {
								color: "rgba(239, 239, 240, 0.6)",
							},
						},
					},
					series: [{
						tooltip: {
							show: false,
							trigger: 'none',
						},
						z: 1,
						type: "line",
						color: "#00D6DC",
						data: HRs,
						symbol: "none",
						smooth: true,
						areaStyle: {
							color: {
								type: "linear",
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
										offset: 0,
										color: "rgba(191, 149, 251, 0.2)", // 0% 处的颜色
									},
									{
										offset: 1,
										color: "rgba(191, 149, 251, 0)", // 100% 处的颜色
									},
								],
								global: false, // 缺省为 false
							},
						},
					}, ],
				};
				for (let index = 0; index <= totalTime; index++) {
					chartData.xAxis.data.splice(index, 0, index);
				}
				this.option = chartData
				this.setOption(this.option)
			},
			init(callback) {
				this.initByNewWay(callback);
			},
			initByNewWay(callback) {
				const that = this
				const query = wx.createSelectorQuery().in(this);
				query
					.select(".ec-canvas")
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
					.select(".ec-canvas")
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
			}

			// touchStart(e) {
			// 	this.$emit("touchstart", e);
			// 	if (this.$curChart && e.touches.length > 0) {
			// 		var touch = e.touches[0];
			// 		var handler = this.$curChart.getZr().handler;
			// 		if (handler) {
			// 			handler.dispatch("mousedown", {
			// 				zrX: touch.x,
			// 				zrY: touch.y
			// 			});
			// 			handler.dispatch("mousemove", {
			// 				zrX: touch.x,
			// 				zrY: touch.y
			// 			});
			// 			handler.processGesture(wrapTouch(e), "start");
			// 		}
			// 	}
			// },

			// touchMove(e) {
			// 	this.$emit("touchmove", e);
			// 	if (this.$curChart && e.touches.length > 0) {
			// 		var touch = e.touches[0];
			// 		var handler = this.$curChart.getZr().handler;
			// 		if (handler) {
			// 			handler.dispatch("mousemove", {
			// 				zrX: touch.x,
			// 				zrY: touch.y
			// 			});
			// 			handler.processGesture(wrapTouch(e), "change");
			// 		}
			// 	}
			// },

			// touchEnd(e) {
			// 	this.$emit("touchend", e);
			// 	if (this.$curChart) {
			// 		const touch = e.changedTouches ? e.changedTouches[0] : {};
			// 		var handler = this.$curChart.getZr().handler;
			// 		if (handler) {
			// 			handler.dispatch("mouseup", {
			// 				zrX: touch.x,
			// 				zrY: touch.y
			// 			});
			// 			handler.dispatch("click", {
			// 				zrX: touch.x,
			// 				zrY: touch.y
			// 			});
			// 			handler.processGesture(wrapTouch(e), "end");
			// 		}
			// 	}
			// },
		}
	};
</script>

<style lang="scss">
	.ec-canvas {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
