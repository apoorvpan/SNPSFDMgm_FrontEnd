import React, { Component } from "react";
import "./RoleTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";


const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;


class RoleTable extends Component {
  state = {
    roleData: [],
    loading: true,

    columnDefs: [
   
      {
        headerName: "Financial Year",
        field: "Financialyear",
        sortable: true,
         width: 150,
        // filter: true ,
      },
   
      {
        headerName: "EmployeeID",
        field: "Employeeid",
        sortable: true,
        width: 150,
        // filter: true ,
      },

      {
        headerName: "Employee Username",
        field: "Employeeusername",
        sortable: true,
        width: 180,
        // filter: true ,
      },

      {
        headerName: "Date of joining the fund",
        field: "dateofjoiningdate",
        sortable: true,
        width: 200,
        // filter: true ,
      },

      {
        headerName: "Date of leaving the fund",
        field: "dateofleavingdate",
        sortable: true,
        width: 200,
        // filter: true ,
      },

      {
        headerName: "Location",
        field: "Location",
        sortable: true,
        width: 110,
        filter: true ,
      },

      {
        headerName: "Total Contribution",
        field: "TotalContribution",
        sortable: true,
        width: 150,
        // filter: true ,
      },

      {
        headerName: "Total Simple Interest",
        field: "totalsimpleinterest",
        sortable: true,
         width: 150,
        // filter: true ,
      },
      {
        headerName: "Total Compound Interest",
        field: "totalcompoundinterest",
        sortable: true,
         width: 150,
         filter: true ,
      },

      {
        headerName: " Total Amount (Int + Contri)",
        field: "TotalAmountCont",
        sortable: true,
        width: 240,
        // filter: true ,
      },

      {
        headerName: " BG",
        field: "Bgroup",
        sortable: true,
        width: 120,
        filter: true ,
      },
     

      {
        headerName: "",
        field: "edit",
        filter: false,
        width: 30,
        cellRendererFramework: this.renderEditButton.bind(this)
      },
      {
        headerName: "",
        field: "delete",
        filter: false,
        width: 30,
        cellRendererFramework: this.renderButton.bind(this)
      }
    ],
    rowData: [],
    defaultColDef: {
      resizable: true,
      width: 590,
      filter: "agTextColumnFilter"
      // filter: true ,
    },
    getRowHeight: function(params) {
      return 35;
    }

  };
  roleObj = [];
  rowDataT = [];

  loadRoleData = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/api/role", {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then(response => {
        /*Apoorv_Temp*/
        /*response.data["Financialyear"]="FY2023";
        response.data["Employeeid"]="2456"
        response.data["Employeeusername"]="amitp"
        response.data["dateofjoiningdate"]="04/05/2021"
        response.data["dateofleavingdate"]=""
        response.data["Location"]="Bangalore";
        response.data["TotalContribution"]="5000"
        response.data["totalsimpleinterest"]="5193.75"
        response.data["totalcompoundinterest"]="6683.19"
        response.data["TotalAmountCont"]=""
        response.data["Bgroup"]="SEG"*/
        this.roleObj = response.data;

        console.log("response", response.data);
        
        this.setState({ roleData: response.data });
        this.setState({ loading: false });
        this.rowDataT = [];
      
        this.roleObj.map(data => {
          let temp = {
            data,
            Financialyear: data["Financialyear"]|| "Not Avaiable",
            Employeeid:data["Employeeid"]|| "Not Avaiable",
            Employeeusername:data["Employeeusername"]|| "Not Avaiable",
            dateofjoiningdate:data["dateofjoiningdate"]|| "Not Avaiable",
            dateofleavingdate:data["dateofleavingdate"]|| "Not Avaiable",
            Location:data["Location"]|| "Not Avaiable",
            TotalContribution:data["TotalContribution"]|| "Not Avaiable",
            totalsimpleinterest:data["totalsimpleinterest"]|| "Not Avaiable",
            totalcompoundinterest:data["totalcompoundinterest"]|| "Not Avaiable",
            TotalAmountCont:data["TotalAmountCont"]|| "Not Avaiable",
            Bgroup:data["Bgroup"]|| "Not Avaiable",
            
          };
          this.rowDataT.push(temp);
        });
        this.rowDataT.push(response.data)
        this.setState({ rowData: this.rowDataT });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onRoleDelete = e => {
    console.log(e);
    if (window.confirm("Are you sure to delete this record ? ") == true) {
      axios
        .delete(process.env.REACT_APP_API_URL + "/api/role/" + e, {
          headers: {
            authorization: localStorage.getItem("token") || ""
          }
        })
        .then(res => {
          this.componentDidMount();
        })
        .catch(err => {
          console.log(err);
          console.log(err.response);
          if(err.response.status==403){
            window.alert(err.response.data) ;}
       
        });
    }
  };

  componentDidMount() {
    this.loadRoleData();
  }
  renderButton(params) {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faTrash}
        onClick={() =>
          this.onRoleDelete(params.data.data["_id"])
        }
      />
    );
  }
  renderEditButton(params) {
    console.log(params);
    return (
      <FontAwesomeIcon
        icon={faEdit}
        onClick={() => this.props.onEditRole(params.data.data)}
      />
    );
  }

  render() {
    return (
      <div id="table-outer-div-scroll">
        <h2 id="role-title">Employees Details</h2>

        <Button
          variant="primary"
          id="add-button"
          onClick={this.props.onAddRole}
        >
          <FontAwesomeIcon icon={faPlus} id="plus-icon" />
          Add
        </Button>
        <div id="clear-both" />
        {!this.state.loading ? (
          <div
            id="table-div"
            className="ag-theme-balham"
            //   style={
            //     {
            //     height: "500px",
            //     width: "100%"
            //   }
            // }
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              columnTypes={this.state.columnTypes}
              rowData={this.state.rowData}
              // floatingFilter={true}
              // onGridReady={this.onGridReady}
              pagination={true}
              paginationPageSize={10}
              getRowHeight={this.state.getRowHeight}
            />
          </div>
        ) : (
          <div id="loading-bar">
            <RingLoader
              css={override}
              sizeUnit={"px"}
              size={50}
              color={"#0000ff"}
              loading={true}
            />
          </div>
        )}

        {/* <div id="inner-table-div">
          <table id="role-table">
            <thead>
              <tr>
                <th width="30%">Company</th>
                <th width="30%">Role</th>
                <th width="20%" />
                <th width="20%" />
              </tr>
            </thead>

            {!this.state.loading ? (
              <React.Fragment>
                {this.roleObj.map((data, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{data["company"][0]["CompanyName"]}</td>
                      <td>{data["RoleName"]}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={faEdit}
                          onClick={() => this.props.onEditRole(data)}
                        />
                      </td>
                      <td>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => this.onRoleDelete(data["_id"])}
                        />
                      </td>
                    </tr>
                  </tbody>
                ))}
              </React.Fragment>
            ) : (
              <tbody>
                <tr>
                  <td />
                  <td>
                    <div id="loading-bar">
                      <BarLoader
                        css={override}
                        sizeUnit={"px"}
                        size={150}
                        color={"#0000ff"}
                        loading={true}
                      />
                    </div>
                  </td>
                  <td />
                  <td />
                </tr>
              </tbody>
            )}
          </table>
        </div> */}
      </div>
    );
  }
}

export default RoleTable;
