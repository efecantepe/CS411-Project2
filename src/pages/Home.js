import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DoneIcon from '@mui/icons-material/Done';
import {
	Box,
	Divider,
	IconButton,
	InputAdornment,
	MenuItem,
	MenuList,
	Popover,
	TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from '../axios_config';

const PageLayoutRoot = styled('div')(({ theme }) => ({
	display: 'flex',
	flex: '1 1 auto',
	maxWidth: '100%',
	paddingTop: 10,
}));

const Home = () => {
	const [anchorEl, setAnchorEl] = useState(null);

	const [url, setUrl] = useState('');
	const [html, setHtml] = useState('');

	const [bookmarks, setBookmarks] = useState([]);

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onChangeUrl = (e) => {
		setUrl(e.target.value);
	};

	useEffect(() => {
		getBookmarks();
	}, []);

	const getPage = async () => {
		const request = { url: url };
		await axios
			.post('/getSite', request)
			.then((res) => {
				if (res) {
					console.log(res)
					setUrl(res.data.url)
					setHtml(res.data.html)
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const getPageInstant = async (url_inst) => {
		const request = { url: url_inst };
		await axios
			.post('/getSite', request)
			.then((res) => {
				if (res) {
					console.log(res)
					setUrl(res.data.url)
					setHtml(res.data.html)
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const getPrevPage = async () => {
		await axios
			.get('/getPrevious')
			.then((res) => {
				if (res && res.data) {
					setHtml(res.data.html)
					setUrl(res.data.url)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					alert('Connection error');
				}
			});
	};
	const getNextPage = async () => {
		await axios
			.get('/getNext')
			.then((res) => {
				if (res && res.data) {
					setHtml(res.data.html)
					setUrl(res.data.url)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					alert('Connection error');
				}
			});
	};
	
	const getBookmarks = async () => {
		await axios
			.get('/getBookmarks')
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
					let arr = [];
					for (let i = 0; i < res.data.length; i++) {
						arr.push(res.data[i]);
					}
					setBookmarks(arr);
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					alert('Connection error');
				}
			});
	};

	const addBookmark = async () => {
		const request = { url: url };
		await axios
			.post('/addBookmark', request)
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
					getBookmarks()
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log(err.response.data.msg)
					alert('Error: '+ err.response.data.msg);
				} else {
					alert('Connection error');
				}
			});
	};
	const removeBookmark = async () => {
		const request = { url: url };
		await axios
			.post('/deleteBookmark', request)
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
					getBookmarks()
				}
			})
			.catch((err) => {
				if (err && err.response) {
					alert('Error: '+ err.response.data.msg);
				} else {
					alert('Connection error');
				}
			});
	};
	return (
		<>
			<title></title>
			<PageLayoutRoot>
				<Box
					component="main"
					sx={{
						display: 'flex',
						flex: '1 1 auto',
						flexDirection: 'column',
						width: '100%',
						flexGrow: 1,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
						<Box>
							<IconButton onClick={getPrevPage}>
								<ArrowBackIcon />
							</IconButton>
							<IconButton onClick={getNextPage}>
								<ArrowForwardIcon />
							</IconButton>
						</Box>
						<Box>
							<TextField
								onChange={onChangeUrl}
								value={url}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={getPage}>
												<DoneIcon />
											</IconButton>
										</InputAdornment>
									),
								}}
							>
								{url}
							</TextField>
						</Box>
						<Box>
							<IconButton onClick={addBookmark}>
								<BookmarkAddIcon />
							</IconButton>
							<IconButton onClick={removeBookmark}>
								<BookmarkRemoveIcon />
							</IconButton>
							<IconButton
								aria-describedby={id}
								variant="contained"
								onClick={handleClick}
							>
								<BookmarksIcon />
							</IconButton>
							<Popover
								id={id}
								open={open}
								anchorEl={anchorEl}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'left',
								}}
							>
								<MenuList>
									{bookmarks.map((bookmark, index) => (
										<MenuItem
											key={index}
											value={bookmark.url}
											onClick={() => {
												getPageInstant(bookmark.url)
												handleClose()
											}}
										>
											{bookmark.name + ' | ' + bookmark.url}
										</MenuItem>
									))}
								</MenuList>
							</Popover>
						</Box>
					</Box>
					<Divider sx={{mt:3}}/>
					<Box>
						<div
							dangerouslySetInnerHTML={{ __html: html }}
							style={{
								minWidth: '1400px',
								minHeight: '800px',
							}}
						></div>
					</Box>
				</Box>
			</PageLayoutRoot>
		</>
	);
};
export default Home;
