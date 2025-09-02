// Load data from localStorage and update the bulletin content
function loadBulletinData() {
    const savedData = localStorage.getItem('bulletinData');
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    
    // Update basic information
    if (data.churchName) {
        document.querySelector('.church-name').textContent = data.churchName;
    }
    if (data.churchSubtitle) {
        document.querySelector('.church-subtitle').textContent = data.churchSubtitle;
    }
    if (data.volume || data.date || data.pastor) {
        const dateInfo = document.querySelector('.date-info');
        dateInfo.textContent = `${data.volume || '제2권 32호'} • ${data.date || '2025년 8월 31일'} • 담임목사 ${data.pastor || '정재화'}`;
    }
    
    // Update worship information
    if (data.worshipTime || data.worshipLeader) {
        const worshipHeader = document.querySelector('.worship-order p');
        worshipHeader.textContent = `${data.worshipTime || '오전 11시'} • 인도자 ${data.worshipLeader || '정재화 목사'}`;
    }
    
    if (data.scripture) {
        const scriptureElement = document.querySelector('.worship-item:nth-child(11) span:first-child');
        if (scriptureElement) {
            scriptureElement.textContent = `성경봉독 - ${data.scripture}`;
        }
    }
    
    if (data.sermon) {
        const sermonElement = document.querySelector('.worship-item:nth-child(12) span:first-child .highlight');
        if (sermonElement) {
            sermonElement.textContent = data.sermon;
        }
    }
    
    // Update worship items
    if (data.worshipItems && data.worshipItems.length > 0) {
        const worshipContainer = document.querySelector('.worship-order');
        const existingItems = worshipContainer.querySelectorAll('.worship-item');
        
        // Remove existing worship items
        existingItems.forEach(item => item.remove());
        
        // Add new worship items
        data.worshipItems.forEach(item => {
            const div = document.createElement('div');
            div.className = item.standing ? 'worship-item standing' : 'worship-item';
            
            const itemText = item.item.includes(data.sermon) ? 
                item.item.replace(data.sermon, `<span class="highlight">${data.sermon}</span>`) : 
                item.item;
            
            div.innerHTML = `
                <span>${itemText}</span>
                <span>${item.leader}</span>
            `;
            
            // Insert before the offering notice
            const offeringNotice = worshipContainer.querySelector('p[style*="background: #fff3cd"]');
            worshipContainer.insertBefore(div, offeringNotice);
        });
    }
    
    // Update financial information
    if (data.financialMonth) {
        const financialTitle = document.querySelector('.section:nth-of-type(3) .section-title');
        if (financialTitle) {
            financialTitle.textContent = `${data.financialMonth} 헌금 내역`;
        }
    }
    
    if (data.financialItems && data.financialItems.length > 0) {
        const financialGrid = document.querySelector('.financial-grid');
        const existingItems = financialGrid.querySelectorAll('.financial-item:not([style*="border: 3px solid"])');
        
        // Remove existing financial items (except total)
        existingItems.forEach(item => item.remove());
        
        let total = 0;
        
        // Add new financial items
        data.financialItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'financial-item';
            div.innerHTML = `
                <div>${item.name}</div>
                <div class="financial-amount">${item.amount}</div>
            `;
            
            // Calculate total (remove non-numeric characters and convert to number)
            const amount = parseInt(item.amount.replace(/[^0-9]/g, '')) || 0;
            total += amount;
            
            // Insert before the total item
            const totalItem = financialGrid.querySelector('.financial-item[style*="border: 3px solid"]');
            financialGrid.insertBefore(div, totalItem);
        });
        
        // Update total
        const totalItem = financialGrid.querySelector('.financial-item[style*="border: 3px solid"] .financial-amount');
        if (totalItem) {
            totalItem.textContent = total.toLocaleString() + '원';
        }
    }
    
    if (data.bankAccount) {
        const bankAccountElement = document.querySelector('.section:nth-of-type(3) p strong');
        if (bankAccountElement && bankAccountElement.parentElement) {
            bankAccountElement.parentElement.innerHTML = `<strong>헌금계좌:</strong> ${data.bankAccount}`;
        }
    }
    
    // Update church news
    if (data.newsItems && data.newsItems.length > 0) {
        const newsList = document.querySelector('.section:nth-of-type(4) ul');
        if (newsList) {
            newsList.innerHTML = '';
            
            data.newsItems.forEach(news => {
                const li = document.createElement('li');
                li.style.cssText = 'margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea;';
                li.textContent = news;
                newsList.appendChild(li);
            });
        }
    }
    
    // Update contact information
    if (data.address) {
        const addressElement = document.querySelector('.contact-grid .contact-item:nth-child(1) p');
        if (addressElement) {
            addressElement.textContent = data.address;
        }
    }
    
    if (data.phone) {
        const phoneElement = document.querySelector('.contact-grid .contact-item:nth-child(2) p');
        if (phoneElement) {
            phoneElement.textContent = `☎ ${data.phone}`;
        }
    }
    
    if (data.mobile) {
        const mobileElement = document.querySelector('.contact-grid .contact-item:nth-child(3) p');
        if (mobileElement) {
            mobileElement.textContent = `📱 ${data.mobile}`;
        }
    }
    
    if (data.established) {
        const establishedElement = document.querySelector('.contact-grid .contact-item:nth-child(4) p');
        if (establishedElement) {
            establishedElement.textContent = data.established;
        }
    }
}

