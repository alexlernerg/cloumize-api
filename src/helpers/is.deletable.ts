// TODO: Esto es para limitar el uso de is.deletable en el resto de los helpers
const deletableTables = ['user']

export default (table:string): boolean => {
  return deletableTables.includes(table)
}
