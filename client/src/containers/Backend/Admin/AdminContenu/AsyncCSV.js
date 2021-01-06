import React, { Component } from "react";
import { CSVLink } from "react-csv";
import API from "../../../../utils/API";

class AsyncCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csvReport: {
        data: [],
        headers: [],
        filename: "Report.csv",
      },
    };
  }

  downloadReport = async (_, done) => {
    try {
      let csvFile = await API.create_csv_dispositifs_length();
      const objReport = {
        filename: "Clue_Mediator_Report_Async.csv",
        headers: [
          { label: "Titre Informatif", key: "titreInformatif" },
          { label: "Titre Marque", key: "titreMarque" },
          { label: "Abstract", key: "abstract" },
          { label: "URL", key: "url" },
        ],
        data: csvFile.data.data,
      };
      this.setState({ csvReport: objReport }, () => {
        done();
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    // API call to get data
  };

  render() {
    return (
      <CSVLink
        data={this.state.csvReport.data}
        asyncOnClick={true}
        onClick={this.downloadReport}
        headers={this.state.csvReport.headers}
        style={{ marginLeft: 20 }}
      >
        Export CSV fiches avec titres longs
      </CSVLink>
    );
  }
}

export default AsyncCSV;
