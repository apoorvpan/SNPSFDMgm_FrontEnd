import React, { Component } from "react";
import "./PersonalInfoTable.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";


const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

class PersonalInfoTable extends Component {
  state = {
    personalInfoData: [],
    loading: true,

    columnDefs: [
      {
        headerName: "Emp ID",
        field: "Emp",
        sortable: true,
        // filter: true ,
        width: 150,
      },
      {
        headerName: "Interest Rate",
        field: "InterestRate",
        sortable: true,
        // filter: true ,
        width: 150,
      },
      {
        headerName: "Opening Balance",
        field: "OpeningBalance",
        sortable: true,
        // filter: true ,
         width: 150,
      },
      {
        headerName: "Simple Interest",
        field: "SimpleInterest",
        sortable: true,
        // filter: true ,
         width: 150,
      },
      {
        headerName: "Compound Interest",
        field: "CompoundInterest",
        sortable: true,
        // filter: true ,
         width: 200,
      },
      {
        headerName: "Closing Balance",
        field: "ClosingBalance",
        sortable: true,
        // filter: true ,
         width: 150,
      },
    ],
    rowData: [],
    defaultColDef: {
      resizable: true,
      width: 120,
      filter: "agTextColumnFilter"
      // filter: true ,
    },
    getRowHeight: function (params) {
      return 35;
    }
  };
  personalInfoObj = [];
  rowDataT = [];
  loadPersonalInfoData = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/api/finance-info/" + this.props.data["_id"], {
        headers: {
          authorization: localStorage.getItem("token") || ""
        }
      })
      .then(response => {
        this.personalInfoObj = response.data;
        console.log("response", response.data);
        this.setState({ personalInfoData: response.data });
        this.setState({ loading: false });
        this.rowDataT = [];
        console.log("personalInfoObj", this.personalInfoObj)
        // this.personalInfoObj.map(data => {
        let data = this.personalInfoObj;
        let temp = {
          data,
          Emp: data["Emp"] || "Not Avaiable",
          InterestRate: data["InterestRate"] || "Not Avaiable",
          OpeningBalance: data["OpeningBalance"] || "Not Avaiable",
          SimpleInterest: data["SimpleInterest"] || "Not Avaiable",
          CompoundInterest: data["CompoundInterest"] || "Not Avaiable",
          ClosingBalance: data["ClosingBalance"] || "Not Avaiable",
        };

        this.rowDataT.push(temp);
        // });
        this.setState({ rowData: this.rowDataT });
        // console.log("rowData",this.state.rowData)

      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.loadPersonalInfoData();
  }

  render() {
    return (
      <div id="table-outer-div-scroll">
        <h2 id="role-title">Employee Financial Details {this.props.back ? "of " + this.props.data["FirstName"] + " " + this.props.data["LastName"] : ""}</h2>
        {this.props.back ? (<Link to="/hr/employee">
          <Button
            variant="primary"
            id="add-button"
          >
            Back
        </Button>
        </Link>) : <React.Fragment />}


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


      </div>
    );
  }
}

export default PersonalInfoTable;
