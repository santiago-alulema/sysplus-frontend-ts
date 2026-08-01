import type { Column } from '@devexpress/dx-react-grid';
import {
  FilteringState,
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  SortingState
} from '@devexpress/dx-react-grid';

import {
  Grid,
  PagingPanel,
  Table,
  TableFilterRow,
  TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';

import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';

import {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import type {
  ComponentProps,
  CSSProperties,
  ReactNode
} from 'react';

import { ActionColumn } from './DataGridCommon/ActionConfig';
import type { IActionConfig } from './DataGridCommon/IActionConfig';
import RenderHTML from './DataGridCommon/RenderHTML';
import TextFieldCustomDataGrid from './DataGridCommon/TextFieldCustomDataGrid';

type HorizontalAlignment = 'left' | 'center' | 'right';

export type DataGridColumnType =
  | 'auto'
  | 'text'
  | 'number'
  | 'date'
  | 'boolean';

export interface DataGridColumn<T extends object>
  extends Omit<Column, 'getCellValue'> {
  width?: string | number;
  align?: HorizontalAlignment;
  alignHeader?: HorizontalAlignment;

  fontSize?: string;
  fontSizeHeader?: string;

  hiddenFilterColumn?: boolean;
  sortingEnabled?: boolean;
  dataType?: DataGridColumnType;

  getCellValue?: (
    row: T,
    columnName: string
  ) => unknown;

  sortComparer?: (left: unknown, right: unknown) => number;
}

type FilteringStateProps = ComponentProps<typeof FilteringState>;
type GridFilters = NonNullable<FilteringStateProps['filters']>;

type TableProps = ComponentProps<typeof Table>;
type TableCellComponent = NonNullable<TableProps['cellComponent']>;
type TableCellProps = ComponentProps<TableCellComponent>;

type HeaderRowProps = ComponentProps<typeof TableHeaderRow>;
type HeaderCellComponent = NonNullable<HeaderRowProps['cellComponent']>;
type HeaderCellProps = ComponentProps<HeaderCellComponent>;

type FilterRowProps = ComponentProps<typeof TableFilterRow>;
type FilterCellComponentType = NonNullable<
  FilterRowProps['cellComponent']
>;
type FilterCellProps = ComponentProps<FilterCellComponentType>;

type NumberedRow<T extends object> = T & {
  rowNumber?: number;
};

interface Props<T extends object> {
  rows: readonly T[];
  columns: readonly DataGridColumn<T>[];

  gridId: string;

  getRowId?: (row: T) => string | number;
  columnsHide?: readonly string[];
  columsHide?: readonly string[];

  actions?: readonly IActionConfig<T>[];

  onChangeFilters?: (filters: GridFilters) => void;

  titleEmptyTable?: string;
  heightBodyEmptyData?: string;

  hasPagination?: boolean;
  hasFilters?: boolean;
  addNumeration?: boolean;

  searchLabel?: string;
  iconDirectionFilter?: 'start' | 'end';

  widthNumeration?: string | number;
  rowNumberColumnName?: string;
  rowNumberTitle?: string;

  actionColumnName?: string;

  pageSizes?: readonly number[];
  initialPageSize?: number;
}

const DEFAULT_PAGE_SIZES = [5, 10, 15];

const textCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
});

const isEmptyValue = (value: unknown): boolean => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  );
};

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const parseNumberValue = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'bigint') {
    return Number(value);
  }

  if (typeof value !== 'string') {
    return null;
  }

  const cleanedValue = value
    .trim()
    .replace(/\s/g, '')
    .replace(/[^\d.,+-]/g, '');

  if (!cleanedValue) {
    return null;
  }

  const commaPosition = cleanedValue.lastIndexOf(',');
  const dotPosition = cleanedValue.lastIndexOf('.');

  let normalizedValue = cleanedValue;

  if (commaPosition >= 0 && dotPosition >= 0) {
    if (commaPosition > dotPosition) {
      normalizedValue = cleanedValue
        .replace(/\./g, '')
        .replace(',', '.');
    } else {
      normalizedValue = cleanedValue.replace(/,/g, '');
    }
  } else if (commaPosition >= 0) {
    const decimalLength =
      cleanedValue.length - commaPosition - 1;

    normalizedValue =
      decimalLength > 0 && decimalLength <= 2
        ? cleanedValue.replace(',', '.')
        : cleanedValue.replace(/,/g, '');
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : null;
};

const parseDateValue = (value: unknown): number | null => {
  if (value instanceof Date) {
    const timestamp = value.getTime();

    return Number.isNaN(timestamp)
      ? null
      : timestamp;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const dateValue = value.trim();

  if (!dateValue) {
    return null;
  }

  const dayMonthYearMatch = dateValue.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s.*)?$/
  );

  if (dayMonthYearMatch) {
    const [, day, month, year] = dayMonthYearMatch;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).getTime();
  }

  const yearMonthDayMatch = dateValue.match(
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:[T\s].*)?$/
  );

  if (yearMonthDayMatch) {
    const [, year, month, day] = yearMonthDayMatch;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).getTime();
  }

  const timestamp = Date.parse(dateValue);

  return Number.isNaN(timestamp)
    ? null
    : timestamp;
};

