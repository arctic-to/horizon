import axios from '../axios'

export async function fetchSongDetail(ids: number[]) {
  return axios.get<SongDetailResponse>(`/song/detail?ids=${ids}`)
}

export interface SongDetailResponse {
  songs: Song[]
  privileges: Privilege[]
  code: number
}

export interface Song {
  name: string | null // null if the song is stored in private cloud
  id: number
  pst: number
  t: number
  ar: Ar[]
  alia: any[]
  pop: number
  st: number
  rt: string
  fee: number
  v: number
  crbt: any
  cf: string
  al: Al
  dt: number
  h: H
  m: M
  l: L
  a: any
  cd: string
  no: number
  rtUrl: any
  ftype: number
  rtUrls: any[]
  djId: number
  copyright: number
  s_id: number
  mark: number
  originCoverType: number
  originSongSimpleData: any
  resourceState: boolean
  single: number
  noCopyrightRcmd: any
  mv: number
  rtype: number
  rurl: any
  mst: number
  cp: number
  publishTime: number
}

export interface Ar {
  id: number
  name: string
  tns: any[]
  alias: any[]
}

export interface Al {
  id: number
  name: string
  picUrl: string
  tns: any[]
  pic_str: string
  pic: number
}

export interface H {
  br: number
  fid: number
  size: number
  vd: number
}

export interface M {
  br: number
  fid: number
  size: number
  vd: number
}

export interface L {
  br: number
  fid: number
  size: number
  vd: number
}

export interface Privilege {
  id: number
  fee: number
  payed: number
  st: number
  pl: number
  dl: number
  sp: number
  cp: number
  subp: number
  cs: boolean
  maxbr: number
  fl: number
  toast: boolean
  flag: number
  preSell: boolean
  playMaxbr: number
  downloadMaxbr: number
  rscl: any
  freeTrialPrivilege: FreeTrialPrivilege
  chargeInfoList: ChargeInfoList[]
}

export interface FreeTrialPrivilege {
  resConsumable: boolean
  userConsumable: boolean
}

export interface ChargeInfoList {
  rate: number
  chargeUrl: any
  chargeMessage: any
  chargeType: number
}
