<template>
	<view class="model-list">
		<view v-for="model in modelList" :key="model.id"
			class="model-item color_919397"
			:class="{active: modelId == model.id}"
			@tap="choiceModel(model)">{{model.name}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modelList: [],
				modelId: ''
			};
		},
		onLoad ({ orgId, modelId, type }) {
			console.log(type)
			this.modelId = modelId
			this.$http.get(`dms/recruit/mail/get_by_so/${orgId}`).then(({ data }) => {
				if (data.code === 0) {
					let list = []
					for (let i = 0; i < data.data.length; i++) {
						if (data.data[i].type == type) {
							list.push(data.data[i])
						}
					}
					this.modelList = list
				}
			})
		},
		methods: {
			choiceModel (model) {
				uni.$emit('model-choice', model)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.model-list {
		.model-item {
			position: relative;
			height: 108rpx;
			line-height: 108rpx;
			text-align: center;
			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				border-bottom: 1rpx solid #EFF0F1;
			}
			&.active {
				background-color: #F4F5F6;
			}
		}
	}
</style>
