export const customSelectStyles = {
    control: (provided: any) => {
      const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
      return {
        ...provided,
        minWidth: '15rem',
        maxWidth: '15rem',
        width: '15rem',
        backgroundColor: savedTheme === 'night' ? '#000000' : '#ffffff',
        borderColor: savedTheme === 'night' ? '#ffffff' : '#000000',
        color: savedTheme === 'night' ? '#ffffff' : '#000000',
        '&:hover': {
          borderColor: savedTheme === 'night' ? '#cccccc' : '#000000',
        },
      };
    },
    menu: (provided: any) => {
      const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
      return {
        ...provided,
        minWidth: '15rem',
        maxWidth: '15rem',
        width: '15rem',
        backgroundColor: savedTheme === 'night' ? '#000000' : '#ffffff',
        color: savedTheme === 'night' ? '#ffffff' : '#000000',
      };
    },
    singleValue: (provided: any) => {
      const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
      return {
        ...provided,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: savedTheme === 'night' ? '#ffffff' : '#000000',
      };
    },
    input: (provided: any) => {
      const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
      return {
        ...provided,
        textAlign: 'left',
        paddingLeft: '0rem',
        color: savedTheme === 'night' ? '#ffffff' : '#000000',
      };
    },
    placeholder: (provided: any) => {
      const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
      return {
        ...provided,
        textAlign: 'left',
        paddingLeft: '0rem',
        color: savedTheme === 'night' ? '#aaaaaa' : '#666666',
      };
    },
    option: (provided: any, state: any) => {
      const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
      return {
        ...provided,
        backgroundColor: state.isSelected
          ? savedTheme === 'night'
            ? '#333333'
            : '#e0e0e0'
          : savedTheme === 'night'
          ? '#000000'
          : '#ffffff',
        color: savedTheme === 'night' ? '#ffffff' : '#000000',
        '&:hover': {
          backgroundColor: '#DB91D1',
        },
      };
    },
    dropdownIndicator: (provided: any) => {
      const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
      return {
        ...provided,
        color: savedTheme === 'night' ? '#ffffff' : '#000000',
        '&:hover': {
          color: savedTheme === 'night' ? '#cccccc' : '#666666',
        },
      };
    },
    clearIndicator: (provided: any) => {
      const savedTheme = localStorage.getItem('theme') as 'night' | 'day' | null;
      return {
        ...provided,
        color: savedTheme === 'night' ? '#ffffff' : '#000000',
        '&:hover': {
          color: savedTheme === 'night' ? '#ff5555' : '#ff0000',
        },
      };
    },
  };