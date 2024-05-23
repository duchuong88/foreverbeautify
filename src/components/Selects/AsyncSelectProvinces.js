import React from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import moreApi from "../../service/more.service";

function AsyncSelectProvinces({ onChange, value, ...props }) {
  const getAllProvinces = async (search, loadedOptions, { page }) => {
    const newPost = {
      Key: search, // Tên Tỉnh thành phố
      Pi: 1,
      Ps: 10
    }
    const { data } = await moreApi.getAllProvinces(newPost)
    const { PCount, Items } = data.result
    const newData =
      Items && Items.length > 0
        ? Items.map(item => ({
            ...item,
            label: item.Title,
            value: item.Id
          }))
        : []
    return {
      options: newData,
      hasMore: page < PCount,
      additional: {
        page: page + 1
      }
    }
  }

  return (
    <AsyncPaginate
      {...props}
      isClearable={true}
      className="select-control"
      classNamePrefix="select"
      loadOptions={getAllProvinces}
      placeholder="Chọn tỉnh thành"
      value={value}
      onChange={onChange}
      additional={{
        page: 1
      }}
    />
  )
}

export default AsyncSelectProvinces
