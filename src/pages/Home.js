import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DoneIcon from '@mui/icons-material/Done';
import {
	Box,
	Grid,
	IconButton,
	InputAdornment,
	MenuItem,
	MenuList,
	Popover,
	TextField,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from '../axios_config';

const PageLayoutRoot = styled('div')(({ theme }) => ({
	maxWidth: false,
	width: '100vm',
	height: '100vh',
	backgroundColor: theme.palette.background.default,
	justifyContent: 'center',
}));

const Home = () => {
	const [anchorEl, setAnchorEl] = useState(null);

	const [url, setUrl] = useState('');
	const [html, setHtml] = useState('');

	const [bookmarks, setBookmarks] = useState([
		{ name: 'Google', url: 'www.google.com' },
		{ name: 'YouTube', url: 'www.youtube.com' },
		{ name: 'Facebook', url: 'www.facebook.com' },
	]);

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

	const onClickUrl = (e) => {
		console.log(e.target.value);
		//setUrl(e.target.value);
	};

	useEffect(() => {
		const getBookmarks = async () => {
			await axios
				.get('/')
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
		getBookmarks();
	}, []);

	const getPage = async () => {
		const request = { url: url };
		console.log(request);
		await axios
			.post('/', request)
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
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

	const getPrevPage = async () => {
		await axios
			.get('/')
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
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
			.get('/')
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
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
			.post('/', request)
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
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
	const removeBookmark = async () => {
		const request = { url: url };
		await axios
			.post('/', request)
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
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
	return (
		<>
			<title></title>
			<PageLayoutRoot>
				<Box
					component="main"
					sx={{
						display: 'flex',
						width: '100%',
						height: '100%',
					}}
				>
					<Grid
						container
						direction="column"
						alignItems="center"
						justifyContent="center"
						spacing={5}
					>
						<Grid
							container
							item
							sx={{}}
							direction="row"
							alignItems="top"
							justifyContent="center"
							spacing={50}
						>
							<Grid item>
								<IconButton onClick={getPrevPage}>
									<ArrowBackIcon />
								</IconButton>
								<IconButton onClick={getNextPage}>
									<ArrowForwardIcon />
								</IconButton>
							</Grid>
							<Grid item>
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
							</Grid>
							<Grid item>
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
												key={bookmark.name}
												value={bookmark.url}
												onClick={() => setUrl(bookmark.url)}
											>
												{bookmark.name + ' ' + bookmark.url}
											</MenuItem>
										))}
									</MenuList>
								</Popover>
							</Grid>
						</Grid>
						<Grid
							container
							item
							direction="row"
							spacing={5}
							justifyContent="center"
						>
							<Grid item>
								<div
									dangerouslySetInnerHTML={{ __html: html }}
									style={{
										minWidth: '1400px',
										minHeight: '800px',
										border: 'thin solid black',
									}}
								></div>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</PageLayoutRoot>
		</>
	);
};
export default Home;
