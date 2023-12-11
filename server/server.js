const express = require('express');
const app = express();
const port = 7000;
const fs = require('fs');
const got = require('got');

var cors = require('cors');
app.use(cors());
app.use(express.json());

var previousPages = []
var nextPages = []

app.get('/', (req, res) => {
	res.send('Hello from your simple Express server!');
});

app.get('/getBookmarks', (req, res) => {
	const data = JSON.parse(fs.readFileSync('server/bookmark.json', 'utf8'));
	let bookmarks = data.bookmarks;

	res.send(bookmarks);
});

app.post('/addBookmark', (req, res) => {
	let url = req.body.url;
	let name = getDomainName(url)
	const data = JSON.parse(fs.readFileSync('server/bookmark.json', 'utf8'));
	if (!url) {
		res.status(400).send({"msg":"Missing URL!"})
	} else if (data.bookmarks.filter((bookmark) => bookmark.url === url).length > 0) {
		res.status(400).send({"msg":"Bookmark already exists!"})	
	}  else {
		console.log(data);
		data.bookmarks.push({"name":name,"url":url});
		fs.writeFileSync('server/bookmark.json', JSON.stringify(data), 'utf8');
		res.sendStatus(200);
	}
});

app.post('/deleteBookmark', (req, res) => {
	let url = req.body.url;
	let data = JSON.parse(fs.readFileSync('server/bookmark.json', 'utf8'));
	if (!url) {
		res.status(400).send({"msg":"Missing URL!"})
	} else if (data.bookmarks.filter((bookmark) => bookmark.url === url).length === 0) {
		res.status(400).send({"msg":"Bookmark does not exist!"})	
	} else {
		data.bookmarks = data.bookmarks.filter((bookmark) => bookmark.url !== url)
		fs.writeFileSync('server/bookmark.json', JSON.stringify(data), 'utf8');
		res.sendStatus(200);
	}
});

app.post('/getSite', (req,res) => {
	let url = req.body.url
	let ensuredUrl = ensureUrl(url)
	got(ensuredUrl)
		.then(result => {
			res.send({"url":ensuredUrl,"html":result.body})
			previousPages.push(ensuredUrl)
			if (nextPages.length !== 0) {
				nextPages = []
			}
		})
		.catch(err => {
			res.send({"url":"","html":"<h1>404 Not Found Error</h1>"});
		});
})

app.get('/getPrevious', (req,res) => {
	console.log(previousPages)
	console.log(nextPages)
	nextPages.push(previousPages.pop())
	let preUrl = previousPages[previousPages.length - 1]
	if (preUrl) {
		got(preUrl)
			.then(result => {
				res.send({"url":preUrl,"html":result.body})
			})
			.catch(err => {
				res.send({"url":"","html":"<h1>404 Not Found Error</h1>"});
			});
	} else {
		res.send({"url":"","html":"<h1>404 Not Found Error</h1>"});
	}
})

app.get('/getNext', (req,res) => {
	previousPages.push(nextPages.pop())
	let preUrl = previousPages[previousPages.length - 1]
	console.log(preUrl)
	if (preUrl) {
		got(preUrl)
			.then(result => {
				res.send({"url":preUrl,"html":result.body})
			})
			.catch(err => {
				res.send({"url":"","html":"<h1>404 Not Found Error</h1>"});
			});
	} else {
		res.send({"url":"","html":"<h1>404 Not Found Error</h1>"});
	}
})

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

function ensureUrl(url) {
	var ensured = ""
	if (url.substring(0,5) === "https") {
		ensured = url
	} else if (url.substring(0,4) === "http") {
		ensured = url.substring(0,4) + "s" + url.substring(4)
	} else if (url.substring(0,3) === "www") {
		ensured = "https://" + url
	} else {
		ensured = "https://" + url
	}
	return ensured
} 

function getDomainName(url) {
	var domain = ""
	if (url.substring(0,5) === "https") {
		domain = url.substring(8)
	} else if (url.substring(0,4) === "http") {
		domain = url.substring(7)
	} else if (url.substring(0,3) === "www") {
		domain = url.substring(4)
	} else {
		domain = url
	}
	return domain.split(".", 1)[0]
}

function filterArrays(arr1, arr2) {
	console.log(arr1, arr2);
	let result = [];

	for (let a = 0; a < arr1.length; a++) {
		let flag = false;

		for (let b = 0; b < arr2.length; b++) {
			if (JSON.stringify(arr1[a]) === JSON.stringify(arr2[b])) {
				flag = true;
				break;
			}
		}

		if (flag == false) {
			result.push(arr1[a]);
		}
	}

	return result;
}