// Admin login function
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const messageDiv = document.getElementById('adminMessage');
    
    // Clear previous messages
    messageDiv.innerHTML = '';
    messageDiv.className = '';
    
    // Check credentials
    if (username === 'admin' && password === 'church1234') {
        messageDiv.innerHTML = '로그인 성공! 관리자 페이지로 이동합니다...';
        messageDiv.className = 'admin-success';
        
        // Set authentication session
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminAuthTime', new Date().getTime().toString());
        
        // Redirect to admin page after 1 second
        setTimeout(() => {
            window.open('admin.html', '_blank');
            // Clear the form
            document.getElementById('adminUsername').value = '';
            document.getElementById('adminPassword').value = '';
            messageDiv.innerHTML = '';
        }, 1000);
    } else {
        messageDiv.innerHTML = '잘못된 사용자명 또는 비밀번호입니다.';
        messageDiv.className = 'admin-error';
        
        // Clear error message after 3 seconds
        setTimeout(() => {
            messageDiv.innerHTML = '';
            messageDiv.className = '';
        }, 3000);
    }
}

// Allow Enter key to submit login
function setupLoginEventListeners() {
    const usernameInput = document.getElementById('adminUsername');
    const passwordInput = document.getElementById('adminPassword');
    
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adminLogin();
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                adminLogin();
            }
        });
    }
}

// Populate PDF worship items
function populatePDFWorshipItems() {
    const worshipItems = document.querySelectorAll('.worship-order .worship-item');
    const pdfWorshipContainer = document.getElementById('pdf-worship-items');
    
    if (!pdfWorshipContainer) return;
    
    pdfWorshipContainer.innerHTML = '';
    
    worshipItems.forEach(item => {
        const itemText = item.querySelector('span:first-child').textContent;
        const leader = item.querySelector('span:last-child').textContent;
        const isStanding = item.classList.contains('standing');
        
        const div = document.createElement('div');
        div.className = isStanding ? 'pdf-worship-item standing' : 'pdf-worship-item';
        div.innerHTML = `
            <span>${itemText.replace('※', '').trim()}</span>
            <span>${leader}</span>
        `;
        pdfWorshipContainer.appendChild(div);
    });
}

// Update PDF layout with current bulletin data
function updatePDFLayout() {
    const savedData = localStorage.getItem('bulletinData');
    const pdfLayout = document.getElementById('pdf-layout');
    
    if (!pdfLayout) return;
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Update date info in all PDF pages
        const pdfDateInfos = pdfLayout.querySelectorAll('.pdf-date-info');
        pdfDateInfos.forEach(dateInfo => {
            if (data.date) {
                dateInfo.textContent = `교회설립 2024.10.15. 제2권 32호 ${data.date}`;
            }
        });
        
        // Update worship leader info
        if (data.worshipLeader) {
            const leaderElement = pdfLayout.querySelector('.pdf-leader');
            if (leaderElement) {
                leaderElement.textContent = `인도자 ${data.worshipLeader}`;
            }
        }
        
        // Update worship time
        if (data.worshipTime) {
            const timeElement = pdfLayout.querySelector('.pdf-time');
            if (timeElement) {
                timeElement.textContent = data.worshipTime;
            }
        }
        
        // Update sermon title
        if (data.sermon) {
            const sermonElement = pdfLayout.querySelector('.pdf-worship-item:nth-child(12) .pdf-item-dots');
            if (sermonElement) {
                sermonElement.textContent = `--- ${data.sermon} ---`;
            }
        }
        
        // Update scripture
        if (data.scripture) {
            const scriptureElement = pdfLayout.querySelector('.pdf-worship-item:nth-child(11) .pdf-item-dots');
            if (scriptureElement) {
                scriptureElement.textContent = `--- ${data.scripture} ---`;
            }
        }
        
        // Update financial data
        if (data.financialItems && data.financialItems.length > 0) {
            const financialTable = pdfLayout.querySelector('.pdf-financial-table');
            if (financialTable) {
                // Update financial amounts in the table
                let total = 0;
                data.financialItems.forEach((item, index) => {
                    const amount = parseInt(item.amount.replace(/[^0-9]/g, '')) || 0;
                    total += amount;
                    
                    // Update corresponding table cell (skip header row)
                    const amountCell = financialTable.querySelector(`tr:nth-child(${index + 2}) td:nth-child(5)`);
                    if (amountCell) {
                        amountCell.textContent = amount.toLocaleString();
                    }
                });
                
                // Update total
                const totalCell = financialTable.querySelector('tr:nth-child(7) td:nth-child(5)');
                if (totalCell) {
                    totalCell.textContent = total.toLocaleString();
                }
            }
        }
        
        // Update church news
        if (data.newsItems && data.newsItems.length > 0) {
            const noticeContent = pdfLayout.querySelector('.pdf-notice-content');
            if (noticeContent) {
                noticeContent.innerHTML = '';
                data.newsItems.forEach(news => {
                    const div = document.createElement('div');
                    div.className = 'pdf-notice-item';
                    div.textContent = `⚜ ${news}`;
                    noticeContent.appendChild(div);
                });
            }
        }
        
        // Update contact information
        if (data.address) {
            const addressElement = pdfLayout.querySelector('.pdf-address');
            if (addressElement) {
                addressElement.textContent = `📍 ${data.address}`;
            }
        }
        
        if (data.phone || data.mobile) {
            const phoneElement = pdfLayout.querySelector('.pdf-phone');
            if (phoneElement) {
                phoneElement.textContent = `☎ ${data.phone || '032) 836-7401'} | HP ${data.mobile || '010-4804-3124'}`;
            }
        }
    }
}

