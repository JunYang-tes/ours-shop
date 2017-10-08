import {host,doGet} from "./index"
export function getRecommandation(count){
  return doGet(`${host}/rest/items/recommendation?count=${count}`)
}
export function getAll(){
  return doGet(`${host}/rest/items/`)
}