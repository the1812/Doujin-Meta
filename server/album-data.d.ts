declare module '#album-data' {
  const albums: import('./catalog.js').AlbumSource[]
  export default albums
}
