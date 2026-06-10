// services

// import { createProduct } from '@/services/productService';

// import { createProduct } from '@/constants/adminBuilderMaps';
// import { createProduct } from '@/utils/adminBuilderUtils';

// hooks
import { useImportPanel } from '@/hooks/useImportPanel';
// utils
import { getLabelByValue } from '@/utils/adminBuilderUtils';
// config
import { productImportConfig } from '@/config/productImportConfig';

// 先處理商品後面，透過載入constants(product、coupon、article)共用化

const ImportPanel = () => {
  const config = productImportConfig;
  const {
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
  } = useImportPanel({ config });

  const renderPreviewValue = (column, value) => {
    if (column.formatter) {
      return column.formatter(value);
    }

    if (column.map) {
      return getLabelByValue(column.map, value);
    }

    return value;
  };

  return (
    <>
      <div className="admin-panel">
        <div className="admin-panel__header">
          <h3>批量匯入 - {itemType}資料</h3>
        </div>

        <div className="admin-panel__body">
          <div className="row">
            <div className="col-12">
              <textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
            </div>
            <div className="col-12">
              {parsedData.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      {previewColumns.map((column) => (
                        <th key={column.key}>{column.label}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {parsedData.map((item) => (
                      <tr key={item.title}>
                        {/* {previewColumns.map((column) => {
                          const value = item[column.key];

                          return (
                            <td key={column.key}>
                              {column.formatter
                                ? column.formatter(value)
                                : column.map
                                  ? getLabelByValue(column.map, value)
                                  : value}
                            </td>
                          );
                        })} */}
                        {previewColumns.map((column) => {
                          const value = item[column.key];
                          return <td key={column.key}>{renderPreviewValue(column, value)}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="col-12">
              {isValidated && <div className="alert alert-success">JSON 驗證成功</div>}
              {invalidItems.length > 0 && (
                <div className="alert alert-danger">有 {invalidItems.length} 筆資料缺少欄位</div>
              )}
            </div>
            <div className="col-12">
              {importResults.length > 0 && (
                <ul>
                  {importResults.map((result) => (
                    <li key={result.title}>
                      {result.title} - {result.status}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="admin-panel__footer">
          <button type="button" className="btn btn-primary" onClick={handleValidate}>
            驗證 JSON
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!isValidated}
          >
            開始匯入
          </button>
        </div>
      </div>
    </>
  );
};

export default ImportPanel;
