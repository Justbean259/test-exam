export function parseSortParam(sort?: string): { [key: string]: 1 | -1 } {
 if (!sort || sort === 'undefined') return { timestamp: -1 }
 const [field, order] = sort.split(':')

 return {
  [field.trim().toLowerCase()]:
   order?.trim() === 'asc' || order?.trim() === '1' ? 1 : -1,
 }
}
