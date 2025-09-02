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

// Enhanced PDF download function with better error handling
async function downloadPDF() {
    const regularContent = document.getElementById('bulletin-content');
    const pdfLayout = document.getElementById('pdf-layout');
    const buttons = document.querySelector('.download-buttons');
    const adminLogin = document.querySelector('.admin-login');
    
    if (!regularContent || !pdfLayout || !buttons) {
        console.error('Required elements not found for PDF generation');
        alert('PDF 생성에 필요한 요소를 찾을 수 없습니다.');
        return;
    }
    
    console.log('Starting PDF generation...');
    
    try {
        // Hide UI elements that shouldn't appear in PDF
        buttons.style.display = 'none';
        if (adminLogin) adminLogin.style.display = 'none';
        
        // Hide regular content and show PDF layout with enhanced visibility
        regularContent.style.display = 'none';
        pdfLayout.style.display = 'block';
        pdfLayout.style.visibility = 'visible';
        pdfLayout.classList.add('active');
        
        // Force layout recalculation
        pdfLayout.offsetHeight;
        
        // Update PDF layout with current data
        updatePDFLayout();
        
        // Add images to PDF layout with better error handling
        await addImagesToPDFLayout();
        
        // Wait longer for layout to fully render and images to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Generating PDF with html2pdf...');
        
        // Enhanced PDF generation options with better CORS handling
        const opt = {
            margin: [10, 10, 10, 10],
            filename: '백령감리교회_주보_with_images.pdf',
            image: { 
                type: 'jpeg', 
                quality: 0.95 
            },
            html2canvas: { 
                scale: 1.5,
                useCORS: false,  // Disable CORS to avoid tainting issues with local images
                allowTaint: true,  // Allow tainted canvas for local images
                letterRendering: true,
                backgroundColor: '#f5f5dc',
                logging: false,  // Reduce console noise
                width: pdfLayout.scrollWidth,
                height: pdfLayout.scrollHeight,
                scrollX: 0,
                scrollY: 0,
                foreignObjectRendering: false,  // Disable for better compatibility
                ignoreElements: function(element) {
                    // Ignore elements that shouldn't be in PDF
                    return element.classList.contains('download-buttons') || 
                           element.classList.contains('admin-login');
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
        
        // Generate PDF with better error handling and fallback
        try {
            await html2pdf().set(opt).from(pdfLayout).save();
            console.log('PDF generated successfully');
            alert('PDF가 성공적으로 생성되었습니다!');
        } catch (pdfError) {
            console.error('Primary PDF generation failed:', pdfError);
            console.log('Attempting fallback PDF generation without images...');
            
            // Remove image pages for fallback
            const imagePages = pdfLayout.querySelectorAll('.pdf-image-page');
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
            
            try {
                await html2pdf().set(fallbackOpt).from(pdfLayout).save();
                console.log('Fallback PDF generated successfully');
                alert('✅ PDF가 성공적으로 생성되었습니다!\n\n📝 주보 내용이 포함되었습니다.\n🖼️ 이미지는 브라우저 보안 정책으로 인해 제외되었습니다.\n\n💡 이미지가 필요한 경우 "🖼️ 이미지 다운로드" 버튼을 사용해주세요.');
            } catch (fallbackError) {
                console.error('Fallback PDF generation also failed:', fallbackError);
                alert(`❌ PDF 생성에 실패했습니다.\n\n브라우저 콘솔을 확인해주세요.\n오류: ${fallbackError.message}\n\n💡 다른 브라우저(Chrome 권장)에서 시도해보세요.`);
            }
        }
        
    } catch (error) {
        console.error('Error during PDF generation setup:', error);
        alert(`PDF 생성 준비 중 오류가 발생했습니다: ${error.message}`);
    } finally {
        // Always restore the original layout
        restoreOriginalLayout(regularContent, pdfLayout, buttons, adminLogin);
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

// Simplified function that avoids canvas conversion entirely
function imageToBase64(src) {
    return new Promise((resolve) => {
        console.log(`Using original image source: ${src}`);
        
        // Skip all canvas conversion to avoid CORS/tainting issues
        // Just return the original src - html2pdf should handle local images fine
        resolve(src);
    });
}

// Enhanced function to add images to PDF layout with better error handling
async function addImagesToPDFLayout() {
    console.log('Adding images to PDF layout...');
    const pdfLayout = document.getElementById('pdf-layout');
    
    if (!pdfLayout) {
        console.error('PDF layout element not found');
        return;
    }
    
    // Remove any existing image pages
    const existingImagePages = pdfLayout.querySelectorAll('.pdf-image-page');
    existingImagePages.forEach(page => page.remove());
    
    // Create image pages for each image
    const images = [
        { src: 'logo.png', alt: '백령감리교회 로고', title: '교회 로고' },
        { src: 'picture_one.png', alt: '교회 활동 사진 1', title: '주여 저 북녘 땅에 복음의 빛을 비추소서!!!' },
        { src: 'picture_two.png', alt: '교회 활동 사진 2', title: '백령감리교회 사명 - Vision Jesus Christ' }
    ];
    
    let successCount = 0;
    
    for (let i = 0; i < images.length; i++) {
        const imageInfo = images[i];
        
        try {
            // Convert image to base64 to avoid CORS issues
            const base64Src = await imageToBase64(imageInfo.src);
            
            if (base64Src) {
                const imagePage = document.createElement('div');
                imagePage.className = 'pdf-image-page';
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
                
                const imageElement = document.createElement('img');
                imageElement.src = base64Src;
                imageElement.alt = imageInfo.alt;
                imageElement.style.cssText = `
                    max-width: 100% !important;
                    max-height: 500px !important;
                    height: auto !important;
                    border-radius: 10px !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                    display: block !important;
                    margin: 0 auto !important;
                `;
                
                // Wait for image to load before adding to DOM
                await new Promise((resolve) => {
                    if (imageElement.complete) {
                        resolve();
                    } else {
                        imageElement.onload = resolve;
                        imageElement.onerror = resolve;
                    }
                });
                
                imageContainer.appendChild(titleElement);
                imageContainer.appendChild(imageElement);
                imagePage.appendChild(imageContainer);
                
                pdfLayout.appendChild(imagePage);
                successCount++;
                
                console.log(`Successfully added image page for: ${imageInfo.src}`);
            }
        } catch (error) {
            console.error(`Error processing image ${imageInfo.src}:`, error);
        }
    }
    
    console.log(`Successfully added ${successCount} out of ${images.length} images to PDF layout`);
}

// Download as Word document
function downloadWord() {
    const regularContent = document.getElementById('bulletin-content');
    const pdfLayout = document.getElementById('pdf-layout');
    const buttons = document.querySelector('.download-buttons');
    
    if (!regularContent || !pdfLayout || !buttons) {
        console.error('Required elements not found for Word generation');
        return;
    }
    
    // Hide the download buttons temporarily
    buttons.style.display = 'none';
    
    // Hide regular content and show PDF layout
    regularContent.style.display = 'none';
    pdfLayout.classList.add('active');
    
    // Update PDF layout with current data
    updatePDFLayout();
    
    // Create Word document content
    const wordContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>백령감리교회 주보</title>
            <style>
                @page {
                    size: A4 landscape;
                    margin: 1in;
                }
                body {
                    font-family: '맑은 고딕', 'Malgun Gothic', Arial, sans-serif;
                    background-color: #f5f5dc;
                    margin: 0;
                    padding: 20px;
                }
                .pdf-layout { display: block !important; }
                .pdf-two-column { display: flex; gap: 20px; }
                .pdf-left-column, .pdf-right-column { flex: 1; }
                .pdf-header { background: #c8c8c8; padding: 10px; text-align: center; margin-bottom: 15px; }
                .pdf-worship-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px dotted #999; }
                .pdf-financial-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                .pdf-financial-table td { border: 1px solid #666; padding: 5px; text-align: center; }
                .pdf-notice-item { margin: 10px 0; padding: 8px; background: white; border-radius: 4px; }
            </style>
        </head>
        <body>
            ${pdfLayout.innerHTML}
        </body>
        </html>
    `;
    
    // Create blob and download
    const blob = new Blob([wordContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '백령감리교회_주보.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Restore original layout
    pdfLayout.classList.remove('active');
    regularContent.style.display = 'block';
    buttons.style.display = 'flex';
    
    console.log('Word document generated successfully');
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
