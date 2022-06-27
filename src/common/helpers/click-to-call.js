import axios from 'axios'
import httpStatus from 'http-status'
import { APIError } from '../../common/helpers/api-error'

const ClickToCall = async (sip, phone) => {
  let url = `${process.env.URL_CLICK_TO_CALL}?voip=${process.env.VOIP_API_KEY}&secret=${process.env.VOIP_SECRET}&sip=${sip}&phone=${phone}`
  let res = {}
  await axios
    .get(`${url}`)
    .then((response) => {
      res = response.data
    })
    .catch((error) => {
      throw new APIError(error, httpStatus.FORBIDDEN)
    })
  return res
}
export default {
  ClickToCall,
}
