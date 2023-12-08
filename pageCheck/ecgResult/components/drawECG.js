const printResolution = 600;

const getLineNumber = latticeNumber => (latticeNumber + 1) + (latticeNumber * 4);

function translateNum(num) {
	return num * (printResolution / 1200);
}

function getTextItem(text, positionX, positionY) {
	return {
		text,
		positionX,
		positionY
	};
}

function getGirdText(columnType, seconds) {
	let gridtext = "10mm/mV  ";
	if (columnType == 1) {
		gridtext = "5mm/mV  ";
	} else if (columnType == 4) {
		gridtext = "20mm/mV  ";
	}
	if (seconds == 12) {
		gridtext += "12.5mm/s";
	} else if (seconds == 6) {
		gridtext += "25mm/s";
	} else if (seconds == 3) {
		gridtext += "50mm/s";
	}
	return gridtext;
}

export function drawGraph(ctx, sig) {
	ctx.beginPath();
	ctx.setFillStyle("#ffffff");
	ctx.rect(0, 0, 600, 550);//starx,y width height
	ctx.fill();
	
	let seconds = 6
	let columnType = 2
	const topAreaHeight = 30;
	const offsetX = 78;
	squarewave(ctx, topAreaHeight, columnType);
	grid(ctx, offsetX, topAreaHeight, getGirdText(columnType, seconds));
	line3(ctx, offsetX, topAreaHeight);
	scale(ctx, offsetX, topAreaHeight, seconds, 1);
	ECGLine(ctx, offsetX, topAreaHeight, seconds, sig, columnType);
}