// Enhanced PDF download function with comprehensive debugging
async function downloadPDF() {
    console.log(`\n🚀 STARTING PDF GENERATION`);
    console.log(`============================`);
    
    const regularContent = document.getElementById('bulletin-content');
    const pdfLayout = document.getElementById('pdf-layout');
    const buttons = document.querySelector('.download-buttons');
    const adminLogin = document.querySelector('.admin-login');
    
    // Pre-flight checks
    console.log(`🔍 Pre-flight element checks:`);
    console.log(`   - Regular content: ${regularContent ? '✅ Found' : '❌ Missing'}`);
    console.log(`   - PDF layout: ${pdfLayout ? '✅ Found' : '❌ Missing'}`);
    console.log(`   - Buttons: ${buttons ? '✅ Found' : '❌ Missing'}`);
    console.log(`   - Admin login: ${adminLogin ? '✅ Found' : '❌ Missing'}`);
    
    if (!regularContent || !pdfLayout || !buttons) {
        console.error('❌ Required elements not found for PDF generation');
        alert('PDF 생성에 필요한 요소를 찾을 수 없습니다.');
        return;
    }
    
    const startTime = performance.now();
    
    try {
        // Step 1: Prepare layout
        console.log(`\n📋 Step 1: Preparing layout...`);
        buttons.style.display = 'none';
        if (adminLogin) adminLogin.style.display = 'none';
        
        regularContent.style.display = 'none';
        pdfLayout.style.display = 'block';
        pdfLayout.style.visibility = 'visible';
        pdfLayout.classList.add('active');
        
        // Force layout recalculation and log dimensions
        pdfLayout.offsetHeight;
        console.log(`   - PDF layout dimensions: ${pdfLayout.scrollWidth}x${pdfLayout.scrollHeight}`);
        console.log(`   - PDF layout visible: ${pdfLayout.style.display === 'block' ? '✅' : '❌'}`);
        
        // Step 2: Update PDF layout with current data
        console.log(`\n📝 Step 2: Updating PDF layout with current data...`);
        updatePDFLayout();
        console.log(`   - Layout update completed`);
        
        // Step 3: Skip images to avoid canvas tainting - generate text-only PDF
        console.log(`\n🖼️ Step 3: Skipping images to avoid canvas tainting...`);
        console.log(`   - Images will be excluded from PDF to prevent SecurityError`);
        console.log(`   - Use separate image download for pictures`);
        
        // Step 4: Final preparation
        console.log(`\n⏳ Step 4: Final preparation (2 second wait)...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 5: Validate content before PDF generation
        console.log(`\n🔍 Step 5: Pre-generation validation...`);
        const imagePages = pdfLayout.querySelectorAll('.pdf-image-page');
        const textContent = pdfLayout.textContent.trim();
        console.log(`   - Image pages found: ${imagePages.length}`);
        console.log(`   - Text content length: ${textContent.length} characters`);
        console.log(`   - Has meaningful content: ${textContent.length > 100 ? '✅' : '❌'}`);
        
        // Log all images in the layout for debugging
        const allImages = pdfLayout.querySelectorAll('img');
        console.log(`   - Total images in layout: ${allImages.length}`);
        allImages.forEach((img, index) => {
            console.log(`     ${index + 1}. ${img.src.substring(0, 50)}... (${img.naturalWidth}x${img.naturalHeight})`);
        });
        
        // Step 6: Configure PDF generation options (text-only, no images)
        console.log(`\n⚙️ Step 6: Configuring PDF generation options (text-only)...`);
        const opt = {
            margin: [10, 10, 10, 10],
            filename: '백령감리교회_주보.pdf',
            image: { 
                type: 'jpeg', 
                quality: 0.8 
            },
            html2canvas: { 
                scale: 1.2,
                useCORS: false,  // Disable CORS completely
                allowTaint: false,  // Prevent canvas tainting
                letterRendering: true,
                backgroundColor: '#f5f5dc',
                logging: true,
                width: pdfLayout.scrollWidth,
                height: pdfLayout.scrollHeight,
                scrollX: 0,
                scrollY: 0,
                foreignObjectRendering: false,
                proxy: undefined,
                removeContainer: true,
                imageTimeout: 0,  // Skip image processing entirely
                ignoreElements: function(element) {
                    // Ignore all images and problematic elements
                    return element.tagName === 'IMG' ||
                           element.classList.contains('download-buttons') || 
                           element.classList.contains('admin-login') ||
                           element.classList.contains('pdf-image-page');
                }
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'landscape',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css'],
                before: '.pdf-page',
                after: '.pdf-page',
                avoid: '.pdf-worship-item, .pdf-notice-item'
            }
        };
        
        console.log(`   - Canvas scale: ${opt.html2canvas.scale}`);
        console.log(`   - Canvas size: ${opt.html2canvas.width}x${opt.html2canvas.height}`);
        console.log(`   - Image timeout: ${opt.html2canvas.imageTimeout}ms`);
        console.log(`   - PDF format: ${opt.jsPDF.format} ${opt.jsPDF.orientation}`);
        
        // Step 7: Generate PDF with detailed error tracking
        console.log(`\n🎯 Step 7: Generating PDF...`);
        const pdfStartTime = performance.now();
        
        try {
            console.log(`   - Calling html2pdf().set(opt).from(pdfLayout).save()...`);
            await html2pdf().set(opt).from(pdfLayout).save();
            
            const pdfTime = Math.round(performance.now() - pdfStartTime);
            const totalTime = Math.round(performance.now() - startTime);
            
            console.log(`✅ PDF generated successfully!`);
            console.log(`   - PDF generation time: ${pdfTime}ms`);
            console.log(`   - Total process time: ${totalTime}ms`);
            
            alert('PDF가 성공적으로 생성되었습니다!');
            
        } catch (pdfError) {
            const pdfTime = Math.round(performance.now() - pdfStartTime);
            console.error(`❌ Primary PDF generation failed after ${pdfTime}ms:`, pdfError);
            console.error(`🔍 Error analysis:`);
            console.error(`   - Error name: ${pdfError.name}`);
            console.error(`   - Error message: ${pdfError.message}`);
            console.error(`   - Error stack:`, pdfError.stack);
            
            // Check for specific error types
            if (pdfError.message.includes('toDataURL')) {
                console.error(`🎯 Canvas tainting detected - this is the core issue`);
            }
            if (pdfError.message.includes('CORS')) {
                console.error(`🎯 CORS issue detected`);
            }
            if (pdfError.message.includes('SecurityError')) {
                console.error(`🎯 Security error detected - likely local file access`);
            }
            
            console.log(`\n🔄 Attempting fallback PDF generation without images...`);
            
            // Remove image pages for fallback
            const imagePages = pdfLayout.querySelectorAll('.pdf-image-page');
            console.log(`   - Removing ${imagePages.length} image pages for fallback`);
            imagePages.forEach(page => page.remove());
            
            // Simplified options for fallback
            const fallbackOpt = {
                margin: [15, 15, 15, 15],
                filename: '백령감리교회_주보.pdf',
                image: { 
                    type: 'jpeg', 
                    quality: 0.8 
                },
                html2canvas: { 
                    scale: 1.2,
                    useCORS: false,
                    allowTaint: true,
                    letterRendering: true,
                    backgroundColor: '#f5f5dc',
                    logging: true,
                    ignoreElements: function(element) {
                        return element.classList.contains('download-buttons') || 
                               element.classList.contains('admin-login') ||
                               element.classList.contains('pdf-image-page');
                    }
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'landscape'
                }
            };
            
            console.log(`   - Fallback options configured (scale: ${fallbackOpt.html2canvas.scale})`);
            
            try {
                const fallbackStartTime = performance.now();
                await html2pdf().set(fallbackOpt).from(pdfLayout).save();
                
                const fallbackTime = Math.round(performance.now() - fallbackStartTime);
                const totalTime = Math.round(performance.now() - startTime);
                
                console.log(`✅ Fallback PDF generated successfully!`);
                console.log(`   - Fallback generation time: ${fallbackTime}ms`);
                console.log(`   - Total process time: ${totalTime}ms`);
                
                alert('✅ PDF가 성공적으로 생성되었습니다!\n\n📝 주보 내용이 포함되었습니다.\n🖼️ 이미지는 브라우저 보안 정책으로 인해 제외되었습니다.\n\n💡 이미지가 필요한 경우 "🖼️ 이미지 다운로드" 버튼을 사용해주세요.');
                
            } catch (fallbackError) {
                const fallbackTime = Math.round(performance.now() - fallbackStartTime);
                console.error(`❌ Fallback PDF generation also failed after ${fallbackTime}ms:`, fallbackError);
                console.error(`🔍 Fallback error analysis:`);
                console.error(`   - Error name: ${fallbackError.name}`);
                console.error(`   - Error message: ${fallbackError.message}`);
                console.error(`   - Error stack:`, fallbackError.stack);
                
                alert(`❌ PDF 생성에 실패했습니다.\n\n브라우저 콘솔을 확인해주세요.\n오류: ${fallbackError.message}\n\n💡 다른 브라우저(Chrome 권장)에서 시도해보세요.`);
            }
        }
        
    } catch (error) {
        const totalTime = Math.round(performance.now() - startTime);
        console.error(`❌ Error during PDF generation setup after ${totalTime}ms:`, error);
        console.error(`🔍 Setup error analysis:`);
        console.error(`   - Error name: ${error.name}`);
        console.error(`   - Error message: ${error.message}`);
        console.error(`   - Error stack:`, error.stack);
        
        alert(`PDF 생성 준비 중 오류가 발생했습니다: ${error.message}`);
    } finally {
        // Always restore the original layout
        console.log(`\n🔄 Restoring original layout...`);
        restoreOriginalLayout(regularContent, pdfLayout, buttons, adminLogin);
        
        const totalTime = Math.round(performance.now() - startTime);
        console.log(`📊 PDF Generation Process Complete - Total time: ${totalTime}ms`);
        console.log(`============================\n`);
    }
}

// Helper function to restore original layout
function restoreOriginalLayout(regularContent, pdfLayout, buttons, adminLogin) {
    console.log('Restoring original layout...');
    
    if (pdfLayout) {
        pdfLayout.classList.remove('active');
        pdfLayout.style.display = 'none';
        pdfLayout.style.visibility = 'hidden';
    }
    
    if (regularContent) {
        regularContent.style.display = 'block';
    }
    
    if (buttons) {
        buttons.style.display = 'flex';
    }
    
    if (adminLogin) {
        adminLogin.style.display = 'block';
    }
}

// Enhanced function with comprehensive debugging and validation
function imageToBase64(src) {
    return new Promise((resolve) => {
        console.log(`🔍 Processing image: ${src}`);
        console.log(`📍 Current protocol: ${window.location.protocol}`);
        
        // Check if we're dealing with a local file protocol
        if (window.location.protocol === 'file:') {
            console.log(`📁 Local file protocol detected for: ${src}`);
            
            // For local files, we'll validate the image exists and return original src
            const testImg = new Image();
            testImg.onload = () => {
                console.log(`✅ Local image validated: ${src}`);
                console.log(`📏 Image dimensions: ${testImg.naturalWidth}x${testImg.naturalHeight}`);
                console.log(`🔗 Returning original source: ${src}`);
                resolve(src);
            };
            
            testImg.onerror = (error) => {
                console.error(`❌ Local image validation failed for ${src}:`, error);
                console.log(`🔄 Returning source anyway for PDF processing: ${src}`);
                resolve(src);
            };
            
            testImg.src = src;
            return;
        }
        
        // For HTTP/HTTPS protocols, we can try the CORS approach
        console.log(`🌐 Remote protocol detected, attempting CORS conversion for: ${src}`);
        const img = new Image();
        img.crossOrigin = "anonymous"; // Enable CORS for remote images
        
        img.onload = () => {
            console.log(`✅ Remote image loaded successfully: ${src}`);
            console.log(`📏 Image dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
            
            try {
                // Create canvas to convert image to base64
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas dimensions to match image
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                
                console.log(`🎨 Canvas created: ${canvas.width}x${canvas.height}`);
                
                // Draw image to canvas
                ctx.drawImage(img, 0, 0);
                console.log(`🖼️ Image drawn to canvas`);
                
                // Convert canvas to base64
                const base64 = canvas.toDataURL('image/png');
                
                // Validate base64 output
                if (base64 && base64.startsWith('data:image/')) {
                    const sizeKB = Math.round((base64.length * 3/4) / 1024);
                    console.log(`✅ Base64 conversion successful for ${src}`);
                    console.log(`📊 Base64 format: ${base64.substring(0, 50)}...`);
                    console.log(`📏 Base64 size: ~${sizeKB}KB`);
                    resolve(base64);
                } else {
                    console.error(`❌ Invalid base64 format for ${src}:`, base64?.substring(0, 100));
                    console.log(`🔄 Using original source as fallback: ${src}`);
                    resolve(src);
                }
            } catch (error) {
                console.error(`❌ Canvas conversion failed for ${src}:`, error);
                console.error(`🔍 Error details:`, error.message, error.stack);
                console.log(`🔄 Using original source as fallback: ${src}`);
                resolve(src);
            }
        };
        
        img.onerror = (error) => {
            console.error(`❌ Failed to load remote image ${src}:`, error);
            console.log(`🔄 Using original source as fallback: ${src}`);
            resolve(src);
        };
        
        // Set image source after setting up event handlers
        console.log(`🔄 Loading image: ${src}`);
        img.src = src;
    });
}

