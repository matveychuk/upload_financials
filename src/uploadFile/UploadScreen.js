import React from 'react';
import Button from '@material-ui/core/Button';
import XLSX from 'xlsx';

import { FormTypes, Table } from './components';

class UploadScreen extends React.Component {

  state = {
    dataForTable: null
  }

  handleFile = (event) => {
    const file = event.target.files[0];
    if (!this.validFileType(file)) console.log('not valid')

    const reader = new FileReader();

    reader.onload = (e) => {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      var result = {};
      workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        if (roa.length) result[sheetName] = roa;
      });
      this.setState({ dataForTable: result.Sheet1 })
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
    const { formType, dataForTable } = this.state;

    return (
      <React.Fragment>
        {!formType &&
          <FormTypes callback={(formType) => this.setState({ formType })} />
          ||
          <React.Fragment>

            <h3>{formType.toUpperCase()}</h3>

            {!dataForTable &&
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
              ||
              <Table
                data={dataForTable}
                formType={formType}
                regularTable={this.state.formType !== 'custom'}
                chooseHeader={(rowIndex => this.chooseHeader(rowIndex))}
              />
            }
          </React.Fragment>
        }



      </React.Fragment>
    )
  }
}

export default UploadScreen;