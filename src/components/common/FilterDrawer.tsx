import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  sites: any[];
  selectedSites: any[];
  onSelect: (newSites: any[]) => void;
}

export default function FilterDrawer({
  open,
  onClose,
  sites,
  selectedSites,
  onSelect,
}: FilterDrawerProps) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtros de Granja
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Autocomplete
          multiple
          options={sites}
          disableCloseOnSelect
          value={selectedSites}
          onChange={(event, newValue) => onSelect(newValue)}
          getOptionLabel={(option) =>
            `${option.company_name || ""} - ${option.site_name || ""}`
          }
          filterOptions={(options, { inputValue }) =>
            options.filter(
              (opt) =>
                opt.company_name?.toLowerCase().includes(inputValue.toLowerCase()) ||
                opt.site_name?.toLowerCase().includes(inputValue.toLowerCase())
            )
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={option.id}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {option.company_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.site_name}
                </Typography>
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar granja o sitio"
              placeholder="Ej. Omarsa o Haraute"
              variant="outlined"
            />
          )}
        />

      </Box>
    </Drawer>
  );
}
