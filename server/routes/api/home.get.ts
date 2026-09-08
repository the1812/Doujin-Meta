import { defineHandler } from 'nitro'

import { useAlbumCatalog } from '../../catalog-instance.js'

export default defineHandler(() => useAlbumCatalog().home())
