<template>
	<div class="select">
		<!--<button class="btn-select" @click="selectItem">选择</button>-->
		<input type="file" ref="file" value="选择文件">
		<button @click="convert">转换</button>
		<div class="selected-directory">selected path : {{dirPath}}</div>
	</div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
	name: 'Select',
	data() {
		return {
			dirPath: ''
		}
	},
	methods: {
		convert() {
			// console.log(this.$refs.file.files[0]['path']);
			ipcRenderer.send('read-file', this.$refs.file.files[0]['path']);
			ipcRenderer.on('event', (event, arg) => {
				console.log(event, arg);
			})
		},
		// selectItem() {
		// 	ipcRenderer.send('open-file-dialog');
		// 	ipcRenderer.on('selected-directory', (event, path) => {
		// 		this.dirPath = path
		// 	})
		// }
	}
}
</script>

<style type="text/scss" lang="scss" scoped>

</style>
