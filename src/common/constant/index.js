export const CONFIG_TIME = {
  START_TIME: '00:00:00',
  END_TIME: '23:59:59',
}

export const TYPE_CREATE_ORDER_SHOPEE_PAY = {
  DYNAMIC_QR: 'DYNAMIC_QR',
  JYMP_APP: 'JYMP_APP',
}

export const MESSAGE_THROW_ERROR = {
  PHONE_CONFLICT: 'số điện thoại này đã tồn tại',
  PHONE_NOT_FOUND: 'không tìm thấy số điện thoại này',
  USER_CONFLICT: 'người dùng này đã tồn tại',
  USER_NOT_FOUND: 'Không tìm thấy người dùng này',
  ERR_PHONE_OR_PASSWORD: 'sai tài khoản hoặc mật khẩu!',
  LOGIN: 'mời bạn đăng nhập!',
  AUTH: 'không có quyền truy cập!',
}

export const USER_TYPE = {
  ADMIN: 1,
  CUSTOMER: 2,
}

export const ORDER_PAYMENT_STATUS = {
  PAID: 'PAID', //đã thanh toán
  UNPAID: 'UNPAID', //chưa thanh toán
}

export const TRANSACTION_STATUS = {
  PROCESSING: 2,
  SUCCESSFULL: 3,
  FAILED: 4,
}

export const TRANSACTION_TYPE = {
  PAYMENT: 13,
  REFUND: 15,
}

export const ORDER_STATUS = {
  WAITTING_APPROVE: 3,
  APPROVED: 7,
  WAITTING_PAYMENT: 73,
}
