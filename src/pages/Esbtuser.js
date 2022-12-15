import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import {useState} from 'react';

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
import useQueryESBT from "./useQueryESBT";
import {edeBotExecutor} from "./address"
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import {UserListHead, UserListToolbar} from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';
import {shortAddress} from "./stringUtils"
import {ethers} from "ethers";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'address', label: 'Address', alignRight: false},
    {id: 'totalPoints', label: 'TotalPoints', alignRight: false},
    {id: 'invitedTimestamp', label: 'InvitedTime', alignRight: false},
    {id: 'parent', label: 'Parent', alignRight: false},
    {id: 'sons', label: 'Sons', alignRight: false},

];

// ----------------------------------------------------------------------
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
}

// ----------------------------------------------------------------------


function descendingComparator(a, b, orderBy) {

    if(orderBy === "totalPoints"){
        if (Number(b[orderBy]) < Number(a[orderBy])) {
            return -1;
        }
        if (Number(b[orderBy]) > Number(a[orderBy])) {
            return 1;
        }
    }else{
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
    }

    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.address.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {

    let USERLIST = [];
    // const {
    //     all
    // } = useIdo(edeBotExecutor)
    // USERLIST = all;
    // console.log("all!!", USERLIST);

    const {accounts,commonDataStore} = useQueryESBT();
    console.log("***accounts",accounts);
    USERLIST = accounts;

    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('desc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('totalPoints');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
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

    return (
        <>
            <Helmet>
                <title> User | Minimal UI </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Total: {commonDataStore.value}
                    </Typography>
                </Stack>

                <Card>

                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
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
                                        console.log("rowwww", row)
                                        const {
                                            id,
                                            taskName,
                                            chainId,
                                            avatarUrl,
                                            address,
                                            balance,
                                            status,
                                            timeStamp,
                                            parent,
                                            sons,
                                            invitedTimestamp,
                                            totalPoints
                                        } = row;
                                        const selectedUser = selected.indexOf(taskName) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser}>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={taskName} src={avatarUrl}/>
                                                        <Typography variant="subtitle2" noWrap>
                                                            < a
                                                                href={'https://bscscan.com/address/' + address}
                                                                target="_Blank">{shortAddress(address)}</a>
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{totalPoints}</TableCell>

                                                <TableCell align="left">{timestampToTime(invitedTimestamp)}</TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Table direction="row" alignItems="center" spacing={2}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            < a
                                                                href={'https://bscscan.com/address/' + parent.address}
                                                                target="_Blank">{shortAddress(parent.address)}</a>
                                                        </Typography>
                                                    </Table>
                                                </TableCell>


                                                <TableCell component="th" scope="row" padding="none">
                                                    <Table direction="row" alignItems="center" spacing={2}>

                                                        {
                                                            sons.map((son) => {
                                                                return (
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        < a
                                                                            href={'https://bscscan.com/address/' + son.address}
                                                                            target="_Blank">{shortAddress(son.address)}</a>
                                                                    </Typography>
                                                                )
                                                            })
                                                        }

                                                    </Table>
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
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
                    Edit
                </MenuItem>

                <MenuItem sx={{color: 'error.main'}}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}
