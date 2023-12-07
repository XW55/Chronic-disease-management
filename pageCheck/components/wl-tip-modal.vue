<template>
	<view class="mask" v-if="isShow">
		<view class="main">
			<view class="tip-container">
				<text class="title" v-if="title">{{ title }}</text>
				<text class="tip">{{tip}}</text>
			</view>
			<view class="btns">
				<view class="btn" @click="clickBtn(false)" v-if="!noCancel">{{cancelText}}</view>
				<view class="btn took" @click="clickBtn(true)">{{sureBtn}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: '提示'
			},
			tip: {
				type: String,
				default: ''
			},
			cancelText: {
				type: String,
				default () {
					return '取消'
				}
			},
			sureText: {
				type: String,
				default () {
					return '确定'
				}
			},
			noCancel: {
				type: Boolean,
				default () {
					return false
				}
			},
			countDown: {
				type: Number,
				default () {
					return 0
				}
			}
		},
		data() {
			return {
				timer: null,
				baseCountDown: null
			}
		},
		watch: {
			isShow: function(newValue) {
				if (newValue) {
					if (this.countDown != 0) {
						this.baseCountDown = this.countDown
					}
					this.setCountDown()
				}
			},
		},
		computed: {
			sureBtn() {
				if (this.baseCountDown) {
					return this.sureText + " (" + this.baseCountDown + "s)"
				} else {
					return this.sureText
				}
			}
		},
		methods: {
			clickBtn(event) {
				this.$emit('confirm', event)
				if (this.timer) {
					clearInterval(this.timer)
					this.timer = null
				}
			},
			setCountDown() {
				if (this.baseCountDown) {
					this.timer = setInterval(() => {
						this.baseCountDown--
						if (this.baseCountDown == 0) {
							clearInterval(this.timer)
							this.timer = null
							this.$emit('confirm', true)
						}
					}, 1000)
				}
			}
		},
	}
</script>

<style scoped>
	.main {
		z-index: 20;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		width: 640rpx;
		min-height: 336rpx;
		height: auto;
		border-radius: 24rpx;
		background-color: #fff;
	}

	.tip-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 32rpx;
		border-bottom: 1rpx solid rgba(49, 56, 72, .15);
		word-wrap: break-word;
		word-break: break-all;
		overflow: hidden;
	}

	.tip {
		margin: 32rpx 0;
		color: #5F6470;
		font-size: 32rpx;
		line-height: 48rpx;
	}

	.btns {
		display: flex;
		justify-content: space-between;
		width: 640rpx;
		height: 112rpx;
	}

	.btn {
		flex-grow: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 200rpx;
		height: 112rpx;
		font-size: 32rpx;
		font-weight: bold;
	}

	.btn:nth-child(1) {
		border-right: 1rpx solid rgba(49, 56, 72, .15);
	}

	.took {
		color: #00D6DC;
	}

	.mask {
		z-index: 19;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .36);
	}

	.title {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
	}
</style>