function squarewave(ctx, topHeight, columnType) {
	let positionX = 42;
	ctx.beginPath();
	ctx.setStrokeStyle("#F8C1BF");
	ctx.setLineWidth(translateNum(1));

	for (let i = 1; i < 6; i++) {
		ctx.moveTo(translateNum(positionX), translateNum(topHeight));
		ctx.lineTo(translateNum(positionX), translateNum(1040 + topHeight));
		positionX += 7.2;
	}
	ctx.stroke();

	let positionY = topHeight;
	for (let i = 0; i < getLineNumber(28); i++) {
		ctx.beginPath();
		if (i % 5 === 0) {
			ctx.setStrokeStyle("#F2847F");
			ctx.setLineWidth(translateNum(2));
		} else {
			ctx.setStrokeStyle("#F8C1BF");
			ctx.setLineWidth(translateNum(1));
		}
		ctx.moveTo(translateNum(42), translateNum(positionY));
		ctx.lineTo(translateNum(36 + 42), translateNum(positionY));
		positionY += 7.2;
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.setStrokeStyle("#F2847F");
	ctx.setLineWidth(translateNum(2));
	positionY += (getLineNumber(55) - 2) * 7.2;
	ctx.moveTo(translateNum(42), translateNum(topHeight));
	ctx.lineTo(translateNum(36 + 42), translateNum(topHeight));
	ctx.moveTo(translateNum(42), translateNum(1045 + topHeight));
	ctx.lineTo(translateNum(36 + 42), translateNum(1045 + topHeight));
	ctx.stroke();

	ctx.beginPath();
	ctx.setStrokeStyle("#F2847F");
	ctx.setLineWidth(translateNum(4));
	ctx.moveTo(translateNum(42), translateNum(topHeight));
	ctx.lineTo(translateNum(42), translateNum(1040 + topHeight));
	ctx.stroke();

	const lineHeight = 180;
	let yOffset = lineHeight;
	ctx.setStrokeStyle("#000000");
	ctx.setLineWidth(translateNum(1));
	ctx.beginPath();
	for (let i = 0; i < 5; i++) {
		ctx.moveTo(translateNum(42), translateNum(yOffset + topHeight));
		ctx.lineTo(translateNum(7.2) + translateNum(42), translateNum(yOffset + topHeight));
		ctx.lineTo(translateNum(7.2) + translateNum(42), translateNum(yOffset - (columnType * 36) + topHeight));
		ctx.lineTo(translateNum(28.8) + translateNum(42), translateNum(yOffset - (columnType * 36) + topHeight));
		ctx.lineTo(translateNum(28.8) + translateNum(42), translateNum(yOffset + topHeight));
		ctx.lineTo(translateNum(36) + translateNum(42), translateNum(yOffset + topHeight));
		yOffset += lineHeight;
	}
	ctx.stroke();
}

function grid(ctx, offsetX, topHeight, text) {
	ctx.setStrokeStyle("#F8C1BF");
	ctx.setLineWidth(translateNum(1));
	line2(ctx, offsetX, topHeight, 1);
	ctx.setStrokeStyle("#F2847F");
	ctx.setLineWidth(translateNum(2));
	line2(ctx, offsetX, topHeight, 5);
	ctx.fillStyle = "rgba(0, 0, 0, 0.87)";
	ctx.fillText(text, translateNum(720) + translateNum(offsetX), translateNum(62 + topHeight));
}

function line2(ctx, offsetX, topHeight, step) {
	let positionX = 0;
	ctx.beginPath();
	for (let i = 0; i < getLineNumber(30); i = i + step) {
		ctx.moveTo(positionX + translateNum(offsetX), translateNum(topHeight));
		ctx.lineTo(positionX + translateNum(offsetX), translateNum(1040 + topHeight));
		positionX += step * translateNum(7.2);
	}

	let positionY = 0;
	for (let i = 0; i < getLineNumber(29); i = i + step) {
		ctx.moveTo(translateNum(0) + translateNum(offsetX), translateNum(positionY + topHeight));
		ctx.lineTo(translateNum(1080) + translateNum(offsetX), translateNum(positionY + topHeight));
		positionY += step * (7.2);
	}
	ctx.stroke();
}

function line3(ctx, offsetX, topHeight) {
	ctx.setStrokeStyle("#F2847F");
	ctx.setLineWidth(translateNum(4));
	ctx.beginPath();
	ctx.moveTo(translateNum(offsetX), translateNum(topHeight));
	ctx.lineTo(translateNum(1080 + offsetX), translateNum(topHeight));
	ctx.lineTo(translateNum(1080 + offsetX), translateNum(1040 + topHeight));
	// ctx.lineTo(translateNum(offsetX), translateNum(1040 + topHeight));
	ctx.stroke();
}

function scale(ctx, offsetX, topHeight, seconds) {
	const lineHeight = 180;
	let autoHeight = lineHeight + 72;
	let startIndex = 0;
	ctx.setStrokeStyle("rgba(0, 0, 0, 0.3)");
	ctx.setLineWidth(translateNum(2));
	for (let i = 0; i < 5; i++) {
		// 水平直线
		ctx.beginPath();
		ctx.moveTo(translateNum(offsetX), translateNum(autoHeight + topHeight));
		ctx.lineTo(translateNum(1080 + offsetX), translateNum(autoHeight + topHeight));
		ctx.stroke();
		// 刻度
		let positionX = 0;
		for (let j = 0; j < seconds * 5; j++) {
			ctx.beginPath();
			ctx.moveTo(translateNum(positionX + offsetX), translateNum(autoHeight - 14 + topHeight));
			ctx.lineTo(translateNum(positionX + offsetX), translateNum(autoHeight + topHeight));
			ctx.stroke();
			positionX += (36 / (seconds / 6));
		}
		// 数字
		let numPositionX = 0;
		ctx.setTextAlign("center");
		for (let k = 0; k < (seconds + 1); k++) {
			ctx.setFontSize(translateNum(18));
			ctx.fillText(String(startIndex + k + seconds * i), translateNum(numPositionX + offsetX),
				translateNum(autoHeight + 20 + topHeight));
			numPositionX += (180 / (seconds / 6));
		}
		ctx.setTextAlign("left");
		autoHeight += lineHeight;
	}
}

function ECGLine(ctx, offsetX, topHeight, seconds, sig, columnType) {
	ctx.setStrokeStyle("#000000");
	ctx.lineCap = "round";
	ctx.setLineWidth(translateNum(1));
	ctx.beginPath();
	const LineHeight = 180;
	console.log(sig.length)
	for (let i = 0; i < 5; i++) {
		const yOffset = (i + 1) * LineHeight;
		const xStep = 1080 / (seconds * 500);
		if((i + 1) * seconds * 250 < sig.length){
			const sigData = sig.slice(i * seconds * 250, (i + 1) * seconds * 250);			
			drawRow(ctx, xStep, offsetX, yOffset, topHeight, sigData, 0, 1040, columnType);
		}else{
			const sigData = sig.slice(i * seconds * 250);			
			drawRow(ctx, xStep, offsetX, yOffset, topHeight, sigData, 0, 1040, columnType);
			break
		}
	}
	ctx.stroke();
}

function getPositionY(yValue, columnType) {
	return yValue / (540 / columnType) * -1;
}

function drawRow(ctx, xStep, offsetX, yOffset, topHeight, drawDataAry, top, bottom, columnType) {
	if (drawDataAry.length == 0) {
		return;
	}
	let positionX = 0;
	let positionY = getPositionY(drawDataAry[0], columnType) + yOffset;
	if (positionY < top || positionY > bottom) {
		positionY = Math.max(top, positionY);
		positionY = Math.min(bottom, positionY);
	}
	ctx.moveTo(translateNum(positionX + offsetX), translateNum(positionY + topHeight));
	let isNeedLine = true;
	for (let i = 1; i < drawDataAry.length; i++) {
		positionY = getPositionY(drawDataAry[i], columnType) + yOffset;
		if (positionY < top || positionY > bottom) {
			positionY = Math.max(top, positionY);
			positionY = Math.min(bottom, positionY);
			if (isNeedLine) {
				ctx.lineTo(translateNum(positionX + offsetX), translateNum(positionY + topHeight));
			} else {
				ctx.moveTo(translateNum(positionX + offsetX), translateNum(positionY + topHeight));
			}
			isNeedLine = false;
			positionX += 2 * xStep;
		} else {
			isNeedLine = true;
			ctx.lineTo(translateNum(positionX + offsetX), translateNum(positionY + topHeight));
			positionX += 2 * xStep;
		}
	}
}