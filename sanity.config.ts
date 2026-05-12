import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'

import {projectId, dataset, apiVersion} from './sanity/env'
import {schema} from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'David Travel',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    visionTool({defaultApiVersion: apiVersion}),
  ],
  schema,
})