const isDateString = (value: string): boolean => {
  const trimmedValue = value.trim();

  const hasDateFormat =
    /^\d{1,2}[/-]\d{1,2}[/-]\d{4}/.test(trimmedValue) ||
    /^\d{4}[/-]\d{1,2}[/-]\d{1,2}/.test(trimmedValue);

  return hasDateFormat && parseDateValue(trimmedValue) !== null;
};

const compareEmptyValues = (
  left: unknown,
  right: unknown
): number | null => {
  const leftIsEmpty = isEmptyValue(left);
  const rightIsEmpty = isEmptyValue(right);

  if (leftIsEmpty && rightIsEmpty) {
    return 0;
  }

  if (leftIsEmpty) {
    return 1;
  }

  if (rightIsEmpty) {
    return -1;
  }

  return null;
};

const compareAsText = (
  left: unknown,
  right: unknown
): number => {
  const emptyComparison = compareEmptyValues(left, right);

  if (emptyComparison !== null) {
    return emptyComparison;
  }

  return textCollator.compare(
    stringifyValue(left),
    stringifyValue(right)
  );
};

const compareAsNumber = (
  left: unknown,
  right: unknown
): number => {
  const emptyComparison = compareEmptyValues(left, right);

  if (emptyComparison !== null) {
    return emptyComparison;
  }

  const leftNumber = parseNumberValue(left);
  const rightNumber = parseNumberValue(right);

  if (leftNumber === null || rightNumber === null) {
    return compareAsText(left, right);
  }

  return leftNumber - rightNumber;
};

const compareAsDate = (
  left: unknown,
  right: unknown
): number => {
  const emptyComparison = compareEmptyValues(left, right);

  if (emptyComparison !== null) {
    return emptyComparison;
  }

  const leftDate = parseDateValue(left);
  const rightDate = parseDateValue(right);

  if (leftDate === null || rightDate === null) {
    return compareAsText(left, right);
  }

  return leftDate - rightDate;
};

const compareAsBoolean = (
  left: unknown,
  right: unknown
): number => {
  const emptyComparison = compareEmptyValues(left, right);

  if (emptyComparison !== null) {
    return emptyComparison;
  }

  return Number(Boolean(left)) - Number(Boolean(right));
};

const createComparator = (
  dataType: Exclude<DataGridColumnType, 'auto'>
): ((left: unknown, right: unknown) => number) => {
  switch (dataType) {
    case 'number':
      return compareAsNumber;

    case 'date':
      return compareAsDate;

    case 'boolean':
      return compareAsBoolean;

    case 'text':
    default:
      return compareAsText;
  }
};

const getColumnValue = <T extends object>(
  row: T,
  column: DataGridColumn<T>
): unknown => {
  if (column.getCellValue) {
    return column.getCellValue(row, column.name);
  }

  return Reflect.get(row, column.name);
};

const inferColumnType = <T extends object>(
  column: DataGridColumn<T>,
  rows: readonly T[]
): Exclude<DataGridColumnType, 'auto'> => {
  if (column.dataType && column.dataType !== 'auto') {
    return column.dataType;
  }

  for (const row of rows) {
    const value = getColumnValue(row, column);

    if (isEmptyValue(value)) {
      continue;
    }

    if (value instanceof Date) {
      return 'date';
    }

    if (
      typeof value === 'number' ||
      typeof value === 'bigint'
    ) {
      return 'number';
    }

    if (typeof value === 'boolean') {
      return 'boolean';
    }

    if (typeof value === 'string') {
      if (isDateString(value)) {
        return 'date';
      }

      if (parseNumberValue(value) !== null) {
        return 'number';
      }

      return 'text';
    }

    return 'text';
  }

  return 'text';
};

