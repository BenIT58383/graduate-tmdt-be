import Xlsx from 'xlsx'
import XlsxStyle from 'xlsx-style'

const path = require('path')

const writeToCell = (workSheet, value, location) => {
  const baseStyle = workSheet[location].s

  Xlsx.utils.sheet_add_aoa(workSheet, [[value]], {
    origin: location,
    cellStyles: true,
  })
  workSheet[location].s = baseStyle
}

// mergeObj ex: [{ s: { r: 16, c: 0 }, e: { r: 23, c: 0 } }]
const mergeCell = (workSheet, mergeObj) => {
  const merge = workSheet['!merges']
  workSheet['!merges'] = [...merge, ...mergeObj]
}

const insertRowFromOrigin = (workSheet, originRow, numberOfRow) => {
  let coords = Object.keys(workSheet)
  coords = coords.filter(item => item.charAt(0) != '!')
  let wb_ref = workSheet['!ref']
  let wb_ref_arr = wb_ref.split(':')
  let deepest_coord = wb_ref_arr[1]

  let deepest_row, deepest_col
  if (/\d/.test(deepest_coord.charAt(1))) {
    //second char in coord is a digit (e.g. A12)
    deepest_row = deepest_coord.substring(1)
    deepest_col = deepest_coord.substring(0, 1)
  } else {
    deepest_row = deepest_coord.substring(2)
    deepest_col = deepest_coord.substring(0, 2)
  }

  deepest_row = (parseInt(deepest_row) + parseInt(numberOfRow)).toString()

  let new_wb_ref = wb_ref_arr[0] + ':' + deepest_col + deepest_row
  workSheet['!ref'] = new_wb_ref

  // Get base style
  let baseStyles = []
  for (let i = 0; i < coords.length; i++) {
    let row, col

    if (/\d/.test(coords[i].charAt(1))) {
      //second char in coord is a digit (e.g. A12)
      row = coords[i].substring(1)
      col = coords[i].substring(0, 1)
    } else {
      //second char in coord is NOT a digit (e.g. AC1)
      row = coords[i].substring(2)
      col = coords[i].substring(0, 2)
    }
    if (row == originRow) {
      const cell = col + row
      const baseStyle = workSheet[cell].s
      baseStyles.push({ style: baseStyle, col })
    }
  }
  // Add new row with style
  for (let i = originRow; i <= originRow + numberOfRow; i++) {
    for (const style of baseStyles) {
      const cell = style.col + i
      Xlsx.utils.sheet_add_aoa(workSheet, [['']], { origin: cell })
      workSheet[cell].s = style.style
    }
  }
}

// rangeFrom ex: { 's': 11, 'e': 15 }
// rangeTo ex: { 's': 16, 'e': 20}
const moveRow = (workSheet, rangeFrom, rangeTo) => {
  let coords = Object.keys(workSheet)
  coords = coords.filter(item => item.charAt(0) != '!')
  // Get base style
  let baseStyles = []
  for (let i = 0; i < coords.length; i++) {
    let row, col

    if (/\d/.test(coords[i].charAt(1))) {
      //second char in coord is a digit (e.g. A12)
      row = coords[i].substring(1)
      col = coords[i].substring(0, 1)
    } else {
      //second char in coord is NOT a digit (e.g. AC1)
      row = coords[i].substring(2)
      col = coords[i].substring(0, 2)
    }
    if (row == rangeFrom.s) {
      const cell = col + row
      const baseStyle = workSheet[cell].s
      baseStyles.push({ style: baseStyle, col })
    }
  }
}

const readTemplate = (fileName, sheetName) => {
  // Load template
  const filePath = path.resolve(fileName)
  // Read work book template
  const workbook = XlsxStyle.readFile(filePath, {
    cellStyles: true,
  })
  // Read work sheet template
  const workSheet = workbook.Sheets[sheetName]
  return workSheet
}

const fillDataByJson = (workSheet, data, startCell) => {
  Xlsx.utils.sheet_add_json(workSheet, data, {
    skipHeader: true,
    origin: startCell,
    dateNF: 'dd/mm/yyyy',
  })
}

export default {
  writeToCell,
  mergeCell,
  insertRowFromOrigin,
  readTemplate,
  fillDataByJson,
}
