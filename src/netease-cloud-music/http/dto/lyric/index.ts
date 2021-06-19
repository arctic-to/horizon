export interface LyricResponse {
  code: number
  sgc: boolean
  sfy: boolean
  qfy: boolean

  /** lyric case */
  lrc?: Lrc
  klyric?: Klyric
  tlyric?: Tlyric

  /** no lyric case */
  nolyric?: boolean
  uncollected?: boolean
  needDesc?: boolean
  briefDesc?: null
}

export interface Lrc {
  version: number
  lyric: string
}

export interface Klyric {
  version: number
  lyric: string
}

export interface Tlyric {
  version: number
  lyric: string
}
