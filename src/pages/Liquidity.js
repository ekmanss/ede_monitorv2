import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import {useState} from 'react';
import {shortAddress} from "./stringUtils"
import {timestampToTime} from "./timeUtils"

// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
} from '@mui/material';
import useIdo from "./useIdo";
import usePrices from "./usePrices"
import useLiquidity from "../hooks/useLiquidity";
import {edeBotExecutor} from "./address"
import useQueryLiquidity from "./useQueryLiquidity";
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import {UserListHead, UserListToolbar} from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
//redux

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'name', label: 'Address', alignRight: false},
    {id: 'liquidationPrice', label: 'liquidationPrice', alignRight: false},
    {id: 'createTime', label: 'CreateTime', alignRight: false},
    {id: 'size', label: 'Size', alignRight: false},
    {id: 'averagePrice', label: 'AveragePrice', alignRight: false},
    {id: 'collateral', label: 'Collateral', alignRight: false},
    {id: 'leverage', label: 'Leverage', alignRight: false},
    {id: ''},
    // {id: 'lastTime', label: 'LastTime', alignRight: false},
    // {id: 'taskStatus', label: 'TaskStatus', alignRight: false},
];


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    if (!array) {
        array = []
    }
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {

    const {harvestPost} = useLiquidity()

    let USERLIST = [];

    // const {
    //     all
    // } = useIdo(edeBotExecutor)
    // USERLIST = all;

    const {all} = usePrices()
    // console.log("price all", all)

    const [currentPair, setCurrentPair] = useState("ETH_SHORT");
    const [currentRow, setCurrentRow] = useState(null);

    const TokenList = {
        "ETH": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        "BTC": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        "BNB": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
    }

    const {
        BTCLong, BTCShort,
        ETHLong, ETHShort,
        BNBLong, BNBShort
    } = useQueryLiquidity(TokenList);
    // console.log("ETHLong", ETHLong)
    // console.log("ETHShort", ETHShort)

    if (currentPair === "BTC_LONG") {
        if (BTCLong) {
            USERLIST = BTCLong;
        }
    } else if (currentPair === "BTC_SHORT") {
        if (BTCShort) {
            USERLIST = BTCShort;
        }
    } else if (currentPair === "ETH_LONG") {
        if (ETHLong) {
            USERLIST = ETHLong;
        }
    } else if (currentPair === "ETH_SHORT") {
        if (ETHShort) {
            USERLIST = ETHShort;
        }
    } else if (currentPair === "BNB_LONG") {
        if (BNBLong) {
            USERLIST = BNBLong;
        }
    } else if (currentPair === "BNB_SHORT") {
        if (BNBShort) {
            USERLIST = BNBShort;
        }
    }


    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleOpenMenu = (event,row) => {
        setOpen(event.currentTarget);
        setCurrentRow(row);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    const handlToken = (tokenPair) => {
        console.log("handlToken", tokenPair)
        setCurrentPair(tokenPair)
    }

    const harvest = async ({account, collateralToken, indexToken, isLong}) => {
        await harvestPost(account, collateralToken, indexToken, isLong);
    }

    return (
        <>
            <Helmet>
                <title> User | Minimal UI </title>
            </Helmet>

            <Container>

                <a className="twitter-share-button"
                   href="https://twitter.com/intent/tweet?text=Hello%20world&url=https://baidu.com&hashtags=TwitterDev&via=TwitterDev"
                   data-size="large">
                    Tweet
                </a>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h5" gutterBottom>
                        BTC:{(Number(all.BTCUSDT) / 10 ** 30).toFixed(2)}
                    </Typography>

                    <Typography variant="h5" gutterBottom>
                        ETH:{(Number(all.ETHUSDT) / 10 ** 30).toFixed(2)}
                    </Typography>

                    <Typography variant="h5" gutterBottom>
                        BNB:{(Number(all.BNBUSDT) / 10 ** 30).toFixed(2)}
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h6" gutterBottom color={currentPair === "BTC_LONG" ? "red" : null}
                                onClick={() => {
                                    handlToken("BTC_LONG")
                                }
                                }>
                        BTC_LONG({BTCLong ? BTCLong.length : 0})
                    </Typography>

                    <Typography variant="h6" gutterBottom color={currentPair === "BTC_SHORT" ? "red" : null}
                                onClick={() => {
                                    handlToken("BTC_SHORT")
                                }
                                }>
                        BTC_SHORT({BTCShort ? BTCShort.length : 0})
                    </Typography>

                    <Typography variant="h6" gutterBottom color={currentPair === "ETH_LONG" ? "red" : null}
                                onClick={() => {
                                    handlToken("ETH_LONG")
                                }
                                }>
                        ETH_LONG({ETHLong ? ETHLong.length : 0})
                    </Typography>

                    <Typography variant="h6" gutterBottom color={currentPair === "ETH_SHORT" ? "red" : null}
                                onClick={() => {
                                    handlToken("ETH_SHORT")
                                }
                                }>
                        ETH_SHORT({ETHShort ? ETHShort.length : 0})
                    </Typography>

                    <Typography variant="h6" gutterBottom color={currentPair === "BNB_LONG" ? "red" : null}
                                onClick={() => {
                                    handlToken("BNB_LONG")
                                }
                                }>
                        BNB_LONG({BNBLong ? BNBLong.length : 0})
                    </Typography>

                    <Typography variant="h6" gutterBottom color={currentPair === "BNB_SHORT" ? "red" : null}
                                onClick={() => {
                                    handlToken("BNB_SHORT")
                                }
                                }>
                        BNB_SHORT({BNBShort ? BNBShort.length : 0})
                    </Typography>
                </Stack>

                <Card>
                    {/*<UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />*/}

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={USERLIST.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        // console.log("rowwww", row)
                                        const {
                                            id,
                                            taskName,
                                            chainId,
                                            avatarUrl,
                                            address,
                                            balance,
                                            status,
                                            timeStamp,
                                            account,
                                            liquidationPrice,
                                            averagePrice,
                                            indexToken,
                                            size,
                                            collateral,
                                            timestamp
                                        } = row;
                                        const selectedUser = selected.indexOf(taskName) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser}>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>

                                                        <Typography variant="subtitle2" noWrap>
                                                            < a
                                                                href={'https://bscscan.com/address/' + account}
                                                                target="_Blank">{shortAddress(account)}</a>
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell
                                                    align="left">{Number(liquidationPrice).toFixed(2)}
                                                </TableCell>

                                                <TableCell align="left">
                                                    {timestampToTime(timestamp)}
                                                </TableCell>


                                                <TableCell align="left">{Number(size).toFixed(2)}</TableCell>
                                                <TableCell align="left">{Number(averagePrice).toFixed(2)}</TableCell>
                                                <TableCell align="left">{Number(collateral).toFixed(2)}</TableCell>
                                                <TableCell
                                                    align="left">X {Number(Number(size) / Number(collateral)).toFixed(2)}</TableCell>


                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={(e)=>handleOpenMenu(e,row)}>
                                                        <Iconify icon={'eva:more-vertical-fill'}/>
                                                    </IconButton>
                                                </TableCell>

                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br/> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={USERLIST.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={
                    () => {
                        harvest(currentRow);
                    }
                }>
                    <Iconify icon={'eva:done-all-fill'} sx={{mr: 2}}/>
                    Harvest
                </MenuItem>

                {/*<MenuItem sx={{color: 'error.main'}}>*/}
                {/*    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>*/}
                {/*    Delete*/}
                {/*</MenuItem>*/}
            </Popover>
        </>
    );
}
