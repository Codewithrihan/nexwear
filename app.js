
        const colorImageMap = {
            "Red": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
            "Blue": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
            "Yellow": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
            "Black": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            "Pink": "https://images.unsplash.com/photo-1583391733975-ac9b0a72ff04?auto=format&fit=crop&w=600&q=80",
            "Green": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
        };

        const initialProducts = [
            { 
                id: 1, 
                title: "Cotton Floral Short Kurti", 
                category: "Short Kurti", 
                price: 799, 
                oldPrice: 1299,
                stock: 12,
                fabric: "100% Pure Cotton", 
                desc: "Crafted with soft breathable pure cotton, designed for daily comfort and ethnic elegance.", 
                folderName: "Cotton-Floral-Short-Kurti",
                colors: ["Red", "Yellow", "Pink"], 
                colorImgs: {
                    "Red": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
                    "Yellow": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
                    "Pink": "https://images.unsplash.com/photo-1583391733975-ac9b0a72ff04?auto=format&fit=crop&w=600&q=80"
                },
                imgs: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"], 
                sizes: ["S","M","L","XL"],
                reviews: [{ name: "Pooja Sharma", rating: 5, comment: "Amazing fabric quality! Perfectly fits." }]
            },
            { 
                id: 2, 
                title: "Chanderi Silk Suit Set", 
                category: "Suit Sets", 
                price: 2499, 
                oldPrice: 3499,
                stock: 3,
                fabric: "Chanderi Silk", 
                desc: "Luxury handcrafted suit set embellished with traditional border prints, perfect for festive occasions.", 
                folderName: "Chanderi-Silk-Suit-Set",
                colors: ["Blue", "Green"], 
                colorImgs: {
                    "Blue": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
                    "Green": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
                },
                imgs: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1583391733975-ac9b0a72ff04?auto=format&fit=crop&w=600&q=80"], 
                sizes: ["M","L","XXL"],
                reviews: [{ name: "Ritu Verma", rating: 4, comment: "Looks beautiful and grand for parties." }]
            }
        ];

        let products = JSON.parse(localStorage.getItem('nexwear_prod_v13')) || initialProducts;
        let orders = JSON.parse(localStorage.getItem('nexwear_ord_v13')) || [];
        let loggedCustomer = JSON.parse(localStorage.getItem('nexwear_cust_user')) || null;
        let cart = [];
        let currentDetailSize = '';
        let currentDetailColor = '';
        let currentProductRef = null;
        let selectedPaymentMode = 'COD';
        let discountPercentage = 0;
        let appliedCouponCode = '';
        let isAdminLoggedIn = localStorage.getItem('nexwear_admin_logged') === 'true';
        let currentSelectedRating = 5;

        let currentHeroIndex = 0;
        setInterval(() => {
            const wrapper = document.getElementById('heroSlidesWrapper');
            if(wrapper) {
                currentHeroIndex = (currentHeroIndex + 1) % 4;
                wrapper.style.transform = `translateX(-${currentHeroIndex * 25}%)`;
            }
        }, 3000);

        function showToast(msg) {
            const toast = document.getElementById('toastNotice');
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 3000);
        }

        function closeWelcomeModal() { document.getElementById('welcomeModal').classList.remove('active'); }
        
        function openNewProductModal() {
            document.getElementById('editProductId').value = '';
            document.getElementById('productModalTitle').innerHTML = '<i class="fa-solid fa-circle-plus" style="color:var(--kr-accent);"></i> Add New Product Listing';
            document.getElementById('productSubmitBtn').innerText = 'Publish Product Listing';
            document.getElementById('addProductForm').reset();
            document.getElementById('newProductModal').classList.add('active');
        }

        function closeNewProductModal() { document.getElementById('newProductModal').classList.remove('active'); }

        function openEditProductModal(id) {
            const p = products.find(prod => prod.id === id);
            if(!p) return;
            
            document.getElementById('editProductId').value = p.id;
            document.getElementById('pTitle').value = p.title;
            document.getElementById('pCategory').value = p.category;
            document.getElementById('pStock').value = p.stock !== undefined ? p.stock : 10;
            document.getElementById('pOldPrice').value = p.oldPrice || '';
            document.getElementById('pPrice').value = p.price;
            document.getElementById('pFabric').value = p.fabric || '';
            document.getElementById('pDesc').value = p.desc || '';

            // Check sizes
            document.querySelectorAll('.size-cb').forEach(cb => {
                cb.checked = p.sizes && p.sizes.includes(cb.value);
            });

            // Check colors
            document.querySelectorAll('.color-cb').forEach(cb => {
                cb.checked = p.colors && p.colors.includes(cb.value);
            });

            document.getElementById('productModalTitle').innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--kr-accent);"></i> Edit Product Listing & Stock';
            document.getElementById('productSubmitBtn').innerText = 'Update Product Details';
            document.getElementById('newProductModal').classList.add('active');
        }

        function updateCustomerHeaderUI() {
            const btnLabel = document.getElementById('custBtnLabel');
            const myOrdersBtn = document.getElementById('myOrdersNavBtn');
            if(loggedCustomer) {
                btnLabel.innerText = loggedCustomer.name;
                if(myOrdersBtn) myOrdersBtn.style.display = 'flex';
            } else {
                btnLabel.innerText = 'Login / Register';
                if(myOrdersBtn) myOrdersBtn.style.display = 'none';
            }
        }

        function openCustomerAuthModal() {
            if(loggedCustomer) {
                if(confirm(`Logged in as ${loggedCustomer.name}. Do you want to Logout?`)) {
                    loggedCustomer = null;
                    localStorage.removeItem('nexwear_cust_user');
                    updateCustomerHeaderUI();
                    showStore();
                    showToast('Logged out successfully');
                }
                return;
            }
            document.getElementById('otpPhoneForm').style.display = 'block';
            document.getElementById('otpVerifyForm').style.display = 'none';
            document.getElementById('userAuthModal').classList.add('active');
        }

        function closeAuthModal() { document.getElementById('userAuthModal').classList.remove('active'); }

        let pendingCustName = '';
        let pendingCustPhone = '';

        function sendOTPProcess(e) {
            e.preventDefault();
            pendingCustName = document.getElementById('custRegName').value;
            pendingCustPhone = document.getElementById('custRegPhone').value;
            document.getElementById('otpPhoneForm').style.display = 'none';
            document.getElementById('otpVerifyForm').style.display = 'block';
            showToast('OTP sent to ' + pendingCustPhone);
        }

        function verifyOTPProcess(e) {
            e.preventDefault();
            const otp = document.getElementById('custOtpInput').value;
            if(otp === '123456' || otp.length === 6) {
                loggedCustomer = { name: pendingCustName, phone: pendingCustPhone };
                localStorage.setItem('nexwear_cust_user', JSON.stringify(loggedCustomer));
                updateCustomerHeaderUI();
                closeAuthModal();
                showToast('Verification Successful! Logged in.');
            } else {
                alert('Invalid OTP Code! Use 123456');
            }
        }

        function calculateAvgRating(reviews) {
            if(!reviews || !reviews.length) return 5.0;
            const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
            return (sum / reviews.length).toFixed(1);
        }

        function getStockBadgeHtml(stock) {
            let stockNum = parseInt(stock);
            if (isNaN(stockNum) || stockNum <= 0) {
                return `<span class="stock-status-pill stock-out">Out of Stock</span>`;
            } else if (stockNum <= 5) {
                return `<span class="stock-status-pill stock-low">Low Stock (${stockNum} left)</span>`;
            } else {
                return `<span class="stock-status-pill stock-in">In Stock (${stockNum})</span>`;
            }
        }

        function renderProducts(filter = 'All') {
            const grid = document.getElementById('productsGrid');
            const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

            grid.innerHTML = filtered.map(p => {
                const avgRating = calculateAvgRating(p.reviews);
                const stockVal = p.stock !== undefined ? parseInt(p.stock) : 10;
                
                let discountPercent = 0;
                if(p.oldPrice && p.oldPrice > p.price) {
                    discountPercent = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
                }

                return `
                <div class="product-card" onclick="openProductDetail(${p.id})">
                    ${discountPercent > 0 ? `<div class="discount-badge-pill">${discountPercent}% OFF</div>` : ''}
                    <button class="card-share-btn" onclick="quickShareCard(event, ${p.id})" title="Quick Share">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                    <div class="product-image-wrap">
                        <img src="${p.imgs[0]}">
                    </div>
                    <h4 style="font-size:0.85rem;">${p.title}</h4>
                    <div class="rating-badge"><i class="fa-solid fa-star"></i> ${avgRating} (${p.reviews ? p.reviews.length : 0})</div>
                    <div>${getStockBadgeHtml(stockVal)}</div>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
                        <span style="font-weight:800; font-size:0.95rem; color:var(--kr-accent);">₹${p.price}</span>
                        ${p.oldPrice && p.oldPrice > p.price ? `<span style="font-size:0.78rem; color:#9ca3af; text-decoration:line-through;">₹${p.oldPrice}</span>` : ''}
                    </div>
                    <button class="btn-krutico" style="margin-top:8px;" ${stockVal <= 0 ? 'disabled' : ''}>${stockVal <= 0 ? 'Out of Stock' : 'View Details'}</button>
                </div>
            `}).join('');
        }

        function openProductDetail(id) {
            const item = products.find(p => p.id === id);
            if(!item) return;
            currentProductRef = item;

            document.getElementById('storeSection').style.display = 'none';
            document.getElementById('adminLoginSection').style.display = 'none';
            document.getElementById('adminDashboardSection').style.display = 'none';
            document.getElementById('trackOrderSection').style.display = 'none';
            document.getElementById('customerOrdersSection').style.display = 'none';
            document.getElementById('productDetailSection').style.display = 'block';

            window.scrollTo({ top: 0, behavior: 'smooth' });

            document.getElementById('detailTitle').innerText = item.title;
            document.getElementById('detailPrice').innerText = `₹${item.price}`;
            
            const oldPriceElem = document.getElementById('detailOldPrice');
            const discBadgeElem = document.getElementById('detailDiscountBadge');
            if(item.oldPrice && item.oldPrice > item.price) {
                oldPriceElem.innerText = `₹${item.oldPrice}`;
                oldPriceElem.style.display = 'inline';
                const disc = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
                discBadgeElem.innerText = `${disc}% OFF`;
                discBadgeElem.style.display = 'inline';
            } else {
                oldPriceElem.style.display = 'none';
                discBadgeElem.style.display = 'none';
            }

            document.getElementById('detailFabric').innerText = item.fabric || '100% Premium Fabric';
            document.getElementById('detailDesc').innerText = item.desc || 'Crafted with premium high-quality fabric designed for all-day comfort.';

            const stockVal = item.stock !== undefined ? parseInt(item.stock) : 10;
            document.getElementById('detailStockBadge').innerHTML = getStockBadgeHtml(stockVal);

            const addBtn = document.getElementById('detailAddBtn');
            if(stockVal <= 0) {
                addBtn.innerText = 'Out of Stock';
                addBtn.disabled = true;
            } else {
                addBtn.innerText = 'Add To Cart';
                addBtn.disabled = false;
                addBtn.onclick = () => {
                    cart.push({ ...item, selectedSize: currentDetailSize, selectedColor: currentDetailColor, qty: 1, totalItemPrice: item.price });
                    updateCart();
                    toggleBag();
                };
            }

            const avgRating = calculateAvgRating(item.reviews);
            document.getElementById('detailRatingBadge').innerHTML = `
                <span class="rating-badge" style="font-size:0.85rem; padding:4px 10px;"><i class="fa-solid fa-star"></i> ${avgRating} / 5.0 (${item.reviews ? item.reviews.length : 0} Reviews)</span>
            `;

            const mainImg = document.getElementById('detailMainImg');
            mainImg.src = item.imgs[0];

            const thumbBox = document.getElementById('detailThumbList');
            thumbBox.innerHTML = item.imgs.map((imgUrl, idx) => `
                <img src="${imgUrl}" class="thumb-img ${idx === 0 ? 'active' : ''}" onclick="switchDetailImg('${imgUrl}', this)">
            `).join('');

            const colorList = item.colors && item.colors.length ? item.colors : ['Default'];
            currentDetailColor = colorList[0];
            const colorBox = document.getElementById('detailColorList');
            colorBox.innerHTML = colorList.map((c, i) => `
                <div class="color-chip ${i === 0 ? 'selected' : ''}" onclick="setDetailColor('${c}', this)">${c}</div>
            `).join('');

            const sizeList = item.sizes && item.sizes.length ? item.sizes : ['Free Size'];
            currentDetailSize = sizeList[0];
            const sizeBox = document.getElementById('detailSizeList');
            sizeBox.innerHTML = sizeList.map((s, i) => `
                <div class="size-chip ${i === 0 ? 'selected' : ''}" onclick="setDetailSize('${s}', this)">${s}</div>
            `).join('');

            renderReviews(item);
            renderRelatedProducts(item.id);
        }

        function setReviewRating(starVal) {
            currentSelectedRating = starVal;
            const stars = document.querySelectorAll('#starInputGroup i');
            stars.forEach((s, idx) => {
                if(idx < starVal) s.classList.add('active');
                else s.classList.remove('active');
            });
        }

        function submitProductReview() {
            if(!currentProductRef) return;
            const comment = document.getElementById('reviewCommentInput').value.trim();
            if(!comment) return alert('Please enter review details!');

            const authorName = loggedCustomer ? loggedCustomer.name : 'Verified Customer';
            if(!currentProductRef.reviews) currentProductRef.reviews = [];
            currentProductRef.reviews.unshift({ name: authorName, rating: currentSelectedRating, comment: comment });

            localStorage.setItem('nexwear_prod_v13', JSON.stringify(products));
            document.getElementById('reviewCommentInput').value = '';
            showToast('Review submitted successfully!');
            openProductDetail(currentProductRef.id);
        }

        function renderReviews(item) {
            const reviewsBox = document.getElementById('reviewsListGroup');
            if(!item.reviews || !item.reviews.length) {
                reviewsBox.innerHTML = `<p style="font-size:0.82rem; color:#888;">No reviews yet.</p>`;
                return;
            }
            reviewsBox.innerHTML = item.reviews.map(r => `
                <div class="review-box-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                        <span style="font-size:0.82rem; font-weight:800;">${r.name}</span>
                        <span style="color:#f59e0b; font-size:0.75rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span>
                    </div>
                    <p style="font-size:0.82rem; color:#555;">${r.comment}</p>
                </div>
            `).join('');
        }

        function shareCurrentProduct(platform) {
            if(!currentProductRef) return;
            const title = currentProductRef.title;
            const price = currentProductRef.price;
            const shareUrl = window.location.origin + window.location.pathname + `?product_id=${currentProductRef.id}`;
            const message = encodeURIComponent(`Check out ${title} for ₹${price} on NEXWEAR!\n`);

            if (platform === 'whatsapp') {
                window.open(`https://api.whatsapp.com/send?text=${message}%20${encodeURIComponent(shareUrl)}`, '_blank');
            } else if (platform === 'facebook') {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            } else if (platform === 'telegram') {
                window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${message}`, '_blank');
            } else if (platform === 'copy') {
                navigator.clipboard.writeText(shareUrl).then(() => showToast('Link copied!'));
            }
        }

        function quickShareCard(event, id) {
            event.stopPropagation();
            const item = products.find(p => p.id === id);
            if(!item) return;
            const shareUrl = window.location.origin + window.location.pathname + `?product_id=${item.id}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out ' + item.title + ' on NEXWEAR: ' + shareUrl)}`, '_blank');
        }

        function switchDetailImg(src, imgElem) {
            document.getElementById('detailMainImg').src = src;
            document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
            if(imgElem) imgElem.classList.add('active');
        }

        function setDetailColor(color, colorElem) {
            currentDetailColor = color;
            document.querySelectorAll('#detailColorList .color-chip').forEach(c => c.classList.remove('selected'));
            colorElem.classList.add('selected');
            if(currentProductRef && currentProductRef.colorImgs && currentProductRef.colorImgs[color]) {
                switchDetailImg(currentProductRef.colorImgs[color], null);
            }
        }

        function setDetailSize(size, sizeElem) {
            currentDetailSize = size;
            document.querySelectorAll('#detailSizeList .size-chip').forEach(c => c.classList.remove('selected'));
            sizeElem.classList.add('selected');
        }

        function renderRelatedProducts(currentId) {
            const relatedGrid = document.getElementById('relatedProductsGrid');
            const otherProducts = products.filter(p => p.id !== currentId);
            relatedGrid.innerHTML = otherProducts.map(p => `
                <div class="product-card" onclick="openProductDetail(${p.id})">
                    <div class="product-image-wrap"><img src="${p.imgs[0]}"></div>
                    <h4 style="font-size:0.85rem;">${p.title}</h4>
                    <div style="font-weight:800; font-size:0.95rem; margin-top:4px; color:var(--kr-accent);">₹${p.price}</div>
                    <button class="btn-krutico" style="margin-top:8px;">View Details</button>
                </div>
            `).join('');
        }

        function filterCategory(catName, btnElem) {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btnElem.classList.add('active');
            renderProducts(catName);
        }

        function toggleBag() {
            document.getElementById('bagDrawer').classList.toggle('active');
            document.getElementById('drawerOverlay').classList.toggle('active');
        }

        function updateCart() {
            document.getElementById('bagCount').innerText = cart.length;
            let sum = 0;
            document.getElementById('bagItems').innerHTML = cart.map((c, i) => {
                sum += c.totalItemPrice;
                return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
                    <div>
                        <div style="font-size:0.82rem; font-weight:700;">${c.title}</div>
                        <div style="font-size:0.75rem; color:#666;">Size: <b>${c.selectedSize}</b> | Color: <b>${c.selectedColor}</b></div>
                        <div style="font-size:0.82rem; font-weight:700; color:var(--kr-accent);">₹${c.totalItemPrice}</div>
                    </div>
                    <i class="fa-solid fa-trash" style="color:#ef4444; cursor:pointer;" onclick="cart.splice(${i},1); updateCart();"></i>
                </div>`;
            }).join('');
            document.getElementById('cartTotal').innerText = `₹${sum}`;
        }

        function openCheckoutModal() {
            if(!cart.length) return alert('Your cart is empty!');
            if(!loggedCustomer) {
                toggleBag();
                alert('Please Login / Register via OTP before placing an order!');
                openCustomerAuthModal();
                return;
            }
            toggleBag();
            document.getElementById('cName').value = loggedCustomer.name;
            document.getElementById('cPhone').value = loggedCustomer.phone;
            discountPercentage = 0;
            appliedCouponCode = '';
            document.getElementById('cDiscountCode').value = '';
            document.getElementById('discountMsg').innerHTML = '';
            recalculateCheckoutTotals();
            document.getElementById('checkoutFormModal').classList.add('active');
        }

        function closeCheckoutModal() { document.getElementById('checkoutFormModal').classList.remove('active'); }

        function selectPayment(mode, elem) {
            selectedPaymentMode = mode;
            document.querySelectorAll('.pay-card-new').forEach(card => card.classList.remove('selected'));
            elem.classList.add('selected');
            document.getElementById('qrCodeContainer').style.display = (mode === 'UPI') ? 'block' : 'none';
        }

        function applyDiscount() {
            const code = document.getElementById('cDiscountCode').value.trim().toUpperCase();
            const msgBox = document.getElementById('discountMsg');
            if(code === 'NEXWELCOME20' || code === 'NEX20') {
                discountPercentage = 20;
                appliedCouponCode = code;
                msgBox.style.color = '#16a34a';
                msgBox.innerText = '🎉 Coupon Applied! 20% Discount added.';
            } else {
                discountPercentage = 0;
                appliedCouponCode = '';
                msgBox.style.color = '#dc2626';
                msgBox.innerText = '❌ Invalid Coupon Code!';
            }
            recalculateCheckoutTotals();
        }

        function recalculateCheckoutTotals() {
            const subtotal = cart.reduce((s, i) => s + i.totalItemPrice, 0);
            const discountAmount = Math.round((subtotal * discountPercentage) / 100);
            const finalTotal = subtotal - discountAmount;
            document.getElementById('checkoutSubtotal').innerText = `₹${subtotal}`;
            document.getElementById('checkoutDiscountAmount').innerText = `-₹${discountAmount} (${discountPercentage}%)`;
            document.getElementById('checkoutFinalTotal').innerText = `₹${finalTotal}`;
        }

        function confirmOrderProcess(e) {
            e.preventDefault();
            const name = document.getElementById('cName').value;
            const phone = document.getElementById('cPhone').value;
            const fullAddress = `${document.getElementById('cHouse').value}, ${document.getElementById('cStreet').value}, ${document.getElementById('cCity').value}, ${document.getElementById('cState').value} - ${document.getElementById('cPincode').value}`;
            
            const subtotal = cart.reduce((s, i) => s + i.totalItemPrice, 0);
            const discountAmount = Math.round((subtotal * discountPercentage) / 100);
            const finalTotal = subtotal - discountAmount;
            const orderId = 'NEX' + Math.floor(100000 + Math.random() * 900000);
            
            cart.forEach(cartItem => {
                let prod = products.find(p => p.id === cartItem.id);
                if(prod) {
                    prod.stock = Math.max(0, (parseInt(prod.stock) || 10) - (cartItem.qty || 1));
                }
            });

            orders.push({ id: orderId, name, phone, address: fullAddress, paymentMode: selectedPaymentMode, total: finalTotal, status: 'Processing', items: [...cart] });
            localStorage.setItem('nexwear_ord_v13', JSON.stringify(orders));
            localStorage.setItem('nexwear_prod_v13', JSON.stringify(products));

            closeCheckoutModal();
            document.getElementById('popupOrderDetails').innerHTML = `
                <div><b>Order ID:</b> ${orderId}</div>
                <div><b>Customer:</b> ${name} (${phone})</div>
                <div><b>Payment:</b> <span style="color:#16a34a;">${selectedPaymentMode} (Confirmed)</span></div>
                <div><b>Total Paid:</b> <span style="color:#16a34a; font-weight:800;">₹${finalTotal}</span></div>
            `;
            document.getElementById('orderConfirmModal').classList.add('active');
            cart = [];
            updateCart();
            renderProducts();
        }

        function closeOrderModal() { document.getElementById('orderConfirmModal').classList.remove('active'); }

        function showTrackOrder() {
            document.getElementById('storeSection').style.display = 'none';
            document.getElementById('productDetailSection').style.display = 'none';
            document.getElementById('adminLoginSection').style.display = 'none';
            document.getElementById('adminDashboardSection').style.display = 'none';
            document.getElementById('customerOrdersSection').style.display = 'none';
            document.getElementById('trackOrderSection').style.display = 'block';
        }

        function showCustomerOrders() {
            if(!loggedCustomer) return openCustomerAuthModal();
            document.getElementById('storeSection').style.display = 'none';
            document.getElementById('productDetailSection').style.display = 'none';
            document.getElementById('adminLoginSection').style.display = 'none';
            document.getElementById('adminDashboardSection').style.display = 'none';
            document.getElementById('trackOrderSection').style.display = 'none';
            document.getElementById('customerOrdersSection').style.display = 'block';

            const userOrders = orders.filter(o => o.phone === loggedCustomer.phone);
            document.getElementById('customerOrdersTableBody').innerHTML = userOrders.length === 0 ? `<tr><td colspan="6" style="text-align:center;">No orders found.</td></tr>` : userOrders.map(o => `
                <tr>
                    <td><b>${o.id}</b></td>
                    <td>${o.items.map(i => `<div>• ${i.title}</div>`).join('')}</td>
                    <td>${o.address}</td>
                    <td><b style="color:#16a34a;">${o.paymentMode}</b></td>
                    <td><b>₹${o.total}</b></td>
                    <td>${o.status}</td>
                </tr>
            `).join('');
        }

        function searchOrderStatus() {
            const phone = document.getElementById('trackPhoneInput').value;
            const userOrders = orders.filter(o => o.phone === phone);
            document.getElementById('trackResultBox').innerHTML = userOrders.length === 0 ? `<p style="color:red;">No orders found</p>` : userOrders.map(o => `
                <div style="border:1px solid #ddd; padding:10px; margin-bottom:8px;">
                    <div>ID: <b>${o.id}</b> | Status: <span style="color:green;">${o.status}</span> | Total: ₹${o.total}</div>
                </div>
            `).join('');
        }

        function showStore() {
            document.getElementById('storeSection').style.display = 'block';
            document.getElementById('productDetailSection').style.display = 'none';
            document.getElementById('adminLoginSection').style.display = 'none';
            document.getElementById('adminDashboardSection').style.display = 'none';
            document.getElementById('trackOrderSection').style.display = 'none';
            document.getElementById('customerOrdersSection').style.display = 'none';
        }

        function openAdminPortal() {
            document.getElementById('storeSection').style.display = 'none';
            document.getElementById('productDetailSection').style.display = 'none';
            document.getElementById('trackOrderSection').style.display = 'none';
            document.getElementById('customerOrdersSection').style.display = 'none';
            if (isAdminLoggedIn) {
                document.getElementById('adminLoginSection').style.display = 'none';
                document.getElementById('adminDashboardSection').style.display = 'block';
                renderAdminDashboard();
            } else {
                document.getElementById('adminLoginSection').style.display = 'block';
            }
        }

        function handleLogin(e) {
            e.preventDefault();
            if (document.getElementById('adminUser').value === "admin" && document.getElementById('adminPass').value === "admin123") {
                isAdminLoggedIn = true;
                localStorage.setItem('nexwear_admin_logged', 'true');
                openAdminPortal();
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        }

        function handleLogout() {
            isAdminLoggedIn = false;
            localStorage.setItem('nexwear_admin_logged', 'false');
            showStore();
        }

        function switchAdminTab(tabName, btnElem) {
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            btnElem.classList.add('active');
            document.getElementById('adminTabProducts').style.display = tabName === 'products' ? 'block' : 'none';
            document.getElementById('adminTabOrders').style.display = tabName === 'orders' ? 'block' : 'none';
            document.getElementById('adminTabAnalytics').style.display = tabName === 'analytics' ? 'block' : 'none';
        }

        function updateOrderStatus(orderId, newStatus) {
            const ord = orders.find(o => o.id === orderId);
            if(ord) {
                ord.status = newStatus;
                localStorage.setItem('nexwear_ord_v13', JSON.stringify(orders));
                showToast(`Order updated`);
                renderAdminDashboard();
            }
        }

        async function handleSaveProduct(e) {
            e.preventDefault();
            const editId = document.getElementById('editProductId').value;
            const checkedSizes = [];
            document.querySelectorAll('.size-cb:checked').forEach(cb => checkedSizes.push(cb.value));
            const checkedColors = [];
            document.querySelectorAll('.color-cb:checked').forEach(cb => checkedColors.push(cb.value));

            const title = document.getElementById('pTitle').value.trim();
            const fileInput = document.getElementById('pImgFile');
            const files = Array.from(fileInput.files);
            let uploadedImgs = [];

            if (files.length > 0) {
                const readAsBase64 = (file) => new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
                uploadedImgs = await Promise.all(files.map(readAsBase64));
            }

            if(editId) {
                // Update Existing Product
                let existingProd = products.find(p => p.id == editId);
                if(existingProd) {
                    existingProd.title = title;
                    existingProd.category = document.getElementById('pCategory').value;
                    existingProd.price = parseFloat(document.getElementById('pPrice').value);
                    existingProd.oldPrice = parseFloat(document.getElementById('pOldPrice').value) || 0;
                    existingProd.stock = parseInt(document.getElementById('pStock').value) || 0;
                    existingProd.fabric = document.getElementById('pFabric').value;
                    existingProd.desc = document.getElementById('pDesc').value;
                    existingProd.colors = checkedColors.length ? checkedColors : existingProd.colors;
                    existingProd.sizes = checkedSizes.length ? checkedSizes : existingProd.sizes;
                    if(uploadedImgs.length > 0) {
                        existingProd.imgs = uploadedImgs;
                    }
                }
                showToast('✅ Product Updated Successfully!');
            } else {
                // Add New Product
                if (uploadedImgs.length === 0) {
                    uploadedImgs = ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80"];
                }
                const newP = {
                    id: Date.now(),
                    title: title,
                    category: document.getElementById('pCategory').value,
                    price: parseFloat(document.getElementById('pPrice').value),
                    oldPrice: parseFloat(document.getElementById('pOldPrice').value) || 0,
                    stock: parseInt(document.getElementById('pStock').value) || 10,
                    fabric: document.getElementById('pFabric').value,
                    desc: document.getElementById('pDesc').value,
                    colors: checkedColors.length ? checkedColors : ["Red"],
                    colorImgs: { "Red": uploadedImgs[0] },
                    imgs: uploadedImgs,
                    sizes: checkedSizes.length ? checkedSizes : ["Free Size"],
                    reviews: []
                };
                products.push(newP);
                showToast('✅ Product Added Successfully with Stock & Discount!');
            }

            localStorage.setItem('nexwear_prod_v13', JSON.stringify(products));
            renderProducts();
            renderAdminDashboard();
            document.getElementById('addProductForm').reset();
            closeNewProductModal();
        }

        function deleteProduct(id) {
            if(confirm('Delete this product?')) {
                products = products.filter(p => p.id !== id);
                localStorage.setItem('nexwear_prod_v13', JSON.stringify(products));
                renderProducts();
                renderAdminDashboard();
            }
        }

        function renderAdminDashboard() {
            const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
            document.getElementById('statTotalProducts').innerText = products.length;
            document.getElementById('statTotalOrders').innerText = orders.length;
            document.getElementById('statTotalRevenue').innerText = `₹${totalRevenue}`;
            document.getElementById('analyticsTotalProds').innerText = products.length;
            document.getElementById('analyticsTotalOrders').innerText = orders.length;
            document.getElementById('analyticsTotalRev').innerText = `₹${totalRevenue}`;

            document.getElementById('adminProductTable').innerHTML = products.map(p => `
                <tr>
                    <td><img src="${p.imgs[0]}" style="width:34px; height:34px; object-fit:cover; border-radius:4px;"></td>
                    <td><b>${p.title}</b></td>
                    <td>₹${p.price} ${p.oldPrice ? `<span style="text-decoration:line-through; color:#888;">(₹${p.oldPrice})</span>` : ''}</td>
                    <td><b>${p.stock !== undefined ? p.stock : 10}</b></td>
                    <td>${getStockBadgeHtml(p.stock !== undefined ? p.stock : 10)}</td>
                    <td>
                        <button style="background:#2563eb; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:4px;" onclick="openEditProductModal(${p.id})" title="Edit Product / Update Stock"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;" onclick="deleteProduct(${p.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');

            document.getElementById('adminOrdersTable').innerHTML = orders.length === 0 ? `<tr><td colspan="6" style="text-align:center;">No orders yet.</td></tr>` : orders.map(o => `
                <tr>
                    <td><b>${o.id}</b></td>
                    <td>${o.name}<br><small>${o.phone}</small></td>
                    <td>${o.address}</td>
                    <td><b style="color:#16a34a;">${o.paymentMode}</b></td>
                    <td><b style="color:#16a34a;">₹${o.total}</b></td>
                    <td>
                        <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:5px; font-weight:700;">
                            <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </td>
                </tr>
            `).join('');
        }

        updateCustomerHeaderUI();
        renderProducts();
    