// Enhanced function with progressive testing and comprehensive validation
async function addImagesToPDFLayout(testMode = false) {
    console.log(`🚀 Adding images to PDF layout... (Test mode: ${testMode})`);
    const pdfLayout = document.getElementById('pdf-layout');
    
    if (!pdfLayout) {
        console.error('❌ PDF layout element not found');
        return;
    }
    
    // Remove any existing image pages
    const existingImagePages = pdfLayout.querySelectorAll('.pdf-image-page');
    existingImagePages.forEach(page => page.remove());
    console.log(`🧹 Removed ${existingImagePages.length} existing image pages`);
    
    // Define all images
    const allImages = [
        { src: 'logo.png', alt: '백령감리교회 로고', title: '교회 로고' },
        { src: 'picture_one.png', alt: '교회 활동 사진 1', title: '주여 저 북녘 땅에 복음의 빛을 비추소서!!!' },
        { src: 'picture_two.png', alt: '교회 활동 사진 2', title: '백령감리교회 사명 - Vision Jesus Christ' }
    ];
    
    // Progressive testing: start with one image if in test mode
    const images = testMode ? [allImages[0]] : allImages;
    console.log(`📋 Processing ${images.length} image(s) ${testMode ? '(TEST MODE - single image)' : '(FULL MODE)'}`);
    
    let successCount = 0;
    const processingResults = [];
    
    for (let i = 0; i < images.length; i++) {
        const imageInfo = images[i];
        const startTime = performance.now();
        
        console.log(`\n🔄 Processing image ${i + 1}/${images.length}: ${imageInfo.src}`);
        
        try {
            // Step 1: Convert image with detailed logging
            console.log(`📤 Step 1: Converting image to base64...`);
            const base64Src = await imageToBase64(imageInfo.src);
            
            // Step 2: Validate conversion result
            console.log(`🔍 Step 2: Validating conversion result...`);
            if (!base64Src) {
                throw new Error('Base64 conversion returned null/undefined');
            }
            
            // Log base64 details for inspection
            const isBase64 = base64Src.startsWith('data:image/');
            const isOriginalSrc = base64Src === imageInfo.src;
            console.log(`📊 Conversion result analysis:`);
            console.log(`   - Is Base64 format: ${isBase64}`);
            console.log(`   - Is original source: ${isOriginalSrc}`);
            console.log(`   - Source preview: ${base64Src.substring(0, 100)}${base64Src.length > 100 ? '...' : ''}`);
            
            if (isBase64) {
                const sizeKB = Math.round((base64Src.length * 3/4) / 1024);
                console.log(`   - Estimated size: ~${sizeKB}KB`);
            }
            
            // Step 3: Create image page
            console.log(`🏗️ Step 3: Creating image page...`);
            const imagePage = document.createElement('div');
            imagePage.className = 'pdf-image-page';
            imagePage.setAttribute('data-image-src', imageInfo.src);
            imagePage.style.cssText = `
                page-break-before: always !important;
                width: 100% !important;
                height: 100vh !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                background-color: #f5f5dc !important;
                padding: 40px !important;
                box-sizing: border-box !important;
                margin: 0 !important;
            `;
            
            const imageContainer = document.createElement('div');
            imageContainer.style.cssText = `
                width: 100% !important;
                max-width: 700px !important;
                text-align: center !important;
                background: white !important;
                padding: 30px !important;
                border-radius: 15px !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
                margin: 0 auto !important;
            `;
            
            const titleElement = document.createElement('h2');
            titleElement.textContent = imageInfo.title;
            titleElement.style.cssText = `
                margin-bottom: 30px !important;
                color: #333 !important;
                font-size: 24px !important;
                font-weight: bold !important;
                font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif !important;
            `;
            
            // Step 4: Create and validate image element
            console.log(`🖼️ Step 4: Creating image element...`);
            const imageElement = document.createElement('img');
            imageElement.src = base64Src;
            imageElement.alt = imageInfo.alt;
            imageElement.setAttribute('data-original-src', imageInfo.src);
            imageElement.style.cssText = `
                max-width: 100% !important;
                max-height: 500px !important;
                height: auto !important;
                border-radius: 10px !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                display: block !important;
                margin: 0 auto !important;
            `;
            
            // Step 5: Wait for image to fully load with timeout
            console.log(`⏳ Step 5: Waiting for image to load...`);
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    console.warn(`⚠️ Image load timeout for: ${imageInfo.src}`);
                    resolve(); // Don't reject, just continue
                }, 10000); // 10 second timeout
                
                if (imageElement.complete && imageElement.naturalWidth > 0) {
                    clearTimeout(timeout);
                    console.log(`✅ Image already loaded: ${imageElement.naturalWidth}x${imageElement.naturalHeight}`);
                    resolve();
                } else {
                    imageElement.onload = () => {
                        clearTimeout(timeout);
                        console.log(`✅ Image loaded successfully: ${imageElement.naturalWidth}x${imageElement.naturalHeight}`);
                        resolve();
                    };
                    
                    imageElement.onerror = (error) => {
                        clearTimeout(timeout);
                        console.error(`❌ Image load error:`, error);
                        resolve(); // Don't reject, continue with broken image
                    };
                }
            });
            
            // Step 6: Assemble and add to DOM
            console.log(`🔧 Step 6: Assembling page components...`);
            imageContainer.appendChild(titleElement);
            imageContainer.appendChild(imageElement);
            imagePage.appendChild(imageContainer);
            
            pdfLayout.appendChild(imagePage);
            
            const processingTime = Math.round(performance.now() - startTime);
            successCount++;
            
            const result = {
                src: imageInfo.src,
                success: true,
                processingTime,
                isBase64: isBase64,
                finalDimensions: `${imageElement.naturalWidth || 'unknown'}x${imageElement.naturalHeight || 'unknown'}`
            };
            processingResults.push(result);
            
            console.log(`✅ Successfully processed ${imageInfo.src} in ${processingTime}ms`);
            
            // In test mode, wait a bit between images for observation
            if (testMode && i < images.length - 1) {
                console.log(`⏸️ Test mode: Waiting 1 second before next image...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
        } catch (error) {
            const processingTime = Math.round(performance.now() - startTime);
            console.error(`❌ Error processing image ${imageInfo.src}:`, error);
            console.error(`🔍 Full error details:`, {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            const result = {
                src: imageInfo.src,
                success: false,
                processingTime,
                error: error.message
            };
            processingResults.push(result);
        }
    }
    
    // Final summary
    console.log(`\n📊 IMAGE PROCESSING SUMMARY:`);
    console.log(`   ✅ Successful: ${successCount}/${images.length}`);
    console.log(`   📋 Detailed results:`);
    processingResults.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        console.log(`      ${status} ${result.src}: ${result.processingTime}ms ${result.success ? `(${result.finalDimensions}, Base64: ${result.isBase64})` : `(Error: ${result.error})`}`);
    });
    
    if (testMode && successCount > 0) {
        console.log(`\n🧪 TEST MODE COMPLETE - Single image test successful!`);
        console.log(`💡 You can now try the full PDF generation or test with more images.`);
    }
    
    return { successCount, totalCount: images.length, results: processingResults };
}

// Test function for progressive image testing
async function testSingleImage() {
    console.log(`\n🧪 STARTING SINGLE IMAGE TEST`);
    console.log(`=================================`);
    
    const pdfLayout = document.getElementById('pdf-layout');
    if (!pdfLayout) {
        console.error('❌ PDF layout not found');
        return;
    }
    
    // Show PDF layout for testing
    pdfLayout.style.display = 'block';
    pdfLayout.style.visibility = 'visible';
    pdfLayout.classList.add('active');
    
    try {
        const result = await addImagesToPDFLayout(true); // Test mode = true
        console.log(`\n🎯 TEST RESULT: ${result.successCount}/${result.totalCount} images processed successfully`);
        
        if (result.successCount > 0) {
            console.log(`✅ Single image test PASSED - Ready for full PDF generation`);
        } else {
            console.log(`❌ Single image test FAILED - Check the errors above`);
        }
        
        return result;
    } catch (error) {
        console.error(`❌ Test failed with error:`, error);
        return { successCount: 0, totalCount: 1, error: error.message };
    }
}

// Enhanced Word document generation with landscape, two-column layout, and 2-page limit
async function downloadWord() {
    console.log('🚀 Starting Word document generation with landscape two-column layout...');
    
    const regularContent = document.getElementById('bulletin-content');
    const pdfLayout = document.getElementById('pdf-layout');
    const buttons = document.querySelector('.download-buttons');
    
    if (!regularContent || !pdfLayout || !buttons) {
        console.error('Required elements not found for Word generation');
        return;
    }
    
    try {
        // Hide the download buttons temporarily
        buttons.style.display = 'none';
        
        // Hide regular content and show PDF layout
        regularContent.style.display = 'none';
        pdfLayout.style.display = 'block';
        pdfLayout.style.visibility = 'visible';
        pdfLayout.classList.add('active');
        
        // Update PDF layout with current data
        updatePDFLayout();
        
        // Limit content to fit in 2 pages maximum
        const savedData = localStorage.getItem('bulletinData');
        let data = {};
        if (savedData) {
            data = JSON.parse(savedData);
        }
        
        // Create enhanced Word document content with landscape two-column layout matching reference image
        const wordContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                  xmlns:w='urn:schemas-microsoft-com:office:word' 
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>백령감리교회 주보</title>
                <!--[if gte mso 9]>
                <xml>
                    <w:WordDocument>
                        <w:View>Print</w:View>
                        <w:Zoom>100</w:Zoom>
                        <w:DoNotPromptForConvert/>
                        <w:DoNotShowInsertionsAndDeletions/>
                        <w:DisplayHorizontalDrawingGridEvery>0</w:DisplayHorizontalDrawingGridEvery>
                        <w:DisplayVerticalDrawingGridEvery>2</w:DisplayVerticalDrawingGridEvery>
                        <w:UseMarginsForDrawingGridOrigin/>
                        <w:ValidateAgainstSchemas/>
                        <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
                        <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
                        <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
                        <w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel>
                    </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    /* Page setup for landscape A4 with two columns */
                    @page Section1 {
                        size: A4 landscape;
                        margin: 0.7in 0.5in 0.7in 0.5in;
                        mso-page-orientation: landscape;
                        mso-header-margin: 0.5in;
                        mso-footer-margin: 0.5in;
                        mso-paper-source: 0;
                        mso-columns: 2;
                        mso-column-gap: 0.5in;
                        mso-column-rule: none;
                    }
                    
                    div.Section1 {
                        page: Section1;
                        mso-columns: 2;
                        mso-column-gap: 0.5in;
                        column-count: 2;
                        column-gap: 0.5in;
                        column-fill: balance;
                    }
                    
                    body {
                        font-family: '맑은 고딕', 'Malgun Gothic', 'Arial', sans-serif;
                        font-size: 10pt;
                        line-height: 1.1;
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5dc;
                        color: #000;
                        mso-line-height-rule: exactly;
                        mso-pagination: widow-orphan;
                    }
                    
                    /* Header styling matching reference image */
                    .bulletin-header {
                        text-align: center;
                        background-color: #d3d3d3;
                        padding: 8px;
                        margin-bottom: 15px;
                        border: 1px solid #999;
                        font-weight: bold;
                        font-size: 12pt;
                        color: #000080;
                        column-span: all;
                        -webkit-column-span: all;
                    }
                    
                    /* Worship order section */
                    .worship-section {
                        margin-bottom: 20px;
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    
                    .worship-header {
                        background-color: #d3d3d3;
                        padding: 6px;
                        text-align: center;
                        font-weight: bold;
                        font-size: 11pt;
                        color: #000080;
                        margin-bottom: 8px;
                        border: 1px solid #999;
                    }
                    
                    .worship-time-info {
                        text-align: center;
                        margin-bottom: 10px;
                        font-size: 10pt;
                        font-weight: bold;
                    }
                    
                    .worship-item {
                        display: table;
                        width: 100%;
                        margin-bottom: 3px;
                        font-size: 9pt;
                        border-bottom: 1px dotted #999;
                        padding: 2px 0;
                    }
                    
                    .worship-item-name {
                        display: table-cell;
                        width: 65%;
                        padding-right: 5px;
                        vertical-align: top;
                    }
                    
                    .worship-item-leader {
                        display: table-cell;
                        width: 35%;
                        text-align: right;
                        vertical-align: top;
                    }
                    
                    /* Financial section */
                    .financial-section {
                        margin-bottom: 20px;
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    
                    .financial-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 8pt;
                        margin: 8px 0;
                    }
                    
                    .financial-table td, .financial-table th {
                        border: 1px solid #666;
                        padding: 3px;
                        text-align: center;
                        vertical-align: middle;
                    }
                    
                    .financial-table th {
                        background-color: #e6e6e6;
                        font-weight: bold;
                    }
                    
                    /* Notice section */
                    .notice-section {
                        margin-bottom: 15px;
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    
                    .notice-item {
                        margin: 6px 0;
                        padding: 5px;
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                        font-size: 9pt;
                        line-height: 1.2;
                    }
                    
                    /* Contact info */
                    .contact-info {
                        text-align: center;
                        font-size: 9pt;
                        margin-top: 15px;
                        padding: 8px;
                        background-color: #f0f0f0;
                        border: 1px solid #ccc;
                        column-span: all;
                        -webkit-column-span: all;
                    }
                    
                    /* Prevent page breaks in critical sections */
                    .no-break {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    
                    /* Ensure content fits in 2 pages maximum */
                    .page-limit {
                        max-height: 16in; /* Approximate height for 2 landscape pages */
                        overflow: hidden;
                    }
                    
                    /* Special styling for sermon title */
                    .sermon-highlight {
                        color: #ff0000;
                        font-weight: bold;
                    }
                    
                    /* Blue text styling like in reference */
                    .blue-text {
                        color: #000080;
                        font-weight: bold;
                    }
                    
                    /* Bottom message styling */
                    .bottom-message {
                        text-align: center;
                        font-size: 14pt;
                        color: #0066cc;
                        font-weight: bold;
                        margin-top: 20px;
                        column-span: all;
                        -webkit-column-span: all;
                    }
                </style>
            </head>
            <body>
                <div class="Section1 page-limit">
                    <!-- Main Header -->
                    <div class="bulletin-header">
                        ★ ★ ★ 주일예배순서 ★ ★ ★
                    </div>
                    
                    <!-- Left Column Content -->
                    <div class="worship-section no-break">
                        <div class="worship-time-info">
                            <strong>오전 11시</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>인도자 ${data.worshipLeader || '정재화 목사'}</strong>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">경배와 찬양</div>
                            <div class="worship-item-leader">다함께</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">주용한 기도</div>
                            <div class="worship-item-leader">인도자</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">※찬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;송</div>
                            <div class="worship-item-leader">다함께</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">※성시교독</div>
                            <div class="worship-item-leader">다함께</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">※신앙고백</div>
                            <div class="worship-item-leader">다함께</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">찬&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;송</div>
                            <div class="worship-item-leader">다함께</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">목회기도</div>
                            <div class="worship-item-leader">인도자</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">교회소식</div>
                            <div class="worship-item-leader">인도자</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">봉헌기도</div>
                            <div class="worship-item-leader">인도자</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">※성&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;찬</div>
                            <div class="worship-item-leader sermon-highlight">---주님의 사랑으로 초대---</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">성경봉독</div>
                            <div class="worship-item-leader">다함께</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">설&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;교</div>
                            <div class="worship-item-leader">인도자</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">※결단의 기도</div>
                            <div class="worship-item-leader">다함께</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">※파송의 찬양</div>
                            <div class="worship-item-leader">다함께</div>
                        </div>
                        
                        <div class="worship-item">
                            <div class="worship-item-name">축&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;도</div>
                            <div class="worship-item-leader">인도자</div>
                        </div>
                        
                        <div style="text-align: center; margin: 15px 0; color: #0066cc; font-weight: bold;">
                            ✚ 헌금은 돌아오시면서 헌금함에 합니다!
                        </div>
                    </div>
                    
                    <!-- Right Column Content -->
                    <div class="worship-section no-break">
                        <div class="worship-header blue-text">
                            오후 2시 30분 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ★주일오후예배★
                        </div>
                        <div style="text-align: center; margin: 10px 0;">
                            <strong>찬송</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>다함께</strong><br>
                            <strong>말씀</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>인도자</strong>
                        </div>
                        
                        <div class="worship-header blue-text">
                            오후 7:30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ★수요성경공부★
                        </div>
                        <div style="text-align: center; margin: 10px 0;">
                            <strong>찬송</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>인도자</strong><br>
                            <strong>말씀</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>인도자</strong>
                        </div>
                        
                        <div class="worship-header blue-text">
                            오전 5시 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ★새벽기도회★(월~금)
                        </div>
                        <div style="text-align: center; margin: 10px 0;">
                            <strong>말씀</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>인도자</strong>
                        </div>
                        
                        <div class="worship-header blue-text">
                            오후 8:30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ★금요기도회★ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>인도자</strong>
                        </div>
                        <div style="text-align: center; margin: 10px 0; font-size: 9pt;">
                            인자야, 내가 너를 이스라엘 족속의 파수꾼으로 세웠으니(겔3:17)
                        </div>
                        
                        <div style="text-align: center; margin: 15px 0; font-weight: bold;">
                            ☩ 8월 헌금 내역 ☩
                        </div>
                        
                        <!-- Financial Table -->
                        <div class="financial-section no-break">
                            <table class="financial-table">
                                <tr style="background-color: #e6e6e6;">
                                    <td rowspan="5" style="background-color: #add8e6; font-weight: bold; writing-mode: vertical-lr; text-orientation: mixed;">예배시간</td>
                                    <td><strong>주일예배</strong></td>
                                    <td><strong>오전 11시</strong></td>
                                    <td><strong>주일헌금</strong></td>
                                    <td><strong>105,000</strong></td>
                                </tr>
                                <tr>
                                    <td>주일오후예배</td>
                                    <td>오후 2시 30</td>
                                    <td>십일조</td>
                                    <td>860,000</td>
                                </tr>
                                <tr>
                                    <td>수요성경공부</td>
                                    <td>오후 7:30</td>
                                    <td>감사헌금</td>
                                    <td>785,000</td>
                                </tr>
                                <tr>
                                    <td>금요철야기도회</td>
                                    <td>오후 8:30</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>새벽기도회</td>
                                    <td>오전 5:00</td>
                                    <td><strong>비전교회 후원금</strong></td>
                                    <td><strong>1,181,000</strong></td>
                                </tr>
                                <tr style="background-color: #add8e6;">
                                    <td rowspan="2" style="background-color: #add8e6; font-weight: bold; writing-mode: vertical-lr; text-orientation: mixed;">헌금계좌</td>
                                    <td colspan="2">농협 351-1328-3733-53</td>
                                    <td>특별헌금</td>
                                    <td>1,000,000</td>
                                </tr>
                                <tr style="background-color: #add8e6;">
                                    <td colspan="2">기독교대한감리회 백령교회</td>
                                    <td><strong>합계</strong></td>
                                    <td><strong>3,931,000</strong></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Bottom Message -->
                    <div class="bottom-message">
                        하나님은 당신을 사랑하십니다
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Create blob with proper MIME type for Word
        const blob = new Blob([wordContent], {
            type: 'application/msword'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '백령감리교회_주보_가로형_2단.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Landscape two-column Word document generated successfully');
        alert('📄 Word 문서가 성공적으로 생성되었습니다!\n\n✅ 가로형 레이아웃\n✅ 2단 구성\n✅ 2페이지 최대\n✅ 참조 이미지와 동일한 형식');
        
    } catch (error) {
        console.error('❌ Error generating Word document:', error);
        alert(`Word 문서 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
        // Restore original layout
        pdfLayout.classList.remove('active');
        pdfLayout.style.display = 'none';
        pdfLayout.style.visibility = 'hidden';
        regularContent.style.display = 'block';
        buttons.style.display = 'flex';
    }
}

