import {
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  List,
  ListItem,
  Tooltip,
  ListItemButton,
  Checkbox,
  Radio,
  ListItemText,
  Grid,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { capitaliseSentence } from '../../../../utils/helpers';
import { greyScale } from '../../../../utils/theme';
import { mapMetricName } from '../../../../services/enums';

/**
 * Props for the SearchSelector component.
 * @property {string} searchCategory - The category for the search.
 * @property {Array<string|number>} searchItems - The items to search through.
 * @property {Object.<string, string>} [itemTooltips] - Tooltips for items.
 * @property {Object.<string, number>} [itemDefaultValues] - Default values for items.
 * @property {boolean} [hasValues=false] - Indicates whether the items have values associated with them.
 * @property {(items: any, values?: number) => void} onChange - Function called when items are changed.
 * @property {boolean} [hideSearch] - Indicates whether to hide the search field.
 */
interface SearchSelectorProps {
  searchCategory: string;
  searchItems: string[] | number[];
  itemTooltips?: { [key: string]: string };
  itemDefaultValues?: { [key: string]: number };
  hasValues?: boolean;
  onChange: (items: any, values?: number) => void;
  hideSearch?: boolean;
  emptyMessage?: string;
  isComparison?: boolean;
  showItemCondition?: (item?: string | number) => boolean;
}

/**
 * React functional component for selecting search items.
 * @param {SearchSelectorProps} props - The props for the SearchSelector component.
 * @param {React.Ref} ref - React ref forwarded to the component.
 * @returns {React.ReactElement} - React element representing the SearchSelector component.
 */
const SearchSelector = forwardRef(function SearchSelector(
  props: SearchSelectorProps,
  ref
) {
  const {
    searchCategory,
    searchItems,
    itemTooltips,
    itemDefaultValues,
    hasValues = false,
    onChange,
    hideSearch,
    emptyMessage,
    isComparison,
    showItemCondition = () => true,
  } = props;

  const [selectedItems, setSelectedItems] = useState<(string | number)[]>(
    itemDefaultValues ? Object.keys(itemDefaultValues) : []
  );
  const [searchInput, setSearchInput] = useState<string>('');

  const [itemValues, setItemValues] = useState<{ [key: string]: string }>(
    Object.fromEntries(
      Object.entries(itemDefaultValues || {}).map(([key, value]) => [
        key,
        String(value),
      ])
    )
  );

  /**
   * Handles toggling of an item.
   * @param {string | number} item - The item to toggle.
   */
  const handleItemToggle = (item: string | number) => {
    if (isComparison) {
      setSelectedItems([item]);
      onChange(item);
    } else {
      if (selectedItems.includes(item)) {
        setSelectedItems(
          selectedItems.filter((selectedItem) => selectedItem !== item)
        );
        onChange(item);
      } else {
        setSelectedItems([...selectedItems, item]);
        onChange(item, parseFloat(itemValues[item]));
      }
    }
  };

  /**
   * Handles value change for an item.
   * @param {string | number} item - The item for which the value changes.
   * @param {string} value - The new value.
   */
  const handleWeightingChange = (item: string | number, value: string) => {
    if (
      itemValues[item] !== value &&
      !(itemValues[item] === '' && value === '')
    ) {
      setItemValues({ ...itemValues, [item]: value });
      onChange(item, parseFloat(value));
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchInput(event.target.value);
  };

  useImperativeHandle(ref, () => ({
    /**
     * Resets selection to the provided values.
     * @param {Object.<string, any>} resetValues - Values to reset to.
     */
    resetSelection(resetValues: {}) {
      setSelectedItems(Object.keys(resetValues));
      setItemValues(resetValues);
    },
  }));

  useEffect(() => {
    if (selectedItems.length === 0 && itemDefaultValues) {
      setSelectedItems(Object.keys(itemDefaultValues));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemDefaultValues]);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        borderRadius: 1,
        p: 3,
        border: '1px solid ' + greyScale['600'],
      }}
    >
      <Stack direction="column" spacing={2}>
        <Typography variant="h4">
          {capitaliseSentence(searchCategory)}
        </Typography>
        {!hideSearch && (
          <TextField
            value={searchInput}
            sx={{ bgcolor: 'common.white', input: { color: 'primary.main' } }}
            onChange={(e) => handleSearchInputChange(e)}
            label={'Search ' + searchCategory}
            InputProps={{
              endAdornment: (
                <InputAdornment component="div" position="end">
                  <IconButton>
                    <SearchIcon sx={{ color: 'primary.main' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
        <Box
          sx={{
            height: {
              xs: hideSearch ? 'auto' : 300,
              sm: hideSearch ? 372 : 300,
              md: hideSearch ? 372 : 300,
            },
            display: 'grid',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {searchItems.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography>{emptyMessage}</Typography>
            </Box>
          ) : (
            <List>
              {searchItems.map((item) => {
                const displayItem: boolean = showItemCondition(item);
                const stringItem =
                  typeof item === 'string' ? (item as string) : item.toString();
                return (
                  stringItem
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) && (
                    <Tooltip
                      key={item}
                      title={
                        displayItem
                          ? ''
                          : 'Data for this metric is not available for the companies and years selected'
                      }
                      followCursor
                    >
                      <ListItem disableGutters disablePadding>
                        <Grid container sx={{ alignItems: 'center' }}>
                          <Grid item xs={9}>
                            <ListItemButton
                              onClick={() => handleItemToggle(item)}
                              disabled={!displayItem}
                            >
                              {isComparison ? (
                                <Radio
                                  checked={selectedItems.includes(item)}
                                  edge="start"
                                  tabIndex={-1}
                                  disableRipple
                                  sx={{ pl: 0 }}
                                />
                              ) : (
                                <Checkbox
                                  checked={selectedItems.includes(item)}
                                  edge="start"
                                  tabIndex={-1}
                                  disableRipple
                                  sx={{ pl: 0 }}
                                />
                              )}
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <Box>
                                  <ListItemText
                                    sx={{ pr: 1 }}
                                    primary={
                                      typeof item === 'string'
                                        ? mapMetricName(item)
                                        : item
                                    }
                                  />
                                </Box>
                                {itemTooltips && (
                                  <Tooltip
                                    title={itemTooltips[item]}
                                    placement="right"
                                  >
                                    <InfoIcon
                                      fontSize="small"
                                      sx={{ color: 'neutral.main' }}
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                            </ListItemButton>
                          </Grid>
                          <Grid item xs={3}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                              }}
                            >
                              {hasValues && (
                                <TextField
                                  type="number"
                                  size="small"
                                  sx={{
                                    m: '0 10px',
                                    bgcolor: 'common.white',
                                    input: { color: 'primary.main' },
                                  }}
                                  disabled={!displayItem}
                                  inputProps={{
                                    min: '0',
                                    max: '1',
                                    step: '0.1',
                                  }}
                                  onChange={(event) => {
                                    const value = parseFloat(
                                      event.target.value
                                    );
                                    if (value < 0 || value > 1) {
                                      event.target.value =
                                        value < 0 ? '0' : '1';
                                    }
                                    handleWeightingChange(
                                      item,
                                      event.target.value
                                    );
                                  }}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === 'e' ||
                                      event.key === '-'
                                    ) {
                                      event.preventDefault();
                                    }
                                  }}
                                  placeholder="0.00"
                                  value={itemValues[item] || ''}
                                />
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </ListItem>
                    </Tooltip>
                  )
                );
              })}
            </List>
          )}
        </Box>
      </Stack>
    </Box>
  );
});

export default SearchSelector;
