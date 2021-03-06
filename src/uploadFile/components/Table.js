import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { form_fields } from '../../constants';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class TableFromData extends React.Component {
  state = {
    //steps are:
    //0 - choose row for headers
    //1 - choose first row with data
    //2... - choose colunms for predefined columns in regular tables
    currentStep: 0,
    data: this.props.data,
    dataBySteps: [this.props.data],
    columnsList: this.props.formType === 'custom' ? [] : form_fields[this.props.formType].map(el => el.value),
    currentColumn: 0,
    submitted: false
  }

  handleRowClick = (index) => {
    const { currentStep, data, dataBySteps } = this.state;
    const { formType } = this.props;
    if (currentStep > 1) return; //break for cases when user chooses columns

    let dataToModify = [...data];
    let archive = JSON.parse(JSON.stringify(dataBySteps));

    if (currentStep === 0) {
      //to remove all top rows before header
      dataToModify.splice(0, index);
      archive.push(dataToModify);
      this.setState({
        currentStep: 1,
        data: dataToModify,
        dataBySteps: archive
      });
      return;
    };

    if (currentStep === 1) {
      //to remove all rows between header and actual data
      dataToModify.splice(1, index - 1);
      archive.push(dataToModify);

      //to remove empty rows
      dataToModify = dataToModify.filter((el) => el.length);
      this.setState({
        currentStep: 2,
        data: dataToModify,
        dataBySteps: archive
      });
      if (formType === 'custom') {
        this.setState({ tableCleaned: true });
      }
    };
  }

  handleColumnClick = (index) => {
    const { currentStep, currentColumn, data, columnsList, dataBySteps } = this.state;

    if (currentStep < 2) return; //break for cases when user chooses header and first row with data
    if (currentColumn > columnsList.length) return; //break for cases when user's alreade choosen all fields/columns

    let dataToModify = [...data];
    let archive = JSON.parse(JSON.stringify(dataBySteps));


    dataToModify[0][index] = columnsList[currentColumn].toUpperCase();
    archive.push(dataToModify);

    this.setState({
      currentColumn: this.state.currentColumn + 1,
      data: dataToModify,
      currentStep: this.state.currentStep + 1,
      dataBySteps: archive
    }, () => this.checkFields());
  }

  checkFields = () => {
    const { currentColumn, data, columnsList } = this.state;
    if (currentColumn !== columnsList.length) return;

    //check if all mandatory fields are set
    let allSet = true;
    columnsList.map(field => {
      if (field.mandatory && !data[0].includes(field.value)) allSet = false;
    })
    if (!allSet) {
      this.setState({ error: 'Not all mandatory fields are set' });
      return;
    }

    //check if header row contains duplicates
    data[0] = data[0].map(el => el.toString().toUpperCase());
    if (new Set(data[0]).size !== data[0].length) this.setState({ error: 'Header contains duplicate column names' });
  }


  cleanupTable = () => {
    const { data, columnsList } = this.state;

    //we use some hack for deep cloning
    let dataToModify = JSON.parse(JSON.stringify(data));
    data[0].map((columnTitle, i) => {
      if (!columnsList.includes(columnTitle.toString().toLowerCase())) {
        //delete in each row the value for not included in the list column
        const idx = dataToModify[0].indexOf(columnTitle);
        dataToModify.map(row => {
          row.splice(idx, 1);
        })
      }
    })
    this.setState({ data: dataToModify, tableCleaned: true });

  }

  handlePrevStep = () => {
    const { currentStep, dataBySteps, currentColumn } = this.state;
    this.setState({
      currentStep: currentStep - 1,
      data: dataBySteps[currentStep - 1]
    });
    if (currentColumn > 0) this.setState({ currentColumn: currentColumn - 1 });
  }

  sendData = () => {
    //showLoader is used to simulate delay for server response
    this.setState({ submitted: true, showLoader: true });
    setTimeout(() => this.setState({ showLoader: false }), 1000);
  }

  render() {
    const { classes, formType } = this.props;
    const { currentStep, data, columnsList, currentColumn, submitted, showLoader, tableCleaned, error } = this.state;

    if (!submitted) return (
      <React.Fragment>
        {!!currentStep &&
          <Button
            variant="contained"
            component="label"
            className={classes.button}
            onClick={this.handlePrevStep}
          >
            Prev Step
          </Button>
        }
        {currentStep === 0 &&
          <p className={classes.button}>Please click a row with headers</p>
        }

        {currentStep === 1 &&
          <p className={classes.button}>Please click a first row with data</p>
        }

        {currentStep > 1 && currentColumn < columnsList.length &&
          <React.Fragment>
            <p className={classes.button}>{"Please click a column for " + columnsList[currentColumn]}</p>
            {!form_fields[formType][currentColumn].mandatory &&
              <React.Fragment>
                <p className={classes.button}>This column is optional. You can skip it</p>
                <Button
                  variant="contained"
                  component="label"
                  className={classes.button}
                  onClick={() => this.setState({ currentColumn: this.state.currentColumn + 1, currentStep: this.state.currentStep + 1 })}
                >
                  Skip
                </Button>
              </React.Fragment>
            }
          </React.Fragment>
        }

        {error && <p style={{ color: 'red' }}>
          {error}
        </p>}

        {!!(columnsList.length && currentColumn === columnsList.length && !tableCleaned && !error) &&
          <React.Fragment>
            <p>All columns that are not from regular form fields list will be removed</p>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.cleanupTable}
            >
              Okay
            </Button>
          </React.Fragment>
        }
        
        {tableCleaned &&
          <React.Fragment>
            <p>Your data is ready to submit</p>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.sendData}
            >
              Submit
            </Button>
          </React.Fragment>
        }

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow onClick={() => this.handleRowClick(0)}>
                {data[0].map((element, index) => (
                  <CustomTableCell key={index} align="right" onClick={() => this.handleColumnClick(index)}>{element}</CustomTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.slice(1).map((row, index) => (
                <TableRow key={index} onClick={() => this.handleRowClick(index + 1)}>
                  {row.map((element, index) => (
                    <TableCell key={index} align="right" onClick={() => this.handleColumnClick(index)}>{element}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>

    )

    return (
      <React.Fragment>

        {showLoader &&
          <CircularProgress className={classes.progress} />
        }

        {!showLoader &&
          <div>
            <p>Success!</p>
            <p>Would you like to upload more data?</p>
          </div>
        }
      </React.Fragment>

    )
  }
}

export default withStyles(styles)(TableFromData);