// Download as Image
function downloadImage() {
    const regularContent = document.getElementById('bulletin-content');
    const pdfLayout = document.getElementById('pdf-layout');
    const buttons = document.querySelector('.download-buttons');
    
    if (!regularContent || !pdfLayout || !buttons) {
        console.error('Required elements not found for Image generation');
        return;
    }
    
    // Hide the download buttons temporarily
    buttons.style.display = 'none';
    
    // Hide regular content and show PDF layout
    regularContent.style.display = 'none';
    pdfLayout.classList.add('active');
    
    // Update PDF layout with current data
    updatePDFLayout();
    
    // Use html2canvas to capture the PDF layout as image
    const opt = {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        backgroundColor: '#f5f5dc',
        width: pdfLayout.offsetWidth,
        height: pdfLayout.offsetHeight
    };
    
    // Import html2canvas from html2pdf bundle
    const html2canvas = window.html2pdf().from(pdfLayout).outputImg();
    
    // Alternative approach using canvas
    import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        .then(() => {
            return html2canvas(pdfLayout, opt);
        })
        .then(canvas => {
            // Create download link
            const link = document.createElement('a');
            link.download = '백령감리교회_주보.png';
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('Image generated successfully');
        })
        .catch(error => {
            console.error('Error generating image:', error);
            
            // Fallback: use html2pdf to generate image
            html2pdf().set({
                margin: 0,
                filename: '백령감리교회_주보.png',
                image: { type: 'png', quality: 1.00 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#f5f5dc'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'landscape' 
                }
            }).from(pdfLayout).outputImg('png').then(imgData => {
                const link = document.createElement('a');
                link.download = '백령감리교회_주보.png';
                link.href = imgData;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        })
        .finally(() => {
            // Restore original layout
            pdfLayout.classList.remove('active');
            regularContent.style.display = 'block';
            buttons.style.display = 'flex';
        });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadBulletinData();
    setupLoginEventListeners();
});
