import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

dayjs.locale('es');

interface CustomDatePickerProps {
    label?: string;
    defaultValue?: string;
    onChangeValue?: (value: string | null) => void;
    inputFormat?: string;
    returnFormat?: string;
    minDate?: string;
    maxDate?: string;
    requiredField?: boolean;
    disabled?: boolean;
}

const CustomDatePicker = ({
    label = '',
    defaultValue = '',
    onChangeValue = () => {},
    inputFormat = 'DD/MM/YYYY',
    returnFormat = 'YYYY-MM-DD',
    minDate = '1980-01-01',
    maxDate = '',
    requiredField = false,
    disabled = false
}: CustomDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
        defaultValue ? dayjs(defaultValue) : null
    );

    const theme = useTheme();

    useEffect(() => {
        setSelectedDate(defaultValue ? dayjs(defaultValue) : null);
    }, [defaultValue]);

    const handleChange = (newValue: Dayjs | null) => {
        setSelectedDate(newValue);

        const formattedValue = newValue?.isValid()
            ? newValue.format(returnFormat)
            : null;

        onChangeValue(formattedValue);
    };

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es"
        >
            <DatePicker
                label={
                    <>
                        {label}
                        {requiredField && (
                            <span style={{ color: theme.palette.error.main }}>
                                {' '}*
                            </span>
                        )}
                    </>
                }
                value={selectedDate}
                onChange={handleChange}
                minDate={minDate ? dayjs(minDate) : undefined}
                maxDate={maxDate ? dayjs(maxDate) : undefined}
                format={inputFormat}
                disabled={disabled}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        inputProps: {
                            readOnly: true
                        }
                    }
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomDatePicker;