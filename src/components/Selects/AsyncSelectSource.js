import React, { useRef } from 'react'
import AsyncSelect from 'react-select/async'
import moreApi from "../../service/more.service";

function AsyncSelectSource({ value, onChange, ...props }) {
  const typingTimeoutRef = useRef(null)
  const getAllSource = (inputValue, callback) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      moreApi
        .getAllSource({
          _key: inputValue
        })
        .then(({ data }) => {
          const newData =
            data &&
            data.result &&
            data.result.map(item => ({
              ...item,
              label: item.name,
              value: item.name
            }))
          callback(newData)
        })
        .catch(err => console.log(err))
    }, 500)
  }

  return (
    <AsyncSelect
      {...props}
      className="select-control"
      classNamePrefix="select"
      cacheOptions
      loadOptions={(inputValue, callback) => getAllSource(inputValue, callback)}
      defaultOptions
      placeholder="Chọn nguồn khách hàng"
      value={value}
      onChange={onChange}
      isClearable={true}
    />
  );
}

export default AsyncSelectSource
