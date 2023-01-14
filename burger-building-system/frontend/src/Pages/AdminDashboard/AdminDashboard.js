import VisibilityIcon from '@material-ui/icons/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import MaterialTable from "material-table";
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import tableIcons from '../../assets/js/MateralTableIcons';
import './AdminDashboard.css';

const AdminDashboard = ({ email }) => {
    const [loading, setLoading] = React.useState(false);
    const [storeData, setStoreData] = React.useState(true);
    const [tableData, setTableData] = React.useState(null);
    const navigate = useNavigate();
    console.log(email);
    const getData = React.useCallback(async () => {
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios.get(`http://localhost:8000/api/admin/all-orders/`, config)
            .then(res => {
                setTableData(res.data.orders);
                setLoading(false);
            })
            .catch(err => {
                toast.error("something went wrong");
                setLoading(false);

            });

    }, []);
    const getStoreData = React.useCallback(async () => {
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios.get(`http://localhost:8000/api/admin/check-open/`, config)
            .then(res => {

                setStoreData(res.data.open.open);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
            });

    }, []);
    React.useEffect(() => {
        getData();
        getStoreData();
    }, [getData, getStoreData]);


    const columns = [
        { title: "Order Id", field: "order_id", filtering: true, filterPlaceholder: "Filter by Id", align: 'center', width: '40%' },
        { title: "Total Price", field: "total_price", filterPlaceholder: "Filter by Price", filtering: true, sorting: true, align: 'center', width: '30%' },
        {
            title: "Delivered", field: "delivered", sorting: true, align: 'center', filtering: false, width: '15%'
        },

    ];
    const handleDetails = (data) => {
        navigate('/admin-order/' + data.id + '/detail');
    };
    const handleAccept = (data) => {
        Swal.fire({
            title: 'You are accepting this order',
            text: data.order_id,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2FB186',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Accept'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const body = JSON.stringify({ 'email': email, 'id': data.id });
                axios.post(`http://localhost:8000/api/admin/accept-order/`, body, config)
                    .then(res => {
                        getData();
                        setLoading(false);
                        Swal.fire(
                            'Delivered!',
                            'Order successfully delivered',
                            'success'
                        );
                    })
                    .catch(err => {
                        setLoading(false);
                        Swal.fire(
                            'Delivered!',
                            'Order successfully delivered',
                            'error'
                        );
                    });
            }
        });
    };
    const handleActivate = () => {
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios.get(`http://localhost:8000/api/admin/open-store/`, config)
            .then(res => {
                console.log(res.data.open, 'open');
                setStoreData(res.data.open);
                setLoading(false);
                toast.success("successfully openned the shop");

            })
            .catch(err => {
                setLoading(false);
                toast.error("something went wrong");
            });
    };
    const handleReject = () => {
        setLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        axios.get(`http://localhost:8000/api/admin/close-store/`, config)
            .then(res => {
                console.log(res.data.open, 'close');
                setStoreData(res.data.open);
                setLoading(false);
                toast.success("successfully closed the shop");

            })
            .catch(err => {
                setLoading(false);
                toast.error("something went wrong");

            });
    };
    return (
        <div className='table-wrapper'>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
                {!storeData ? <button onClick={handleActivate} class="activateButton" >Click to Activate the Store</button> : <button onClick={handleReject} class="rejectButton" >Click to Close the Store</button>}
            </div>

            {loading ? <HashLoader speedMultiplier={1.5} color={'#262626'} style={{ marginLeft: "50%" }} size={100} /> :
                tableData !== null ?
                    <MaterialTable style={{ width: 700, margin: "25px auto" }} title="Order List for Admin" icons={tableIcons} columns={columns} data={tableData}
                        options={{

                            sorting: true, search: true,
                            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                            filtering: true, paging: true, pageSizeOptions: [2, 5, 10, 20], pageSize: 5,
                            paginationType: "normal", showFirstLastPageButtons: true, paginationPosition: "bottom", exportButton: false,
                            exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                            showSelectAllCheckbox: false, showTextRowsSelected: false,
                            columnsButton: false,
                            rowStyle: {
                                fontSize: 16,
                            }

                        }}
                        localization={{
                            header: {
                                actions: 'Action',
                            }
                        }}
                        actions={[
                            {
                                icon: () => <VisibilityIcon style={{ color: 'orange' }} />,
                                tooltip: "Details",
                                onClick: (e, data) => handleDetails(data),
                            },
                            {
                                icon: () => <CheckCircleIcon style={{ color: 'green' }} />,
                                tooltip: "Accept",
                                onClick: (e, data) => handleAccept(data),
                            }
                        ]}

                    /> : <p>Something went wrong</p>
            }
        </div>
    );
};
const mapStateToProps = state => ({
    email: state.auth.user.email

});
export default connect(mapStateToProps,)(AdminDashboard);