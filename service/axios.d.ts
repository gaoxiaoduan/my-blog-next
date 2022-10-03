/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from 'axios'
declare module 'axios' {
 interface IAxios<D = null> {
   code: number
   msg: string
   extra: D
 }
 export interface AxiosResponse<T = any> extends IAxios<D> {}
}
