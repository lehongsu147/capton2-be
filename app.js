const express = require('express');
const cors = require('cors');
const accountRoutes = require('./routes/account.routes');
const categoryRoutes = require('./routes/categoryRoutes');
const pgtRoutes = require('./routes/pgtRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(express.json());
// Cấu hình CORS
app.use(cors());

// Đăng ký các tuyến đường
app.use('/account', accountRoutes);
app.use('/categories', categoryRoutes);
app.use('/pgt', pgtRoutes);
app.use('/booking', bookingRoutes);
app.use('/banner', bannerRoutes);
app.use('/payment', paymentRoutes);

app.listen(4096, () => {
    console.log('Server is running on port 4096');
});
