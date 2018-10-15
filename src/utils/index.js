function arrayFormatter(arr) {
	let originArr = arr;
	const titleArray = originArr.shift();
	let tempObj = {};
	// 设置头信息
	tempObj._declaration = {
		_attributes: {
			version: "1.0",
			encoding: "GB2312"
		}
	};
	tempObj.Data = {
		_attributes: {
			INFO: "YIKAIFAPIAO"
		},
		YKFP: {
			Row: []
		}
	};
	// 疯狂输出
	originArr.forEach((row, index) => {
		// 每一行
		let tempLine = {};
		row.forEach((attr, index2) => {
			// 每一行的每一个属性
			tempLine[titleArray[index2]] = attr;
		});
		tempObj.Data.YKFP.Row.push({
			"_attributes": tempLine
		})
	});
	
	return JSON.stringify(tempObj);
}

export { arrayFormatter }
