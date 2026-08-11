import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import debounce from 'lodash/debounce';

import {
  All_DESCRIPTIONS_PRODUCTS_ACTIVE,
} from '../../services/Api_Inventario/Api_TomaFisicaInventario';

const DescripcionItem = ({
  setDescriptionProduct,
  organizations = [],
  setOrganizations,
  setCodProducto,
  categoria = '',
  focusBusqueda
}) => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setOpen] = useState(false);

  const inputRef = useRef(null);

  const requestIdRef = useRef(0);

  const options = useMemo(() => {
    return (organizations ?? []).map((org) => ({
      value: org.ad_org_id,
      label: org.name,
    }));
  }, [organizations]);

  const seleccionarTextoInput = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, []);

  const buscarProductos = useCallback(
    async (value) => {
      const texto = value?.trim();

      if (!texto) {
        setOrganizations([]);
        setOpen(false);
        return;
      }

      const requestId = ++requestIdRef.current;

      try {
        setLoading(true);

        const response =
          await All_DESCRIPTIONS_PRODUCTS_ACTIVE(texto, categoria);

        if (requestId !== requestIdRef.current) {
          return;
        }

        const data = Array.isArray(response) ? response : [];

        const uniqueResponse = data.filter(
          (item, index, array) =>
            index ===
            array.findIndex(
              (product) => product.ad_org_id === item.ad_org_id
            )
        );

        setOrganizations(uniqueResponse);
        setOpen(uniqueResponse.length > 0);

      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        console.error('Error buscando productos:', error);

        setOrganizations([]);
        setOpen(false);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [categoria, setOrganizations]
  );
useEffect(() => {
    if (focusBusqueda > 0) {
        setSelectedOption(null);
        setInputValue('');
        setOpen(false);

        setDescriptionProduct('');
        setCodProducto('');
        setOrganizations([]);

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    }
}, [focusBusqueda]);

  const debouncedFetch = useMemo(() => {
    return debounce((texto) => {
      buscarProductos(texto);
    }, 500);
  }, [buscarProductos]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
      requestIdRef.current += 1;
    };
  }, [debouncedFetch]);

  const handleSelect = (event, newValue) => {
    if (!newValue) {
      setSelectedOption(null);
      setDescriptionProduct('');
      setCodProducto('');
      setInputValue('');
      setOpen(false);

      seleccionarTextoInput();
      return;
    }

    if (typeof newValue === 'string') {
      setSelectedOption(null);
      setDescriptionProduct(newValue);
      setCodProducto('');
      setInputValue(newValue);
      setOpen(false);

      seleccionarTextoInput();
      return;
    }

    setSelectedOption(newValue);
    setDescriptionProduct(newValue.label ?? '');
    setCodProducto(newValue.value ?? '');
    setInputValue(newValue.label ?? '');
    setOpen(false);

    seleccionarTextoInput();
  };

  const handleInputChange = (event, newInputValue, reason) => {
    setInputValue(newInputValue);

    if (reason === 'input') {
      setSelectedOption(null);
      setCodProducto('');
      setDescriptionProduct(newInputValue);

      const texto = newInputValue.trim();

      if (texto) {
        debouncedFetch(newInputValue);
      } else {
        debouncedFetch.cancel();
        requestIdRef.current += 1;

        setOrganizations([]);
        setOpen(false);
      }

      return;
    }

    if (reason === 'clear') {
      debouncedFetch.cancel();
      requestIdRef.current += 1;

      setSelectedOption(null);
      setDescriptionProduct('');
      setCodProducto('');
      setOrganizations([]);
      setInputValue('');
      setOpen(false);

      seleccionarTextoInput();
    }
  };

  const handleEnterSearch = async (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    if (open && options.length === 1) {
      event.preventDefault();
      event.stopPropagation();

      handleSelect(event, options[0]);
      return;
    }

    if (open && options.length > 1) {
      return;
    }

    const texto = event.currentTarget.value.trim();

    if (!texto) {
      setOrganizations([]);
      setOpen(false);
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    debouncedFetch.cancel();

    await buscarProductos(texto);
  };

  const handleBlur = () => {
    if (!selectedOption && !inputValue.trim()) {
      debouncedFetch.cancel();

      setDescriptionProduct('');
      setCodProducto('');
      setOrganizations([]);
      setOpen(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Autocomplete
        freeSolo
        id="autocomplete-organization"
        loading={loading}
        open={open}
        autoHighlight={false}
        clearOnBlur={false}
        options={options}
        value={selectedOption}
        inputValue={inputValue}
        onOpen={() => {
          if (options.length > 0) {
            setOpen(true);
          }
        }}
        onClose={() => setOpen(false)}
        onChange={handleSelect}
        onInputChange={handleInputChange}
        filterOptions={(currentOptions) => currentOptions}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }

          return option?.label ?? '';
        }}
        isOptionEqualToValue={(option, value) => {
          if (!option || !value) {
            return false;
          }

          if (typeof value === 'string') {
            return option.label === value;
          }

          return option.value === value.value;
        }}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
        loadingText="Buscando..."
        noOptionsText="Sin resultados"
        renderInput={(params) => (
    <TextField
        {...params}
        inputRef={inputRef}
        label="Buscar Descripción Producto"
        onBlur={handleBlur}
        onKeyDown={handleEnterSearch}
        slotProps={{
            input: {
                ...params.InputProps,
                type: 'search',
                endAdornment: (
                    <>
                        {loading && (
                            <CircularProgress size={20} />
                        )}

                        {params.InputProps.endAdornment}
                    </>
                ),
            },
        }}
    />
)}
      />
    </Stack>
  );
};

export default DescripcionItem;