require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const QRCode = require('qrcode');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); 

// ==========================================
// UPLOADS & ASSETS SETUP
// ==========================================
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static('uploads'));
app.use('/Assets', express.static(path.join(__dirname, 'Assets')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ==========================================
// DATABASE CONNECTION (Pooled)
// ==========================================
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'f1_merch',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// REAL GMAIL GATEWAY CONFIGURATION
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS  
    }
});

const sendF1Notification = (toEmail, subject, htmlContent) => {
    const mailOptions = {
        from: `"F1 Pitlane Gateway" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject: subject,
        html: `
            <div style="background: #000; color: white; padding: 30px; font-family: sans-serif; border: 1px solid #333;">
                <div style="border-left: 5px solid #e10600; padding-left: 15px;">
                    <h1 style="color: #e10600; margin: 0; font-size: 24px;">F1™ OFFICIAL TELEMETRY</h1>
                </div>
                <div style="padding: 20px 0; line-height: 1.6; font-size: 15px;">
                    ${htmlContent}
                </div>
                <div style="border-top: 1px solid #222; padding-top: 10px; font-size: 10px; color: #444;">
                    Automated system response. Verification ID: ${Math.random().toString(36).substring(7).toUpperCase()}
                </div>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("📧 Real Gmail Error:", error);
        else console.log("📧 Real Telemetry Delivered to: " + toEmail);
    });
};

const saveCustomImage = (base64Data) => {
    try {
        if (!base64Data || !base64Data.includes('base64')) return base64Data;
        const base64Image = base64Data.split(';base64,').pop();
        const filename = `custom-${Date.now()}.png`;
        const filepath = path.join(__dirname, 'uploads', filename);
        fs.writeFileSync(filepath, base64Image, { encoding: 'base64' });
        return `http://localhost:5000/uploads/${filename}`;
    } catch (err) { return null; }
};

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: "Email already exists." });
        sendF1Notification(email, "F1: Profile Activated", `<h2>WELCOME PILOT ${name.toUpperCase()}</h2><p>Your profile is now synced with the Pitlane database.</p>`);
        res.status(200).json({ message: "Account created!" });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, data) => {
        if (err || data.length === 0) return res.status(404).json({ message: "User not found" });
        const match = await bcrypt.compare(password, data[0].password_hash);
        if (!match) return res.status(401).json({ message: "Wrong password" });
        
        const otp = Math.floor(100000 + Math.random() * 900000);
        sendF1Notification(email, "F1 Security: Login OTP", `
            <h2>SECURITY AUTHENTICATION</h2>
            <p>Use the following code to authorize access to the Gateway:</p>
            <h1 style="color: #e10600; letter-spacing: 10px;">${otp}</h1>
        `);

        const { password_hash, ...user } = data[0];
        res.status(200).json({ user, otp }); 
    });
});

// ==========================================
// 2. SHOP DATA (MERCH & TICKETS)
// ==========================================

