import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios';
import MaterialTable from "material-table";
import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import tableIcons from '../../assets/js/MateralTableIcons';

const AcceptedOrders = ({ email }) => {
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

        axios.get(`http://localhost:8000/api/admin/all-accepted-orders/`, config)
            .then(res => {
                setTableData(res.data.orders);
                setLoading(false);
            })
            .catch(err => {
                toast.error("something went wrong");
                setLoading(false);

            });

    }, []);
    React.useEffect(() => {
        getData();
    }, [getData]);


    const columns = [
        { title: "Order Id", field: "order_id", filtering: true, filterPlaceholder: "Filter by Id", align: 'center' },
        { title: "Total Price", field: "total_price", filterPlaceholder: "Filter by Price", filtering: true, sorting: true, align: 'center' },
        {
            title: "Delivered", field: "delivered", sorting: true, align: 'center', filtering: false,
        },

    ];
    const handleDetails = (data) => {
        navigate('/admin-order/' + data.id + '/detail');

    };
    return (
        <div className='table-wrapper'>
            {loading ? <HashLoader speedMultiplier={1.5} color={'#262626'} style={{ marginLeft: "50%" }} size={100} /> :
                tableData !== null ?
                    <MaterialTable style={{ width: 700, margin: "25px auto" }} title="Accepted List by Admin" icons={tableIcons} columns={columns} data={tableData}
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

                    /> : <p>Something went wrong</p>
            }
        </div>
    );
};
const mapStateToProps = state => ({
    email: state.auth.user.email

});
export default connect(mapStateToProps,)(AcceptedOrders);