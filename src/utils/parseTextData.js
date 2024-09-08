const parseTextData = (textData) => {
    const lines = textData.trim().split('\n');
    const headers = lines[0].split('\t').map(header => header.trim().toLowerCase());
  
    const items = lines.slice(1).map(line => {
      const values = line.split('\t').map(value => value.trim());
      const itemObject = {};
  
      headers.forEach((header, index) => {
        if (header === 'date') {
          itemObject[header] = new Date(values[index]);
        } else if (header === 'quality' || header === 'amount') {
          itemObject[header] = parseInt(values[index], 10);
        } else {
          itemObject[header] = values[index];
        }
      });
  
      return itemObject;
    });
  
    return items;
  };