app.get('/api/merch', (req, res) => {
    db.query("SELECT * FROM products WHERE category = 'merch'", (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

app.get('/api/tickets', (req, res) => {
    const sql = "SELECT p.*, t.id as tier_id, t.tier_label, t.tier_price, t.perks FROM products p LEFT JOIN ticket_tiers t ON p.id = t.product_id WHERE p.category = 'ticket'";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        const tickets = data.reduce((acc, row) => {
            let ticket = acc.find(t => t.id === row.id);
            if (!ticket) {
                ticket = { id: row.id, name: row.name, circuit: row.circuit_name, date: row.race_date, image_url: row.image_url, mapImg: row.map_image_url, tiers: [] };
                acc.push(ticket);
            }
            if (row.tier_id) ticket.tiers.push({ id: row.tier_id, label: row.tier_label, price: row.tier_price, perks: row.perks ? row.perks.split(',') : [] });
            return acc;
        }, []);
        res.json(tickets);
    });
});

app.get('/api/seats/:productId/:tierId', (req, res) => {
    const { productId, tierId } = req.params;
    db.query("SELECT * FROM seat_availability WHERE product_id = ? AND tier_id = ?", [productId, tierId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// ==========================================
// 3. ORDER & CHECKOUT SYSTEM (WITH DIGITAL QR PASSES)
// ==========================================

app.post('/api/orders/create', (req, res) => {
    const { userId, email, transactionId, totalAmount, paymentMethod, shippingData, cartItems } = req.body;
    db.getConnection((err, connection) => {
        if (err) return res.status(500).send();
        connection.beginTransaction((err) => {
            const orderSql = "INSERT INTO orders (user_id, transaction_id, total_amount, payment_method, shipping_address, city, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            const orderValues = [userId, transactionId, totalAmount, paymentMethod || 'Visa', shippingData.address, shippingData.city, shippingData.phone, 'Authorized'];
            
            connection.query(orderSql, orderValues, (err, result) => {
                if (err) return connection.rollback(() => { connection.release(); res.status(500).send(); });
                const newOrderId = result.insertId;

                const itemValues = cartItems.map(item => [
                    newOrderId, 
                    (typeof item.id === 'string' && item.id.includes('ticket') ? item.id.split('-')[1] : item.id), 
                    item.quantity || 1, item.material || 'Standard', item.seatNumber || null, item.price, 
                    item.isCustom ? saveCustomImage(item.image_url) : item.image_url
                ]);

                connection.query("INSERT INTO order_items (order_id, product_id, quantity, material_type, seat_number, price_at_purchase, custom_image_path) VALUES ?", [itemValues], (err) => {
                    if (err) return connection.rollback(() => { connection.release(); res.status(500).send(); });

                    // 🚨 🏁 SEAT OCCUPATION SYNC 🏁 🚨
                    const ticketItems = cartItems.filter(item => item.db_id); // Filter for seats with database IDs
                    if (ticketItems.length > 0) {
                        const seatIds = ticketItems.map(item => item.db_id);
                        connection.query("UPDATE seat_availability SET is_occupied = 1, user_id = ? WHERE id IN (?)", [userId, seatIds], (err) => {
                            if (err) return connection.rollback(() => { connection.release(); res.status(500).send(); });
                            
                            // 🚨 FIXED: Added missing userId parameter to match helper definition
                            finalizeOrder(connection, newOrderId, userId, email, totalAmount, cartItems, res);
                        });
                    } else {
                        // 🚨 FIXED: Added missing userId parameter here as well
                        finalizeOrder(connection, newOrderId, userId, email, totalAmount, cartItems, res);
                    }
                });
            });
        });
    });
});

// Helper to wrap the final commit, generate QR codes, and email
const finalizeOrder = async (connection, newOrderId, userId, email, totalAmount, cartItems, res) => {
    try {
        const ticketItems = cartItems.filter(item => item.db_id); // Only grab actual seats
        let generatedPassesHtml = '';

        // Loop through each seat and generate a unique Digital Pass
        for (const item of ticketItems) {
            // 1. Generate an unhackable F1 token
            const uniqueHash = `F1-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
            
            // 2. Generate the QR Code image (base64)
            const qrImageBase64 = await QRCode.toDataURL(uniqueHash, {
                color: { dark: '#e10600', light: '#ffffff' } // F1 Red QR Code
            });

            // 3. Save to database
            await new Promise((resolve, reject) => {
                connection.query(
                    "INSERT INTO digital_passes (order_id, user_id, seat_id, unique_hash, qr_data) VALUES (?, ?, ?, ?, ?)",
                    [newOrderId, userId, item.db_id, uniqueHash, qrImageBase64],
                    (err) => err ? reject(err) : resolve()
                );
            });

            // 4. Build the HTML for the email
            generatedPassesHtml += `
                <div style="background: #111; padding: 15px; border: 1px dashed #e10600; margin: 10px 0; text-align: center;">
                    <p style="color: #e10600; font-weight: bold; margin: 0;">${item.name.toUpperCase()}</p>
                    <p style="font-size: 13px; margin: 5px 0; color: #fff;">SEAT: ${item.seatNumber} | TIER: ${item.tierLabel}</p>
                    <img src="${qrImageBase64}" alt="QR Pass" style="width: 150px; height: 150px; margin-top: 10px; border: 3px solid #fff;" />
                    <p style="font-size: 10px; color: #888; margin-top: 5px;">HASH: ${uniqueHash}</p>
                </div>
            `;
        }

        connection.commit(() => {
            connection.release();

            const ticketHtml = `
                <div style="border: 2px solid #e10600; padding: 20px; background: #050505; border-radius: 10px; font-family: sans-serif;">
                    <h2 style="color: #e10600; margin-top: 0; text-align: center;">DIGITAL ASSET DELIVERED</h2>
                    <p style="color: #fff; text-align: center;">Present this QR code at the Pitlane Gateway.</p>
                    
                    <div style="margin: 20px 0;">
                        <p style="color: #fff; margin: 5px 0;"><strong>ORDER ID:</strong> #${newOrderId}</p>
                        <hr style="border: 0; border-top: 1px solid #222;">
                        ${generatedPassesHtml}
                    </div>
                </div>
            `;

            sendF1Notification(email, `F1 Digital Pass: Order #${newOrderId}`, ticketHtml);
            res.status(200).json({ success: true, order_id: newOrderId });
        });

    } catch (error) {
        connection.rollback(() => {
            connection.release();
            res.status(500).json({ success: false, message: "Pass generation failed." });
        });
    }
};

// ==========================================
// 4. RESALE SYSTEM
// ==========================================

app.post('/api/resale/submit', upload.single('image'), (req, res) => {
    const { serial, orderId, purchaseDate, signature, email, sellerName } = req.body;
    const signaturePath = saveCustomImage(signature); 
    const ticketScanPath = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;
    const sql = `INSERT INTO ticket_resales (serial_number, order_id, purchase_date, signature_path, ticket_scan_path, user_email, seller_name) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [serial, orderId, purchaseDate, signaturePath, ticketScanPath, email, sellerName], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.status(200).json({ success: true });
    });
});

app.get('/api/resale/market', (req, res) => {
    db.query("SELECT * FROM ticket_resales WHERE status = 'Approved'", (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// ==========================================
// 5. ADMIN DASHBOARD ROUTES
// ==========================================

app.get('/api/admin/resale-requests', (req, res) => {
    db.query("SELECT * FROM ticket_resales ORDER BY created_at DESC", (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

app.get('/api/admin/orders', (req, res) => {
    const sql = `SELECT o.id AS order_id, o.transaction_id, o.total_amount, o.status, o.created_at, oi.*, p.name AS product_name 
                 FROM orders o JOIN order_items oi ON o.id = oi.order_id LEFT JOIN products p ON oi.product_id = p.id ORDER BY o.created_at DESC`;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        const orders = data.reduce((acc, row) => {
            let order = acc.find(o => o.order_id === row.order_id);
            if (!order) {
                order = { order_id: row.order_id, transaction_id: row.transaction_id, total: row.total_amount, status: row.status, date: row.created_at, items: [] };
                acc.push(order);
            }
            order.items.push({ name: row.product_name || `Custom Asset`, qty: row.quantity, material: row.material_type, seat: row.seat_number, price: row.price_at_purchase, custom_img: row.custom_image_path });
            return acc;
        }, []);
        res.json(orders);
    });
});

app.post('/api/admin/resale/action', (req, res) => {
    const { requestId, status, email, serial } = req.body;
    db.query("UPDATE ticket_resales SET status = ? WHERE id = ?", [status, requestId], (err) => {
        if (err) return res.status(500).json({ success: false });
        
        if (status === 'Approved') {
            // 🏎️ PROFESSIONAL MARKET AUTHORIZATION EMAIL
            const approveHtml = `
                <div style="background: #050505; color: #ffffff; padding: 30px; border: 1px solid #00ff41; border-radius: 8px;">
                    <h1 style="color: #00ff41; margin: 0;">ASSET AUTHORIZED</h1>
                    <p>Your liquidation request for <strong>Asset Serial: ${serial}</strong> has passed the secondary market audit.</p>
                    <div style="background: #111; border-left: 4px solid #00ff41; padding: 15px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #00ff41;">WHAT HAPPENS NEXT?</h3>
                        <ul style="padding-left: 20px; line-height: 1.6;">
                            <li>Your ticket is now visible in the Verified Secondary Market.</li>
                            <li>Your original QR code is now VOID.</li>
                            <li>Funds will be disbursed minus the 10% commission upon sale.</li>
                        </ul>
                    </div>
                    <a href="http://localhost:3000/resale" style="display: inline-block; padding: 10px 20px; background: #e10600; color: white; text-decoration: none; font-weight: bold;">VIEW MARKET LISTING</a>
                </div>
            `;
            sendF1Notification(email, `F1 GATEWAY: Asset ${serial} Approved`, approveHtml);
        } else {
            // ❌ AUDIT FAILURE EMAIL
            const rejectHtml = `
                <div style="border: 2px solid #e10600; padding: 15px; background: #050505;">
                    <h2 style="color: #e10600; margin-top: 0;">SECURITY AUDIT FAILED</h2>
                    <p>The secondary market audit for <strong>Serial: ${serial}</strong> was unsuccessful.</p>
                    <p>Reason: Failed biometric or signature verification. Please contact the steward for a re-audit.</p>
                </div>
            `;
            sendF1Notification(email, "AUDIT FAILURE: ASSET REJECTED", rejectHtml);
        }
        
        res.json({ success: true });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Gateway Active on Port ${PORT}`));