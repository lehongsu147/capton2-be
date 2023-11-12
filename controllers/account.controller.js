const { StatusCodes } = require("http-status-codes");
const accountModel = require('../models/accountModel')

function isValidEmail(email) {
  // Sử dụng biểu thức chính quy để kiểm tra định dạng email
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

const accountController = {
  // signup
  signupAccount: async (req, res) => {
    const { email, password, isAdmin } = req.body;
    try {
      // Kiểm tra định dạng email
      if (!isValidEmail(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Email không hợp lệ' });
      }

      // Kiểm tra độ dài tối thiểu của mật khẩu
      if (password.length < 6) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
      }

      const response = await accountModel.signupDB(
        email,
        password,
      );
      res.status(StatusCodes.CREATED).json({
        status: response?.status,
        message: response?.message,
      });
    } catch (error) {
      res.status(error.code).json({ error: error.message });
    }
  },
  // login
  loginAccount: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await accountModel.loginDB(email, password);
      if (user) {
        res.status(StatusCodes.OK).json({ user });
      }
      else {
        // res.status(205).json({ error: 'Tên tài khoản hoặc mật khẩu sai'});
        res.status(210).json({ error: 'Tên tài khoản hoặc mật khẩu không chính xác'});
      }
    } catch (error) {
      res.status(400).json({ error: 'Hệ thống lỗi'});
    }
  },
  // login
  updateAccountInfo: async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const user = await accountModel.updateAccountInfoDb(id, updateData);
      if (user) {
        return res.status(200).json({
          status: 200,
          user
        });
      } else {
          return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: 'Hệ thống lỗi'});
    }
  },
};

module.exports = accountController;
