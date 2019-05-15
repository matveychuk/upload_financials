import React from 'react';
import Button from '@material-ui/core/Button';
import XLSX from 'xlsx';

import { Table } from './components';

class UploadScreen extends React.Component {

  state = {
    dataForTable: null
  }

  handleFile = (event) => {
    const file = event.target.files[0];
    if (!this.validFileType(file)) console.log('not valid')
    console.log(file);

    const reader = new FileReader();


    reader.onload = (e) => {
      var data = e.target.result;
      console.log(data);
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      console.log(workbook);
      var result = {};
      workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        if (roa.length) result[sheetName] = roa;
      });
      console.log(result);
      this.setState({ dataForTable: result })


    };

    reader.readAsBinaryString(file);

  }

  validFileType = (file) => {
    const fileTypes = [
      "text/csv",
      "application/vnd.ms-excel"
    ]
    for (let i = 0; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i]) {
        return true;
      }
    }

    return false;
  }

  render() {
    const { dataForTable } = this.state;

    return (
      <React.Fragment>
        <Button
          variant="contained"
          component="label"
        >
          Choose file to upload
        <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={this.handleFile}
            style={{ display: "none" }}
          />
        </Button>

        {dataForTable && <Table data={dataForTable} />}
      </React.Fragment>
    )
  }
}

export default UploadScreen;