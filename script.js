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

// PDF download function with images
async function downloadPDF() {
    const regularContent = document.getElementById('bulletin-content');
    const pdfLayout = document.getElementById('pdf-layout');
    const buttons = document.querySelector('.download-buttons');
    
    if (!regularContent || !pdfLayout || !buttons) {
        console.error('Required elements not found for PDF generation');
        return;
    }
    
    // Hide the download buttons temporarily
    buttons.style.display = 'none';
    
    // Hide regular content and show PDF layout
    regularContent.style.display = 'none';
    pdfLayout.style.display = 'block';
    pdfLayout.classList.add('active');
    
    // Update PDF layout with current data
    updatePDFLayout();
    
    try {
        // Add images to PDF layout (wait for async operation)
        await addImagesToPDFLayout();
        
        // Wait a moment for layout to render
        setTimeout(() => {
            // Generate PDF from the 2-column PDF layout with images
            const opt = {
                margin: [15, 15, 15, 15],
                filename: '백령감리교회_주보_with_images.pdf',
                image: { 
                    type: 'jpeg', 
                    quality: 0.9 
                },
                html2canvas: { 
                    scale: 1.2,
                    useCORS: false,
                    letterRendering: true,
                    allowTaint: true,
                    backgroundColor: '#f5f5dc',
                    logging: false,
                    ignoreElements: function(element) {
                        // Don't ignore images anymore - we want to include them
                        return false;
                    }
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'landscape'
                },
                pagebreak: { 
                    mode: 'css',
                    before: '.pdf-page, .pdf-image-page'
                }
            };
            
            html2pdf().set(opt).from(pdfLayout).save().then(() => {
                // Restore original layout
                pdfLayout.classList.remove('active');
                pdfLayout.style.display = 'none';
                regularContent.style.display = 'block';
                buttons.style.display = 'flex';
                
                console.log('PDF generated successfully with images included');
            }).catch(error => {
                console.error('Error generating PDF:', error);
                
                // Restore layout even if there's an error
                pdfLayout.classList.remove('active');
                pdfLayout.style.display = 'none';
                regularContent.style.display = 'block';
                buttons.style.display = 'flex';
                
                alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
            });
        }, 1500);
    } catch (error) {
        console.error('Error adding images to PDF layout:', error);
        
        // Restore layout even if there's an error
        pdfLayout.classList.remove('active');
        pdfLayout.style.display = 'none';
        regularContent.style.display = 'block';
        buttons.style.display = 'flex';
        
        alert('이미지 로딩 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
}

// Function to convert image to base64 to avoid CORS issues
function imageToBase64(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;
            ctx.drawImage(this, 0, 0);
            try {
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (e) {
                console.warn('Failed to convert image to base64, using original src:', src);
                resolve(src);
            }
        };
        img.onerror = function() {
            console.warn('Failed to load image:', src);
            resolve(null);
        };
        img.src = src;
    });
}

// Function to add images to PDF layout
async function addImagesToPDFLayout() {
    const pdfLayout = document.getElementById('pdf-layout');
    
    // Remove any existing image pages
    const existingImagePages = pdfLayout.querySelectorAll('.pdf-image-page');
    existingImagePages.forEach(page => page.remove());
    
    // Create image pages for each image
    const images = [
        { src: 'logo.png', alt: '백령감리교회 로고', title: '교회 로고' },
        { src: 'picture one.png', alt: '교회 활동 사진 1', title: '주여 저 북녘 땅에 복음의 빛을 비추소서!!!' },
        { src: 'picture two.png', alt: '교회 활동 사진 2', title: '백령감리교회 사명 - Vision Jesus Christ' }
    ];
    
    for (let i = 0; i < images.length; i++) {
        const imageInfo = images[i];
        
        // Convert image to base64 to avoid CORS issues
        const base64Src = await imageToBase64(imageInfo.src);
        
        if (base64Src) {
            const imagePage = document.createElement('div');
            imagePage.className = 'pdf-image-page';
            imagePage.style.cssText = `
                page-break-before: always;
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: #f5f5dc;
                padding: 40px;
                box-sizing: border-box;
            `;
            
            const imageContainer = document.createElement('div');
            imageContainer.style.cssText = `
                width: 100%;
                max-width: 800px;
                text-align: center;
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            `;
            
            const titleElement = document.createElement('h2');
            titleElement.textContent = imageInfo.title;
            titleElement.style.cssText = `
                margin-bottom: 30px;
                color: #333;
                font-size: 24px;
                font-weight: bold;
            `;
            
            const imageElement = document.createElement('img');
            imageElement.src = base64Src;
            imageElement.alt = imageInfo.alt;
            imageElement.style.cssText = `
                max-width: 100%;
                max-height: 600px;
                height: auto;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            `;
            
            imageContainer.appendChild(titleElement);
            imageContainer.appendChild(imageElement);
            imagePage.appendChild(imageContainer);
            
            pdfLayout.appendChild(imagePage);
        }
    }
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
                image: { type: 'png', quality: 0.98 },
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
