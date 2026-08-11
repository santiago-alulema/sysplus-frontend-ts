import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import {
    Box,
    Typography,
    LinearProgress,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    styled,
    Avatar,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {
    InsertDriveFile as FileIcon,
    Close as CloseIcon,
    CloudUpload as UploadIcon,
    Error as ErrorIcon,
    Info as InfoIcon
} from '@mui/icons-material';

type BaseType = 'string' | 'number' | 'boolean' | 'date' | 'percent';
type OptType =
    | `${BaseType}?`
    | BaseType;

interface ExcelUploaderProps {
    legend?: string;
    acceptedFileTypes?: string[];
    requiredColumns?: { [columnName: string]: OptType };
    onFileProcessed?: (data: any[]) => void;
    maxFileSize?: number;
}

interface ExcelRow {
    [key: string]: any;
}

const DropzoneContainer = styled(Paper)<{ isDragActive: boolean }>(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: isDragActive ? theme.palette.action.hover : theme.palette.background.paper,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover
    }
}));

const normalizeColumnName = (name: string) => {
    return name
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

// ---------- Helpers: fechas y porcentajes ----------
const toISODateString = (d: Date): string => {
    // Usamos campos UTC para evitar desfases por timezone
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const excelSerialToISODate = (n: number): string => {
    // Base Excel (con bug del 1900) corregida con 1899-12-30
    // 1 día = 86400000 ms
    const excelEpochUTC = Date.UTC(1899, 11, 30); // 1899-12-30
    const dateUTCms = excelEpochUTC + n * 86400000;
    const d = new Date(dateUTCms);
    return toISODateString(d);
};

const parseAnyDateToISO = (value: any): string => {
    if (value == null || value === '') {
        throw new Error('Fecha vacía');
    }

    // 1) Si viene como Date (cuando cellDates:true y la celda tiene formato fecha)
    if (value instanceof Date && !isNaN(value.getTime())) {
        return toISODateString(value);
    }

    // 2) Si viene como número serial de Excel
    if (typeof value === 'number' && isFinite(value)) {
        return excelSerialToISODate(value);
    }

    // 3) Si viene como string
    if (typeof value === 'string') {
        const s = value.trim();

        // Intento ISO directo (YYYY-MM-DD)
        const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
        if (isoMatch) {
            const d = new Date(Date.UTC(+isoMatch[1], +isoMatch[2] - 1, +isoMatch[3]));
            if (!isNaN(d.getTime())) return toISODateString(d);
        }

        // Intento DD/MM/YYYY o D/M/YYYY
        const dmyMatch = /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/.exec(s);
        if (dmyMatch) {
            const d = new Date(Date.UTC(+dmyMatch[3], +dmyMatch[2] - 1, +dmyMatch[1]));
            if (!isNaN(d.getTime())) return toISODateString(d);
        }

        // Intento MM/DD/YYYY (menos común en LATAM pero lo contemplamos)
        const mdyMatch = /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/.exec(s);
        if (mdyMatch) {
            const first = +mdyMatch[1];
            const second = +mdyMatch[2];
            // Heurística: si el primer número > 12, asumimos D/M/Y ya capturado arriba
            if (first <= 12 && second <= 31) {
                const d = new Date(Date.UTC(+mdyMatch[3], first - 1, second));
                if (!isNaN(d.getTime())) return toISODateString(d);
            }
        }

        // Último intento con Date.parse (puede depender del navegador)
        const parsed = Date.parse(s);
        if (!isNaN(parsed)) {
            return toISODateString(new Date(parsed));
        }
    }

    throw new Error('Formato de fecha no reconocido');
};

const sanitizeNumberString = (s: string) => {
    // Soporta coma decimal "50,5" → "50.5"
    return s.replace(/\s+/g, '').replace(',', '.');
};

const parsePercentToNumber = (value: any): number => {
    if (value == null || value === '') {
        return 0;
    }

    if (typeof value === 'number') {
        if (value >= 0 && value <= 1) return value * 100;
        return value;
    }

    if (typeof value === 'string') {
        const raw = sanitizeNumberString(value.trim());
        const pctMatch = /^-?\d+(\.\d+)?%$/.test(raw);
        if (pctMatch) {
            return parseFloat(raw.replace('%', ''));
        }
        const num = parseFloat(raw);
        if (!isNaN(num)) {
            return (num >= 0 && num <= 1) ? num * 100 : num;
        }
    }

    throw new Error('Porcentaje inválido');
};
// ---------------------------------------------------

const UploadExcel: React.FC<ExcelUploaderProps> = ({
    legend = "Arrastra y suelta un archivo Excel aquí, o haz clic para seleccionarlo",
    acceptedFileTypes = ['.xlsx', '.xls', '.csv'],
    requiredColumns = {},
    onFileProcessed,
    maxFileSize = 5
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [fileData, setFileData] = useState<ExcelRow[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [detectedColumns, setDetectedColumns] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);
        setValidationErrors([]);
        setFileData([]);
        setDetectedColumns([]);

        if (acceptedFiles.length === 0) {
            setError('Por favor, sube un archivo Excel válido.');
            return;
        }

        const selectedFile = acceptedFiles[0];

        if (selectedFile.size > maxFileSize * 1024 * 1024) {
            setError(`El archivo es demasiado grande. Tamaño máximo permitido: ${maxFileSize}MB.`);
            return;
        }

        setFile(selectedFile);
        processExcelFile(selectedFile);
    }, [maxFileSize]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/csv': ['.csv']
        },
        maxFiles: 1
    });

    const processExcelFile = (file: File) => {
        setIsLoading(true);
        setProgress(0);

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                setProgress(30);
                if (!e.target?.result) {
                    throw new Error('No se pudo leer el archivo');
                }

                const data = new Uint8Array(e.target.result as ArrayBuffer);
                // Activamos cellDates para que XLSX detecte fechas cuando sea posible
                const workbook = XLSX.read(data, { type: 'array', cellDates: true });
                setProgress(60);

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Usamos header:1 para obtener AOA (array of arrays)
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });

                if (jsonData.length < 2) {
                    throw new Error('El archivo Excel está vacío o no tiene datos.');
                }

                const headers = (jsonData[0] as string[]).filter(h => h !== undefined && h !== null);
                setDetectedColumns(headers);

                const normalizedHeaders = headers.map(header => normalizeColumnName(header));

                const headerMap: Record<string, string> = {};
                headers.forEach(originalHeader => {
                    headerMap[normalizeColumnName(originalHeader)] = originalHeader;
                });

                const requiredCols = Object.keys(requiredColumns).map(col => {
                    const cleanCol = col.replace(/\?$/, '');
                    const rawType = requiredColumns[col]!.replace(/\?$/, '') as BaseType;
                    return {
                        original: cleanCol,
                        normalized: normalizeColumnName(cleanCol),
                        isOptional: col.endsWith('?'),
                        type: rawType
                    };
                });

                const missingColumns = requiredCols
                    .filter(({ normalized, isOptional }) => !normalizedHeaders.includes(normalized) && !isOptional)
                    .map(({ original }) => original);

                if (missingColumns.length > 0) {
                    setValidationErrors(missingColumns);
                    throw new Error(`Columnas requeridas faltantes: ${missingColumns.join(', ')}`);
                }

                const rows = (jsonData.slice(1) as any[]).reduce<ExcelRow[]>((acc, row, index) => {
                    const isEmptyRow = row.every((cell: any) =>
                        cell === undefined || cell === null || String(cell).trim() === '');
                    if (isEmptyRow) return acc;

                    const rowObj: ExcelRow = { __rowNumber: index + 2 };
                    const errorsInRow: string[] = [];
                    const normalizedValues: Record<string, any> = {};
                    const warningsInRow: string[] = [];

                    headers.forEach((header: string, i: number) => {
                        const normalizedHeader = normalizeColumnName(header);
                        let value = row[i];

                        if (value === '' || value === ' ' || value === undefined || value === null) {
                            value = null;
                        }
                        normalizedValues[normalizedHeader] = value;
                    });

                    for (const { original, normalized, isOptional, type } of requiredCols) {
                        const value = normalizedValues[normalized];
                        const displayName = headerMap[normalized] || original;
                        const cleanType = type; // ya viene sin '?'

                        // Manejo de valores vacíos
                        if (value === null || value === undefined || value === '' || value === ' ') {
                            switch (cleanType) {
                                case 'string':
                                    rowObj[displayName] = "";
                                    break;
                                case 'number':
                                    rowObj[displayName] = 0;
                                    break;
                                case 'boolean':
                                    rowObj[displayName] = false;
                                    break;
                                case 'date':
                                    rowObj[displayName] = null; // fecha vacía
                                    break;
                                case 'percent':
                                    rowObj[displayName] = 0;
                                    break;
                                default:
                                    rowObj[displayName] = null;
                            }

                            if (!isOptional) {
                                warningsInRow.push(`${displayName} estaba vacío - valor por defecto asignado (${cleanType})`);
                            }
                            continue;
                        }

                        // Validación y conversión de tipos para valores no vacíos
                        try {
                            switch (cleanType) {
                                case 'string':
                                    rowObj[displayName] = String(value);
                                    break;
                                case 'number': {
                                    const num = typeof value === 'string' ? parseFloat(sanitizeNumberString(value)) : Number(value);
                                    if (isNaN(num)) throw new Error(`${displayName} debe ser un número válido`);
                                    rowObj[displayName] = num;
                                    break;
                                }
                                case 'boolean': {
                                    if (value === 1 || value === '1' || value === true || String(value).toLowerCase() === 'true') {
                                        rowObj[displayName] = true;
                                    } else if (value === 0 || value === '0' || value === false || String(value).toLowerCase() === 'false') {
                                        rowObj[displayName] = false;
                                    } else {
                                        throw new Error(`${displayName} debe ser booleano (1/0 o true/false)`);
                                    }
                                    break;
                                }
                                case 'date': {
                                    const iso = parseAnyDateToISO(value);
                                    rowObj[displayName] = iso; // estándar YYYY-MM-DD
                                    break;
                                }
                                case 'percent': {
                                    const p = parsePercentToNumber(value);
                                    rowObj[displayName] = p; // 50% → 50
                                    break;
                                }
                                default:
                                    rowObj[displayName] = value;
                            }
                        } catch (conversionError) {
                            errorsInRow.push((conversionError as Error).message);
                        }
                    }

                    if (warningsInRow.length > 0) {
                        // Solo advertencias en consola, no bloquean
                        console.warn(`Fila ${index + 2}: ${warningsInRow.join(', ')}`);
                    }

                    if (errorsInRow.length > 0) {
                        throw new Error(`Fila ${index + 2}: ${errorsInRow.join(', ')}`);
                    }

                    // Procesar columnas no requeridas (se copian como vienen, normalizando vacíos a null)
                    headers.forEach(header => {
                        if (!(header in rowObj)) {
                            const normalizedHeader = normalizeColumnName(header);
                            const value = normalizedValues[normalizedHeader];
                            rowObj[header] = (value === null || value === undefined || String(value).trim() === '') ? null : value;
                        }
                    });

                    acc.push(rowObj);
                    return acc;
                }, []);

                setFileData(rows);
                setProgress(100);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                setProgress(0);
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setError('Error al leer el archivo. Por favor, intenta nuevamente.');
            setIsLoading(false);
            setProgress(0);
        };

        reader.onprogress = (progressEvent: ProgressEvent<FileReader>) => {
            if (progressEvent.lengthComputable) {
                const percentLoaded = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setProgress(percentLoaded > 90 ? 90 : percentLoaded);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileData([]);
        setError(null);
        setValidationErrors([]);
        setProgress(0);
        setDetectedColumns([]);
    };

    const fileSize = useMemo(() => {
        if (!file) return '0 KB';
        const sizeInKB = file.size / 1024;
        return sizeInKB < 1024 ? `${sizeInKB.toFixed(2)} KB` : `${(sizeInKB / 1024).toFixed(2)} MB`;
    }, [file]);

    return (
        <Box sx={{ width: '100%', marginTop:0, paddingTop:0 }}>
            <DropzoneContainer {...getRootProps()} isDragActive={isDragActive} elevation={3}>
                <input {...getInputProps()} />
                <UploadIcon color="primary" sx={{ fontSize: "48px !important", mb: 2 }} />
                <Typography className='titleBasePage' variant="h6" gutterBottom >
                    {legend}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Formatos aceptados: {acceptedFileTypes.join(', ')}. Tamaño máximo: {maxFileSize}MB
                </Typography>
                {Object.keys(requiredColumns).length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Columnas requeridas:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mt: 1 }}>
                            {Object.entries(requiredColumns).map(([col, type]) => {
                                const cleanCol = col.replace(/\?$/, '');
                                const isOptional = col.endsWith('?');
                                const isError = validationErrors.some(err =>
                                    normalizeColumnName(err) === normalizeColumnName(cleanCol));

                                return (
                                    <Tooltip key={col} title={isOptional ? "Columna opcional" : "Columna requerida"}>
                                        <Chip
                                            label={`${cleanCol} (${type.replace(/\?$/, '')}${isOptional ? '?' : ''})`}
                                            size="small"
                                            color={isError ? 'error' : 'default'}
                                            icon={isError ? <ErrorIcon fontSize="small" /> :
                                                (isOptional ? <InfoIcon fontSize="small" /> : undefined)}
                                        />
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </DropzoneContainer>

            {isLoading && (
                <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="caption" color="text.secondary">
                        Procesando archivo... {progress}%
                    </Typography>
                </Box>
            )}

            {error && (
                <Paper elevation={0} sx={{ mt: 2, p: 2, backgroundColor: 'error.light' }}>
                    <Box display="flex" alignItems="center">
                        <ErrorIcon color="error" sx={{ mr: 1 }} />
                        <Typography color="error">{error}</Typography>
                    </Box>
                    {detectedColumns.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" display="block" gutterBottom>
                                Columnas detectadas en el archivo:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {detectedColumns.map(col => (
                                    <Chip
                                        key={col}
                                        label={col}
                                        size="small"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Paper>
            )}

            {file && !isLoading && (
                <Paper elevation={2} sx={{ mt: 2, p: 2 }} >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                                <FileIcon color="success" />
                            </Avatar>
                            <Box sx={{fontSize: 10}}>
                                <Typography variant="subtitle1" sx={{fontSize: 14}}>{file.name}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{fontSize: 11}}>
                                    {fileSize} · {fileData.length} filas procesadas
                                </Typography>
                            </Box>
                        </Box>
                        <Tooltip title="Eliminar archivo">
                            <IconButton onClick={handleRemoveFile}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {fileData.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Vista previa de datos (primeras 3 filas):
                            </Typography>
                            <TableContainer component={Paper} sx={{ maxHeight: 300, overflow: 'auto' }}>
                                <Table size="small" stickyHeader >
                                    <TableHead>
                                        <TableRow>
                                            {Object.keys(fileData[0])
                                                .filter(k => k !== '__rowNumber')
                                                .map(key => (
                                                    <TableCell key={key} sx={{fontSize: 11}}>{key}</TableCell>
                                                ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fileData.slice(0, 2).map((row, i) => (
                                            <TableRow key={i}>
                                                {Object.entries(row)
                                                    .filter(([k]) => k !== '__rowNumber')
                                                    .map(([key, value]) => (
                                                        <TableCell key={key} sx={{fontSize: 11}}>
                                                            {value === null ? 'NULL' : String(value)}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Paper>
            )}

            {fileData.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onFileProcessed?.(fileData)}
                        startIcon={<UploadIcon />}
                    >
                        Enviar Datos
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default UploadExcel;
