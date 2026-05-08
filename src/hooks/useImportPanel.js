import { useState } from 'react';

export const useImportPanel = ({ config }) => {
  const { requiredFields, createService, itemType, previewColumns } = config;

  const [jsonText, setJsonText] = useState('');

  const [parsedData, setParsedData] = useState([]);

  const [invalidItems, setInvalidItems] = useState([]);

  const [importResults, setImportResults] = useState([]);

  const [isValidated, setIsValidated] = useState(false);

  // json格式驗證
  const handleValidate = () => {
    try {
      const json = JSON.parse(jsonText);

      if (!Array.isArray(json)) {
        throw new Error('資料格式必須為陣列');
      }

      const invalids = json.filter((item) => {
        return !requiredFields.every((field) => {
          return item[field] !== undefined;
        });
      });

      setParsedData(json);
      setInvalidItems(invalids);

      setIsValidated(true);
    } catch (error) {
      console.error(error);

      setParsedData([]);
      setInvalidItems([]);
      setIsValidated(false);
    }
  };

  // 資料匯入
  const handleImport = async () => {
    if (!isValidated) {
      return;
    }

    if (invalidItems.length > 0) {
      return;
    }
    const results = [];

    for (const item of parsedData) {
      try {
        await createService(item); // 由父層傳入 像是Product 傳入 createProduct

        results.push({
          title: item.title,
          status: 'success',
        });
      } catch (error) {
        results.push({
          title: item.title,
          status: 'failed',
          reason: error.message,
        });
      }
    }

    setImportResults(results);
  };

  return {
    itemType,
    jsonText,
    setJsonText,

    parsedData,
    previewColumns,

    isValidated,
    invalidItems,

    importResults,

    handleValidate,
    handleImport,
  };
};
