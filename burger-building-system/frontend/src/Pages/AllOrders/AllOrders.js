import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios';
import MaterialTable from "material-table";
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import tableIcons from '../../assets/js/MateralTableIcons';

const AllOrders = ({ email }) => {
    const [loading, setLoading] = React.useState(false);

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
        const body = JSON.stringify({ 'email': email });

        axios.post(`http://localhost:8000/api/all-orders/`, body, config)
            .then(res => {
                setTableData(res.data.orders);
                setLoading(false);
            })
            .catch(err => {
                toast.error("something went wrong");
                setLoading(false);

            });

    }, [email]);
    React.useEffect(() => {
        getData();
    }, [getData]);


    const columns = [
        { title: "Order Id", field: "order_id", filtering: true, filterPlaceholder: "Filter by Id", align: 'center', width: '30%' },
        { title: "Transaction Id", field: "transactionId", filtering: true, filterPlaceholder: "Filter by Id", align: 'center', width: '30%' },
        { title: "Total Price", field: "total_price", filterPlaceholder: "Filter by Price", filtering: true, sorting: true, align: 'center', width: '15%' },
        {
            title: "Delivered", field: "delivered", sorting: true, align: 'center', filtering: false, width: '15%'
        },

    ];
    const handleDetails = (data) => {
        navigate('/user-order/' + data.id + '/detail');

    };
    return (
        <div className='table-wrapper'>
            {loading ? <HashLoader speedMultiplier={1.5} color={'#262626'} style={{ marginLeft: "50%" }} size={100} /> :
                tableData !== null ?
                    <MaterialTable style={{ width: 700, margin: "25px auto" }} title="Order table" icons={tableIcons} columns={columns} data={tableData}
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
                                icon: () => <VisibilityIcon />,
                                tooltip: "details",
                                onClick: (e, data) => handleDetails(data),
                            }]}

                    /> : <p>Please order something</p>
            }
        </div>
    );
};
const mapStateToProps = state => ({
    email: state.auth.user.email

});
export default connect(mapStateToProps,)(AllOrders);