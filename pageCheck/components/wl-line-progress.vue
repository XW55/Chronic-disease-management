<template>
	<view class="cmd-progress cmd-progress-default" :class="setStatusClass">
		<block>
			<!-- 进度条 start -->
			<view class="cmd-progress-outer">
				<view class="cmd-progress-inner" :style="{'border-radius': strokeShape == 'square' ? 0 : '100px'}">
					<view class="cmd-progress-bg" :style="setLineStyle"></view>
					<view v-if="successPercent" class="cmd-progress-success-bg" :style="setLineSuccessStyle"></view>
				</view>
			</view>
			<!-- 进度条 end -->
			<!-- 进度条是否显示信息 start -->
			<block v-if="showInfo">
				<text class="cmd-progress-text" :title="setFormat">
					<block v-if="status != 'success' && status != 'exception' && setProgress < 100">{{setFormat}}
					</block>
					<text v-if="status == 'exception' || status == 'success' || setProgress == 100"
						:style="setLineStatusIcon"></text>
				</text>
			</block>
			<!-- 进度条是否显示信息 end -->
		</block>
	</view>
</template>

<script>
	export default {
		name: 'wl-line-progress',

		props: {
			/**
			 * 百分比
			 */
			percent: {
				type: Number,
				default: 0
			},
			/**
			 * 已完成的分段百分，仅支持类型line
			 */
			successPercent: {
				type: Number,
				default: 0
			},
			/**
			 * 是否显示进度数值或状态图标
			 */
			showInfo: {
				type: Boolean,
				default: true
			},
			/**
			 * 进度状态，可选：normal success exception （active仅支持类型line
			 */
			status: {
				validator: val => {
					return ['normal', 'success', 'exception', 'active'].includes(val);
				},
				default: 'normal'
			},
			/**
			 * 条线的宽度1-50，与width有关
			 */
			strokeWidth: {
				type: Number,
				default: 6
			},
			/**
			 * 条线的颜色，渐变色仅支持类型line
			 */
			strokeColor: {
				type: String,
				default: ''
			},
			/**
			 * 条线两端的形状 可选：'round', 'square'
			 */
			strokeShape: {
				validator: val => {
					return ['round', 'square'].includes(val);
				},
				default: 'round'
			},
			/**
			 * 圆形进度条画布宽度,支持类型circle dashboard
			 */
			width: {
				type: Number,
				default: 80
			},
		},

		computed: {
			/**
			 * 如果需要自定义格式就在这改
			 */
			setFormat() {
				return `${this.setProgress}%`;
			},
			/**
			 * 设置显示进度值，禁止小于0和超过100
			 */
			setProgress() {
				let percent = 100 - this.percent;
				if (!this.percent || this.percent < 0) {
					percent = 100;
				} else if (this.percent >= 100) {
					percent = 0;
				}
				return percent;
			},
			/**
			 * 设置进度条样式
			 */
			setLineStyle() {
				return `width: ${this.setProgress}%;
				height: ${this.strokeWidth}px;
				background: ${this.strokeColor};
				border-radius: ${this.strokeShape === 'square' ? 0 : '100px'};`;
			},
			/**
			 * 设置已完成分段进度
			 */
			setLineSuccessStyle() {
				let successPercent = 100 - this.successPercent;
				if (!this.successPercent || this.successPercent < 0 || this.setProgress < this.successPercent) {
					successPercent = 0;
				} else if (this.successPercent >= 100) {
					successPercent = 100;
				}
				return `width: ${successPercent}rpx;
				height: ${this.strokeWidth}rpx;
				border-radius: ${this.strokeShape === 'square' ? 0 : '100px'};`;
			},
			/**
			 * 设置进度条状态图标
			 */
			setLineStatusIcon() {
				let currentColor = '#108ee9'
				let svgToBase = ''
				// 异常进度
				if (this.status == 'exception') {
					currentColor = '#f5222d'
					svgToBase =
						`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='close-circle' width='1em' height='1em' fill='${escape(currentColor)}' aria-hidden='true'%3E %3Cpath d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z'%3E%3C/path%3E %3C/svg%3E`;
				}
				// 完成进度
				if (this.status == 'success' || this.setProgress >= 100) {
					currentColor = this.strokeColor || '#52c41a'
					svgToBase =
						`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='64 64 896 896' data-icon='check-circle' width='1em' height='1em' fill='${escape(currentColor)}' aria-hidden='true'%3E %3Cpath d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z'%3E%3C/path%3E %3C/svg%3E`;
				}
				return `background-image: url("${svgToBase}");
				background-size: cover;
				display: inline-block;
				width: 1em;
				height: 1em;`;
			},
			/**
			 * 状态样式
			 */
			setStatusClass() {
				let statusClass = [];
				// 异常进度
				if (this.status == 'exception') {
					statusClass.push('cmd-progress-status-exception')
				}
				// 完成进度
				if (this.status == 'success' || this.setProgress >= 100) {
					statusClass.push('cmd-progress-status-success')
				}
				// 活动进度条
				if (this.status == 'active') {
					statusClass.push('cmd-progress-status-active')
				}
				// 是否显示信息
				if (this.showInfo) {
					statusClass.push('cmd-progress-show-info')
				}
				// 进度条类型
				statusClass.push('cmd-progress-line')

				statusClass.push('cmd-progress-status-normal')
				return statusClass;
			}
		}
	}
