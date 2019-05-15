import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});


class FormTypes extends Component {

  state = {
    value: null
  }

  handleChange = ({ target: { value } }) => {
    this.setState({ value });
    this.props.callback(value);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Please choose file type to upload</FormLabel>
          <RadioGroup
            aria-label="FileType"
            name="fileType"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value="general_ledger" control={<Radio color="primary" />} label="General Ledger" />
            <FormControlLabel value="billings" control={<Radio color="primary" />} label="Billings" />
            <FormControlLabel value="inventory" control={<Radio color="primary" />} label="Inventory" />
            <FormControlLabel value="custom" control={<Radio color="primary" />} label="Custom file" />
          </RadioGroup>
        </FormControl>
      
      </div>
    )
  }


}

export default withStyles(styles)(FormTypes);