const renderValue = (value: unknown): ReactNode => {
  if (value === null || value === undefined) {
    return '';
  }

  if (isValidElement(value)) {
    return value;
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  return stringifyValue(value);
};

const CustomDataGridTs = <T extends object,>({
  rows,
  columns,
  gridId,
  getRowId,

  columnsHide,
  columsHide = [],

  actions = [],
  onChangeFilters = () => undefined,

  titleEmptyTable = 'Tabla sin datos',
  heightBodyEmptyData = '',

  hasPagination = true,
  hasFilters = true,
  addNumeration = false,

  searchLabel = '',
  iconDirectionFilter = 'start',

  widthNumeration = '65px',
  rowNumberColumnName = 'rowNumber',
  rowNumberTitle = 'Nro.',

  actionColumnName = 'actions',

  pageSizes = DEFAULT_PAGE_SIZES,
  initialPageSize
}: Props<T>) => {
  const normalizedPageSizes = useMemo(() => {
    const validPageSizes = pageSizes.filter(
      value => Number.isInteger(value) && value > 0
    );

    const uniquePageSizes = [...new Set(validPageSizes)];

    return uniquePageSizes.length > 0
      ? uniquePageSizes
      : [...DEFAULT_PAGE_SIZES];
  }, [pageSizes]);

  const defaultPageSize =
    initialPageSize ?? normalizedPageSizes[0];

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [filters, setFilters] = useState<GridFilters>([]);

  const hiddenColumns = columnsHide ?? columsHide;

  const visibleColumns = useMemo<DataGridColumn<T>[]>(() => {
    const filteredColumns = columns.filter(
      column => !hiddenColumns.includes(column.name)
    );

    if (!addNumeration) {
      return [...filteredColumns];
    }

    const numberColumn: DataGridColumn<T> = {
      name: rowNumberColumnName,
      title: rowNumberTitle,
      width: widthNumeration,
      hiddenFilterColumn: true,
      align: 'right',
      alignHeader: 'right',
      dataType: 'number'
    };

    return [
      numberColumn,
      ...filteredColumns
    ];
  }, [
    columns,
    hiddenColumns,
    addNumeration,
    rowNumberColumnName,
    rowNumberTitle,
    widthNumeration
  ]);

  const columnsByName = useMemo(() => {
    return new Map<string, DataGridColumn<T>>(
      visibleColumns.map(column => [
        column.name,
        column
      ])
    );
  }, [visibleColumns]);

  const filteredRows = useMemo<NumberedRow<T>[]>(() => {
    const activeFilters = hasFilters
      ? filters
      : [];

    const rowsResult =
      activeFilters.length === 0
        ? [...rows]
        : rows.filter(row => {
          return activeFilters.every(filter => {
            const filterValue = String(
              filter.value ?? ''
            )
              .trim()
              .toLocaleLowerCase();

            if (!filterValue) {
              return true;
            }

            const column = columnsByName.get(
              filter.columnName
            );

            const cellValue = column
              ? getColumnValue(row, column)
              : Reflect.get(row, filter.columnName);

            const normalizedCellValue = stringifyValue(
              cellValue
            ).toLocaleLowerCase();

            return normalizedCellValue.includes(filterValue);
          });
        });

    return rowsResult.map((row, index) => ({
      ...row,
      ...(addNumeration
        ? {
          [rowNumberColumnName]: index + 1,
          rowNumber: index + 1
        }
        : {})
    }));
  }, [
    rows,
    filters,
    hasFilters,
    columnsByName,
    addNumeration,
    rowNumberColumnName
  ]);

  const tableColumnExtensions = useMemo(() => {
    return visibleColumns.map(column => ({
      columnName: column.name,
      width: column.width ?? 'auto',
      align: column.align ?? 'left',
      wordWrapEnabled: true
    }));
  }, [visibleColumns]);

  const sortingStateExtensions = useMemo(() => {
    return visibleColumns.map(column => ({
      columnName: column.name,
      sortingEnabled:
        column.sortingEnabled ??
        column.name !== actionColumnName
    }));
  }, [visibleColumns, actionColumnName]);

  const sortingComparators = useMemo(() => {
    return visibleColumns
      .filter(column => {
        return (
          column.sortingEnabled ??
          column.name !== actionColumnName
        );
      })
      .map(column => {
        const inferredType = inferColumnType(
          column,
          rows
        );

        return {
          columnName: column.name,
          compare:
            column.sortComparer ??
            createComparator(inferredType)
        };
      });
  }, [
    visibleColumns,
    rows,
    actionColumnName
  ]);

  const handleFilterChange = useCallback(
    (values: GridFilters) => {
      const activeFilters = values.filter(filter => {
        return String(filter.value ?? '').trim() !== '';
      });

      setFilters(activeFilters);
      onChangeFilters(activeFilters);
    },
    [onChangeFilters]
  );

  const resolveRowId = useCallback(
    (row: NumberedRow<T>): string | number => {
      if (getRowId) {
        return getRowId(row);
      }

      const rowId = Reflect.get(row, 'id');

      if (
        typeof rowId === 'string' ||
        typeof rowId === 'number'
      ) {
        return rowId;
      }

      throw new Error(
        `CustomDataGridTs "${gridId}": cada fila debe contener una propiedad "id" o debes enviar getRowId.`
      );
    },
    [getRowId, gridId]
  );

  const CustomHeaderCell = useCallback(
    (props: HeaderCellProps) => {
      const column =
        props.column as DataGridColumn<T>;

      const alignment =
        column.alignHeader ??
        column.align ??
        'left';

      return (
        <TableHeaderRow.Cell
          {...props}
          style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #ccc',
            padding: '12px 8px',
            textAlign: alignment,
            fontWeight: 'bold',
            fontSize:
              column.fontSizeHeader ?? '14px'
          }}
        />
      );
    },
    []
  );

  const CustomActionCell = useCallback(
    (props: TableCellProps) => {
      const row =
        props.row as NumberedRow<T>;

      const column =
        props.column as DataGridColumn<T>;

      const configuredColumn =
        columnsByName.get(column.name) ?? column;

      const value = getColumnValue(
        row,
        configuredColumn
      );

      const commonStyle: CSSProperties = {
        fontSize:
          configuredColumn.fontSize ?? '13px',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        padding: '8px',
        textAlign:
          configuredColumn.align ?? 'left'
      };

      if (column.name === actionColumnName) {
        const visibleActions = actions.filter(action => {
          if (typeof action.hidden === 'function') {
            return !action.hidden(row);
          }

          return !action.hidden;
        });

        return (
          <Table.Cell
            {...props}
            style={commonStyle}
          >
            <ActionColumn
              row={row}
              actions={visibleActions}
            />
          </Table.Cell>
        );
      }

      const containsHTML =
        typeof value === 'string' &&
        /<[a-z][\s\S]*>/i.test(value);

      return (
        <Table.Cell
          {...props}
          style={commonStyle}
        >
          {containsHTML ? (
            <RenderHTML html={value} />
          ) : (
            renderValue(value)
          )}
        </Table.Cell>
      );
    },
    [
      actions,
      actionColumnName,
      columnsByName
    ]
  );

  const CustomFilterCell = useCallback(
    (props: FilterCellProps) => {
      const column =
        props.column as DataGridColumn<T>;

      const filterCellStyle: CSSProperties = {
        backgroundColor: 'white',
        borderBottom: '1px solid #ccc',
        flexDirection:
          iconDirectionFilter === 'end'
            ? 'row-reverse'
            : 'row'
      };

      if (column.hiddenFilterColumn) {
        return (
          <TableFilterRow.Cell
            {...props}
            style={filterCellStyle}
          />
        );
      }

      return (
        <TableFilterRow.Cell
          {...props}
          style={filterCellStyle}
        >
          <TextFieldCustomDataGrid
            {...props}
            searchLabel={searchLabel}
          />
        </TableFilterRow.Cell>
      );
    },
    [
      searchLabel,
      iconDirectionFilter
    ]
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [
    filters,
    pageSize,
    rows.length
  ]);

  return (
    <Paper
      id={gridId}
      sx={{
        padding: 0,
        width: '100%',

        '& .MuiTable-root thead .MuiTableCell-head': {
          backgroundColor: '#e8e8e8',
          border: 'none',
          fontSize:
            'clamp(0.825rem, 0.650rem + 0.25vi, 2.75rem) !important',
          fontWeight: 'bold'
        },

        '& .MuiTableCell-body': {
          fontSize:
            'clamp(0.625rem, 0.594rem + 0.25vi, 2.75rem) !important',
          whiteSpace: 'normal',
          overflowWrap: 'break-word',
          padding: '8px'
        },

        '& .MuiInputLabel-root': {
          fontSize:
            'clamp(0.625rem, 0.594rem + 0.25vi, 2.75rem) !important',
          top: '0px',
          marginTop: '8px'
        },

        ...(heightBodyEmptyData
          ? {
            '& .TableNoDataCell-text': {
              padding:
                `${heightBodyEmptyData} 0 !important`,
              fontSize:
                'clamp(0.625rem, 0.596rem + 0.29vi, 2.75rem) !important'
            }
          }
          : {})
      }}
    >
      <Grid
        rows={filteredRows}
        columns={visibleColumns}
        getRowId={resolveRowId}
      >
        <SortingState
          columnExtensions={sortingStateExtensions}
        />

        <IntegratedSorting
          columnExtensions={sortingComparators}
        />

        {hasFilters && (
          <FilteringState
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        )}

        {hasPagination && (
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        )}

        {hasPagination && <IntegratedPaging />}

        <Table
          cellComponent={CustomActionCell}
          columnExtensions={tableColumnExtensions}
          messages={{
            noData: titleEmptyTable
          }}
        />

        <TableHeaderRow
          cellComponent={CustomHeaderCell}
          showSortingControls
        />

        {hasFilters && (
          <TableFilterRow
            iconComponent={SearchIcon}
            cellComponent={CustomFilterCell}
          />
        )}

        {hasPagination && (
          <PagingPanel
            pageSizes={normalizedPageSizes}
            messages={{
              rowsPerPage: ''
            }}
          />
        )}
      </Grid>
    </Paper>
  );
};

export default CustomDataGridTs;