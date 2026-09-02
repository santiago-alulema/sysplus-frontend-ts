import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridValidRowModel,
} from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

import "./css/CustomGridCrud.css";

export type CustomGridColumn<T extends GridValidRowModel> = GridColDef<T> & {
  editableCrud?: boolean;
};

interface CustomGridCrudProps<
  T extends GridValidRowModel & { id: GridRowId }
> {
  title?: string;

  rows: T[];
  columns: CustomGridColumn<T>[];

  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;

  hideActions?: boolean;
  hideCreateButton?: boolean;
  hideEditButton?: boolean;
  hideDeleteButton?: boolean;

  createButtonText?: string;

  onCreate?: () => void;
  onSave?: (row: T) => Promise<T> | T;
  onDelete?: (id: GridRowId, row: T) => void;

  height?: number | string;
}

export function CustomGridCrud<
  T extends GridValidRowModel & { id: GridRowId }
>({
  title = "Listado",
  rows,
  columns,

  canCreate = true,
  canEdit = true,
  canDelete = true,

  hideActions = false,
  hideCreateButton = false,
  hideEditButton = false,
  hideDeleteButton = false,

  createButtonText = "Crear",

  onCreate,
  onSave,
  onDelete,

  height = 520,
}: CustomGridCrudProps<T>) {
  const [rowModesModel, setRowModesModel] =
    useState<GridRowModesModel>({});

  const [editedRows, setEditedRows] = useState<
    Record<GridRowId, T>
  >({});

  const isRowEditing = (id: GridRowId) =>
    rowModesModel[id]?.mode === GridRowModes.Edit;

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: {
        mode: GridRowModes.Edit,
      },
    }));
  };

  const handleSaveClick = async (id: GridRowId) => {
    const originalRow = rows.find((x) => x.id === id);

    const updatedRow =
      editedRows[id] ?? originalRow;

    if (updatedRow && onSave) {
      await onSave(updatedRow);
    }

    setEditedRows((prev) => {
      const copy = { ...prev };
      delete copy[id];

      return copy;
    });

    setRowModesModel((prev) => ({
      ...prev,
      [id]: {
        mode: GridRowModes.View,
      },
    }));
  };

  const handleCancelClick = (id: GridRowId) => {
    setEditedRows((prev) => {
      const copy = { ...prev };
      delete copy[id];

      return copy;
    });

    setRowModesModel((prev) => ({
      ...prev,
      [id]: {
        mode: GridRowModes.View,
      },
    }));
  };

  const handleChange = (
    id: GridRowId,
    field: string,
    value: string
  ) => {
    const originalRow = rows.find((x) => x.id === id);

    if (!originalRow) return;

    const updatedRow = {
      ...originalRow,
      ...editedRows[id],
      [field]: value,
    } as T;

    setEditedRows((prev) => ({
      ...prev,
      [id]: updatedRow,
    }));
  };

  const finalColumns: GridColDef<T>[] = [
    ...columns.map((column) => ({
      ...column,

      editable: false,

      renderCell: (params: any) => {
        const id = params.id;

        const editing = isRowEditing(id);

        const rowValue =
          editedRows[id]?.[params.field] ??
          params.value ??
          "";

        if (editing && column.editableCrud) {
          return (
            <TextField
              size="small"
              fullWidth
              value={rowValue}
              onChange={(e) =>
                handleChange(
                  id,
                  params.field,
                  e.target.value
                )
              }
              className="custom-grid-crud__input"
            />
          );
        }

        if (column.valueFormatter) {
          return column.valueFormatter(params);
        }

        return (
          <span className="custom-grid-crud__cell-text">
            {rowValue}
          </span>
        );
      },
    })),

    ...(!hideActions
      ? [
          {
            field: "actions",
            headerName: "Acciones",
            width: 140,

            sortable: false,
            filterable: false,

            align: "center",
            headerAlign: "center",

            renderCell: (params) => {
              const id = params.id;

              const row = params.row as T;

              const editing = isRowEditing(id);

              if (editing) {
                return (
                  <Box className="custom-grid-crud__actions">
                    <Tooltip title="Guardar">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() =>
                          handleSaveClick(id)
                        }
                        className="custom-grid-crud__action-button"
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Cancelar">
                      <IconButton
                        size="small"
                        color="inherit"
                        onClick={() =>
                          handleCancelClick(id)
                        }
                        className="custom-grid-crud__action-button"
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                );
              }

              return (
                <Box className="custom-grid-crud__actions">
                  {!hideEditButton && canEdit && (
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleEditClick(id)
                        }
                        className="custom-grid-crud__action-button"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {!hideDeleteButton &&
                    canDelete && (
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            onDelete?.(id, row)
                          }
                          className="custom-grid-crud__action-button"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                </Box>
              );
            },
          } as GridColDef<T>,
        ]
      : []),
  ];

  return (
    <Paper
      elevation={0}
      className="custom-grid-crud"
    >
      <Box className="custom-grid-crud__header">
        <Box>
          <Typography className="custom-grid-crud__title">
            {title}
          </Typography>

          <Typography className="custom-grid-crud__subtitle">
            {rows.length} registro
            {rows.length !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {!hideCreateButton && canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            className="custom-grid-crud__create-button"
          >
            {createButtonText}
          </Button>
        )}
      </Box>

      <Box
        className="custom-grid-crud__table-container"
        sx={{
          height,
        }}
      >
        <DataGrid
          rows={rows}
          columns={finalColumns}
          disableSelectionOnClick
          getRowHeight={() => "auto"}
          pagination
          pageSize={10}
          rowsPerPageOptions={[
            5,
            10,
            25,
            50,
          ]}
          className="custom-grid-crud__grid"
        />
      </Box>
    </Paper>
  );
}