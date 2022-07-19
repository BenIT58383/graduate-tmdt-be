export const CONFIG_TIME = {
  START_TIME: '00:00:00',
  END_TIME: '23:59:59',
}

export const MESSAGE_THROW_ERROR = {
  PHONE_CONFLICT: 'Số điện thoại này đã tồn tại',
  USER_NAME_CONFLICT: 'Tên đăng nhập đã tồn tại',
  EMAIL_CONFLICT: 'Email đã tồn tại',
  PHONE_CONFLICT: 'Số điện thoại này đã tồn tại',
  PHONE_NOT_FOUND: 'Không tìm thấy số điện thoại này',
  USER_CONFLICT: 'Người dùng này đã tồn tại',
  USER_NOT_FOUND: 'Không tìm thấy người dùng này',
  ERR_USER_NAME_PHONE_EMAIL_OR_PASSWORD: 'Sai tài khoản hoặc mật khẩu!',
  LOGIN: 'Mời bạn đăng nhập!',
  AUTH: 'Không có quyền truy cập!',
  PRODUCT_NOTFOUND: 'Không tìm thấy sản phẩm này',
  PRODUCT_CODE_CONFLICT: 'Mã sản phẩm này đã tồn tại',
  STORE_NAME_CONFLICT: 'Tên cửa hàng đã tồn tại',
  STORE_NOT_FOUND: 'Cửa hàng không tồn tại',
  CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục này',
  CATEGORY_CONFLICT: 'Danh mục này đã tồn tại',
  ADDRESS_NOT_FOUND: 'Không tìm thấy danh mục này',
  ADDRESS_CONFLICT: 'Danh mục này đã tồn tại',
  UNIT_NOT_FOUND: 'Không tìm thấy đơn vị này',
  UNIT_CONFLICT: 'Đơn vị này đã tồn tại',
  PRODUCT_NOT_EMPTY: 'Sản phẩm không được để trống',
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
  QUANTITY_PRODUCT_AND_ORDER:
    'Số lượng sản phẩm trong cửa hàng phải lớn hơn số lượng mua',
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng này',
  ORDER_DO_NOT_HANDLE: 'Không thể xử lí đơn hàng đang trong trạng thái này',
}

export const CONFIG_ORDER_STATUS = {
  CANCEL: 0,
  NEW: 1,
  PROCESSING: 2,
  FINISHED: 3,
}

export const USER_ROLE = {
  CUSTOMER: 1,
  STORE: 2,
  ADMIN: 3,
}

export const ACTIVE_STATUS = {
  IN_ACTIVE: 0,
  ACTIVE: 1,
}
