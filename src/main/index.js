'use strict'

import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import excel from 'excel'
import { arrayFormatter } from '../utils'
// import convert from 'xml-js'
const convert = require('xml-js');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
	? `http://localhost:9080`
	: `file://${__dirname}/index.html`

// 创建主页面函数
function createWindow () {
	/**
   * Initial window options
   */
	mainWindow = new BrowserWindow({
		height: 563,
		useContentSize: true,
		width: 1000
	});

	mainWindow.loadURL(winURL)

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

// 打开output文件夹
function openOutput() {
	console.log('homeDir: ', os.homedir());
	console.log("filename:", path.resolve('./'));
	shell.showItemInFolder(path.resolve('./src/static/output/output.xml'))
}

// // xml文件创建成功提示页面
// function createSuccessWindow() {
// 	const modalPath = `file://${__dirname}/views/success.html`;
// 	let win = new BrowserWindow({frame: false})
//
// 	win.on('close', () => { win = null })
// 	win.loadURL(modalPath)
// 	win.show()
// }

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
});

ipcMain.on('read-file', (event, filePath) => {
	
	const fileName = path.parse(filePath).base;
	const fileData = fs.readFileSync(filePath);
	const dir = `${__dirname}/../static`;
	
	// 文件转存到指定目录
	fs.writeFileSync(`${dir}/${fileName}`, fileData);
	
	// excel转array
	excel(`${dir}/${fileName}`).then(data => {
		// array 格式化成指定结构json
		const jsonData = arrayFormatter(data);
		
		// json转xml
		const xmlData = convert.json2xml(jsonData, {compact: true});
		
		// 疯狂写入
		fs.writeFileSync(`${dir}/../static/output/output.xml`, xmlData);
		// fs.writeFileSync(`${os.homedir()}`, xmlData);
		
		// 弹窗提示
		// createSuccessWindow()
		
		// 打开文件夹
		openOutput()
		
	}).catch(e => {
		event.sender.send('event', 'error: ' + e);
	})
	
});
