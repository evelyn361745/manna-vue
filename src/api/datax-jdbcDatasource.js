import request from '@/utils/request'

// datax插件api

export function list(params) {
  return request({
    url: '/datasource/info',
    method: 'get',
    params
  })
}

export function fetched(params) {
  return request({
    url: '/jobJdbcDatasource/' + params,
    method: 'get'
  })
}

export function updated(data) {
  return request({
    url: '/jobJdbcDatasource',
    method: 'put',
    data
  })
}

export function created(data) {
  return request({
    url: '/datasource/info',
    method: 'post',
    data
  })
}

export function deleted(data) {
  return request({
    url: '/jobJdbcDatasource',
    method: 'delete',
    params: data
  })
}

export function test(data) {
  return request({
    url: '/datasource/test',
    method: 'post',
    data
  })
}
