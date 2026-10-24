// CSV Export Utility for InsightIQ Analytics

export const exportToCSV = (data, filename = 'insightiq-export.csv') => {
  if (!data || !data.length) {
    return false;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          let val = row[header];
          if (typeof val === 'object' && val !== null) {
            val = JSON.stringify(val);
          }
          val = String(val ?? '').replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(',')
    )
  ];

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};
