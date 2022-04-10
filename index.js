const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('* any are.na channel url *');
	await page.evaluate(async () => {
		await new Promise((resolve, reject) => {
			let totalHeight = 0;
			let distance = 100;
			let timer = setInterval(() => {
				let scrollHeight = document.body.scrollHeight;
				window.scrollBy(0, distance);
				totalHeight += distance;

				if (totalHeight >= scrollHeight) {
					clearInterval(timer);
					resolve();
				}
			}, 500);
		});
	});
	await page.waitForSelector('img');
	const imageUrls = await page.evaluate(() => {
		const imageUrls = Array.from(document.querySelectorAll('img')).map(
			(img) => {
				const srcset = img.srcset;
				const src = srcset.match(/2x,\s(.*)\s/)[1];
				return src;
			}
		);
		return imageUrls;
	});
	imageUrls.forEach((url, index) => {
		https.get(url, (res) => {
			res.pipe(
				fs.createWriteStream(path.join(__dirname, `images/${index}.jpg`))
			);
		});
	});

	await browser.close();
})();