</script>

<style>
	.cmd-progress {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		list-style: none;
		display: inline-block;
	}

	.cmd-progress-line {
		width: 100%;
		font-size: 28upx;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.cmd-progress-outer {
		display: inline-block;
		width: 100%;
		margin-right: 0;
		padding-right: 0;
	}

	.cmd-progress-show-info .cmd-progress-outer {
		flex: 1;
	}

	.cmd-progress-inner {
		display: flex;
		justify-content: flex-end;
		width: 100%;
		background-color: #f5f5f5;
		border-radius: 200upx;
		vertical-align: middle;
		position: relative;
	}

	.cmd-progress-circle-trail {
		stroke: #f5f5f5;
	}

	.cmd-progress-circle-path {
		stroke: #1890ff;
		animation: appear 0.3s;
	}

	.cmd-progress-success-bg,
	.cmd-progress-bg {
		background-color: #1890ff;
		transition: all 0.4s cubic-bezier(0.08, 0.82, 0.17, 1) 0s;
		position: relative;
	}

	.cmd-progress-bg {
		right: 0;
	}

	.cmd-progress-success-bg {
		background-color: #52c41a;
		position: absolute;
		top: 0;
		left: 0;
	}

	.cmd-progress-text {
		word-break: normal;
		width: 60upx;
		text-align: left;
		margin-left: 16upx;
		vertical-align: middle;
		display: inline-block;
		white-space: nowrap;
		color: rgba(0, 0, 0, 0.45);
		line-height: 1;
	}

	.cmd-progress-status-active .cmd-progress-bg:before {
		content: "";
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		border-radius: 20upx;
		-webkit-animation: cmd-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
		animation: cmd-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
	}

	.cmd-progress-status-exception .cmd-progress-bg {
		background-color: #f5222d;
	}

	.cmd-progress-status-exception .cmd-progress-text {
		color: #f5222d;
	}

	.cmd-progress-status-exception .cmd-progress-circle-path {
		stroke: #f5222d;
	}

	.cmd-progress-status-success .cmd-progress-bg {
		background-color: #52c41a;
	}

	.cmd-progress-status-success .cmd-progress-text {
		color: #52c41a;
	}

	.cmd-progress-status-success .cmd-progress-circle-path {
		stroke: #52c41a;
	}

	.cmd-progress-circle .cmd-progress-inner {
		position: relative;
		line-height: 1;
		background-color: transparent;
	}

	.cmd-progress-circle .cmd-progress-text {
		display: block;
		position: absolute;
		width: 100%;
		text-align: center;
		line-height: 1;
		top: 50%;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
		left: 0;
		margin: 0;
		color: rgba(0, 0, 0, 0.65);
		white-space: normal;
	}

	.cmd-progress-circle .cmd-progress-status-exception .cmd-progress-text {
		color: #f5222d;
	}

	.cmd-progress-circle .cmd-progress-status-success .cmd-progress-text {
		color: #52c41a;
	}

	@keyframes cmd-progress-active {
		0% {
			opacity: 0.1;
			width: 0;
		}

		20% {
			opacity: 0.5;
			width: 0;
		}

		100% {
			opacity: 0;
			width: 100%;
		}
	}
</style>
