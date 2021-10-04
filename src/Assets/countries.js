const countries = [
  {
    code: "AU",
    label: "Australia",
    phone: "61",
    suggestedCurrency: "AUD",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "AT",
    label: "Austria",
    phone: "43",
    suggestedCurrency: "Euro",
    minLengthNoZero: 10,
    maxLengthNoZero: 11,
  },
  {
    code: "BE",
    label: "Belgium",
    phone: "32",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "BG",
    label: "Bulgaria",
    phone: "359",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "CA",
    label: "Canada",
    phone: "1",
    suggestedCurrency: "CAD",
    minLengthNoZero: 10,
    maxLengthNoZero: 10,
  },
  {
    code: "HR",
    label: "Croatia",
    phone: "385",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "CY",
    label: "Cyprus",
    phone: "357",
    suggestedCurrency: "Euro",
    minLengthNoZero: 8,
    maxLengthNoZero: 8,
  },
  {
    code: "CZ",
    label: "Czechia",
    phone: "420",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "DK",
    label: "Denmark",
    phone: "45",
    suggestedCurrency: "Euro",
    minLengthNoZero: 8,
    maxLengthNoZero: 8,
  },
  {
    code: "EE",
    label: "Estonia",
    phone: "372",
    suggestedCurrency: "Euro",
    minLengthNoZero: 7,
    maxLengthNoZero: 13,
  },
  {
    code: "FI",
    label: "Finland",
    phone: "358",
    suggestedCurrency: "Euro",
    minLengthNoZero: 10,
    maxLengthNoZero: 10,
  },
  {
    code: "FR",
    label: "France",
    phone: "33",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "DE",
    label: "Germany",
    phone: "49",
    suggestedCurrency: "Euro",
    minLengthNoZero: 10,
    maxLengthNoZero: 11,
  },
  {
    code: "GR",
    label: "Greece",
    phone: "30",
    suggestedCurrency: "Euro",
    minLengthNoZero: 10,
    maxLengthNoZero: 10,
  },
  {
    code: "HU",
    label: "Hungary",
    phone: "36",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "IE",
    label: "Ireland",
    phone: "353",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "IL",
    label: "Israel",
    phone: "972",
    suggestedCurrency: "USD",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "IT",
    label: "Italy",
    phone: "39",
    suggestedCurrency: "Euro",
    minLengthNoZero: 10,
    maxLengthNoZero: 13,
  },
  {
    code: "LV",
    label: "Latvia",
    phone: "371",
    suggestedCurrency: "Euro",
    minLengthNoZero: 8,
    maxLengthNoZero: 8,
  },
  {
    code: "LT",
    label: "Lithuania",
    phone: "370",
    suggestedCurrency: "Euro",
    minLengthNoZero: 8,
    maxLengthNoZero: 8,
  },
  {
    code: "LU",
    label: "Luxembourg",
    phone: "352",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "MT",
    label: "Malta",
    phone: "356",
    suggestedCurrency: "Euro",
    minLengthNoZero: 7,
    maxLengthNoZero: 13,
  },
  {
    code: "NL",
    label: "Netherlands",
    phone: "31",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "NZ",
    label: "New Zealand",
    phone: "64",
    suggestedCurrency: "USD",
    minLengthNoZero: 8,
    maxLengthNoZero: 10,
  },
  {
    code: "NO",
    label: "Norway",
    phone: "47",
    suggestedCurrency: "USD",
    minLengthNoZero: 8,
    maxLengthNoZero: 8,
  },
  {
    code: "PL",
    label: "Poland",
    phone: "48",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "PT",
    label: "Portugal",
    phone: "351",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "RO",
    label: "Romania",
    phone: "40",
    suggestedCurrency: "Euro",
    minLengthNoZero: 10,
    maxLengthNoZero: 10,
  },
  {
    code: "SK",
    label: "Slovakia",
    phone: "421",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "SI",
    label: "Slovenia",
    phone: "386",
    suggestedCurrency: "Euro",
    minLengthNoZero: 7,
    maxLengthNoZero: 13,
  },
  {
    code: "ES",
    label: "Spain",
    phone: "34",
    suggestedCurrency: "Euro",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "SE",
    label: "Sweden",
    phone: "46",
    suggestedCurrency: "Euro",
    minLengthNoZero: 7,
    maxLengthNoZero: 10,
  },
  {
    code: "CH",
    label: "Switzerland",
    phone: "41",
    suggestedCurrency: "USD",
    minLengthNoZero: 9,
    maxLengthNoZero: 9,
  },
  {
    code: "GB",
    label: "United Kingdom",
    phone: "44",
    suggestedCurrency: "GBP",
    minLengthNoZero: 10,
    maxLengthNoZero: 10,
  },
  {
    code: "US",
    label: "United States",
    phone: "1",
    suggestedCurrency: "USD",
    minLengthNoZero: 10,
    maxLengthNoZero: 10,
  },
];

export default countries;
