const express = require('express');
const app = express();
const port = 7000;
const fs = require('fs');

var cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello from your simple Express server!');
});

app.get('/getBookmarks', (req, res) => {
	const data = JSON.parse(fs.readFileSync('server/bookmark.json', 'utf8'));
	let bookmarks = data.bookmarks;

	res.send(bookmarks);
});

app.post('/addBookmark', (req, res) => {
	let nameUrl = req.body;
	console.log('URL:', nameUrl);
	const data = JSON.parse(fs.readFileSync('server/bookmark.json', 'utf8'));
	console.log(data);
	data.bookmarks.push(nameUrl);
	fs.writeFileSync('server/bookmark.json', JSON.stringify(data), 'utf8');
	res.sendStatus(200);
});

app.post('/deleteBookmark', (req, res) => {
	console.log(req.body);
	let deleteBookmark = req.body.deletedBookmark;
	let data = JSON.parse(fs.readFileSync('bookmark.json', 'utf8'));
	if (typeof deleteBookmark === undefined || deleteBookmark.length === 0) {
		data.bookmarks = [];
	} else {
		console.log('Else');
		data.bookmarks = filterArrays(data.bookmarks, deleteBookmark);
	}

	//console.log(data.bookmarks)

	fs.writeFileSync('bookmark.json', JSON.stringify(data), 'utf8');
	res.send(200, data.bookmarks);
});

//app.post('/')

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

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
