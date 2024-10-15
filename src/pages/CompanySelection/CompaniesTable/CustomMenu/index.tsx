import {
  GridColumnMenuContainer,
  GridColumnMenuProps,
  GridColumnMenuFilterItem,
} from '@mui/x-data-grid';

const CustomMenu: React.FC<GridColumnMenuProps> = (props) => {
  const { hideMenu, colDef, ...other } = props;
  return (
    <GridColumnMenuContainer hideMenu={hideMenu} colDef={colDef} {...other}>
      <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef!} />
    </GridColumnMenuContainer>
  );
};

export default CustomMenu;
