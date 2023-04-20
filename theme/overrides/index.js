import { merge } from 'lodash';
import Card from './Card';
import Lists from './Lists';
import Paper from './Paper';
import Input from './Input';
import Button from './Button';
import Select from './Select';
import Tooltip from './Tooltip';
import Backdrop from './Backdrop';
import TextField from './TextField';
import Typography from './Typography';
import IconButton from './IconButton';
import Autocomplete from './Autocomplete';
import FormControlLabel from "./FormControlLabel";

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return merge(
    Card(theme),
    Lists(theme),
    Paper(theme),
    Input(theme),
    Button(theme),
    Select(theme),
    Tooltip(theme),
    Backdrop(theme),
    TextField(theme),
    Typography(theme),
    IconButton(theme),
    Autocomplete(theme),
    FormControlLabel(theme),
  );
}
