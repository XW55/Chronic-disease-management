<template>
	<view class="main" v-if="deviceElectricity">
		<image v-if="Number(this.deviceElectricity) <= 20" class="battery" src="../static/b0.png" />
		<image v-if="20 < Number(this.deviceElectricity) && Number(this.deviceElectricity) <= 40" class="battery"
			src="../static/b25.png" />
		<image v-if="40 < Number(this.deviceElectricity) && Number(this.deviceElectricity) <= 60" class="battery"
			src="../static/b50.png" />
		<image v-if="60 < Number(this.deviceElectricity) && Number(this.deviceElectricity) <= 80" class="battery"
			src="../static/b75.png" />
		<image v-if="80 < Number(this.deviceElectricity) && Number(this.deviceElectricity) <= 100" class="battery"
			src="../static/b100.png" />
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex'
	export default {
		computed: {
			...mapState({
				deviceElectricity: (state) => state.deviceElectricity,
			})
		}
	}
</script>

<style scoped>
	view {
		box-sizing: border-box;
	}

	.main {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 24rpx;
		margin-left: 4rpx;
		overflow: hidden;
	}

	.battery {
		width: 62rpx;
		height: 24rpx;
	}
</style>
