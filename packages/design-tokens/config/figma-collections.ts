export interface FigmaCollectionMode {
  name: string
  /** Paths relative to src/, e.g. 'foundation' or 'colorMode/light' */
  sources: string[]
}

export interface FigmaCollectionConfig {
  name: string
  modes: FigmaCollectionMode[]
  /**
   * Files to exclude from the sources (e.g. 'textStyles.json').
   * Only applies when a source is a directory (like 'foundation').
   */
  excludeFiles?: string[]
}

export const figmaCollections: FigmaCollectionConfig[] = [
  {
    name: 'Foundation',
    modes: [{ name: 'foundation', sources: ['foundation'] }],
    excludeFiles: ['textStyles.json', 'shadows.json'],
  },
  {
    name: 'Color mode',
    modes: [
      { name: 'light', sources: ['colorMode/light'] },
      { name: 'dark', sources: ['colorMode/dark'] },
    ],
  },
]
