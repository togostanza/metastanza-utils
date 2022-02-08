export default function applyFilter(data, filter) {
  return data.filter((record) =>
    filter.every((filter) => {
      switch (filter.type) {
        case "substring":
          if (filter.target === null) {
            return Object.values(record).some((value) =>
              value.toString().includes(filter.value)
            );
          } else {
            return record[filter.target].toString().includes(filter.value);
          }
        case "lte":
          return record[filter.target] <= filter.value;
        case "gte":
          return record[filter.target] >= filter.value;
        default:
          throw new Error(`unsupported filter type ${filter.type}`);
      }
    })
  );
}
