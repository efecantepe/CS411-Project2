const express = require('express');
const app = express();
const port = 7000;
const fs = require('fs')

var cors = require('cors');
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello from your simple Express server!');
});

app.post('/', (req,res) => {
    let nameUrl = req.body
    const data = JSON.parse(fs.readFileSync('bookmark.json', 'utf8'))
    console.log(data)
    data.bookmarks.push(nameUrl)
    fs.writeFileSync('bookmark.json', JSON.stringify(data), 'utf8')
    res.send(200)
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
