# PDF Generation Troubleshooting Guide

## Common PDF Generation Pitfalls & Solutions

### 1. CSS Issues with PDF Generators

**Problem**: PDF generators like Puppeteer, jsPDF, or wkhtmltopdf may not interpret all CSS features equally—especially flexbox, grid, or web fonts.

**Current Implementation Analysis**:
- ✅ Uses table-based layout (`.pdf-two-column` with `display: table`)
- ✅ Avoids flexbox/grid in PDF layout
- ⚠️ Some complex CSS gradients and transforms may not render

**Solutions Implemented**:
- Converted flexbox layouts to table-based layouts for PDF
- Used simple, well-supported CSS properties
- Added fallback fonts: `'Malgun Gothic', '맑은 고딕', 'Arial', sans-serif`
- Simplified styling for PDF-specific elements

### 2. Hidden Elements Issue

**Problem**: If `.pdf-layout` is hidden by default (e.g., `display:none`), your generator script must explicitly render this div before capturing the PDF.

**Current Implementation**:
```javascript
// ✅ Properly shows PDF layout before generation
pdfLayout.style.display = 'block';
pdfLayout.style.visibility = 'visible';
pdfLayout.classList.add('active');
```

**CSS Implementation**:
```css
.pdf-layout {
    display: none !important;
    visibility: hidden;
}

.pdf-layout.active {
    display: block !important;
    visibility: visible !important;
    /* ... other styles */
}
```

### 3. Images/Fonts Accessibility

**Problem**: If any referenced images, icons, or fonts aren't accessible at render time, they may not appear in the PDF.

**Current Solutions**:
- ✅ Base64 conversion for images to embed them directly
- ✅ CORS handling for remote images
- ✅ Fallback font stack
- ✅ Protocol detection (file:// vs http://)

**Image Processing Flow**:
```javascript
// Enhanced image processing with comprehensive error handling
async function imageToBase64(src) {
    // Protocol detection and appropriate handling
    // CORS configuration for remote images
    // Canvas conversion with error handling
    // Fallback to original source if conversion fails
}
```

### 4. Script Execution Requirements

**Problem**: If any content relies on DOM manipulation via script.js, check if your PDF generator runs JavaScript before capturing.

**Current Implementation**:
- ✅ Waits for DOM content to load
- ✅ Updates PDF layout with current data before generation
- ✅ Proper timing with `setTimeout` delays
- ✅ Element validation before processing

### 5. Table Rendering Issues

**Problem**: The complex table in the finance section may lose formatting if CSS isn't carefully controlled.

**Current CSS for Tables**:
```css
.pdf-financial-table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 7px !important;
    background: white !important;
    border-radius: 2px !important;
    overflow: hidden !important;
    margin: 0 !important;
}

.pdf-financial-table td {
    border: 1px solid #666 !important;
    padding: 2px !important;
    text-align: center !important;
    vertical-align: middle !important;
    font-size: 7px !important;
    line-height: 1.2 !important;
}
```

## Debugging Steps

### Step 1: Element Validation
```javascript
console.log('Pre-flight element checks:');
console.log(`- Regular content: ${regularContent ? '✅ Found' : '❌ Missing'}`);
console.log(`- PDF layout: ${pdfLayout ? '✅ Found' : '❌ Missing'}`);
```

### Step 2: Layout Preparation
```javascript
// Show PDF layout and hide regular content
regularContent.style.display = 'none';
pdfLayout.style.display = 'block';
pdfLayout.style.visibility = 'visible';
pdfLayout.classList.add('active');
```

### Step 3: Image Processing
```javascript
// Skip images to avoid canvas tainting
ignoreElements: function(element) {
    return element.tagName === 'IMG' ||
           element.classList.contains('download-buttons') || 
           element.classList.contains('admin-login') ||
           element.classList.contains('pdf-image-page');
}
```

### Step 4: PDF Generation Options
```javascript
const opt = {
    margin: [10, 10, 10, 10],
    filename: '백령감리교회_주보.pdf',
    html2canvas: { 
        scale: 1.2,
        useCORS: false,  // Disable CORS to prevent tainting
        allowTaint: false,  // Prevent canvas tainting
        letterRendering: true,
        backgroundColor: '#f5f5dc',
        imageTimeout: 0,  // Skip image processing
        ignoreElements: function(element) {
            // Ignore problematic elements
        }
    },
    jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'landscape'
    }
};
```

## Error Classification

### Canvas Tainting Errors
- **Error**: "Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported"
- **Cause**: Images from different origins without proper CORS
- **Solution**: Skip images in PDF generation, use separate image download

### CORS Errors
- **Error**: Cross-origin resource sharing violations
- **Cause**: Loading images from different domains
- **Solution**: Use `crossOrigin = "anonymous"` and proper server headers

### Security Errors
- **Error**: SecurityError when accessing local files
- **Cause**: Browser security restrictions on file:// protocol
- **Solution**: Use HTTP server for development, handle file:// protocol separately

## Best Practices

1. **Use Table-Based Layouts**: More reliable than flexbox/grid for PDF generation
2. **Embed Resources**: Convert images to base64, use web fonts with fallbacks
3. **Simplify CSS**: Avoid complex animations, transforms, and gradients
4. **Test Progressively**: Start with text-only, then add images separately
5. **Handle Errors Gracefully**: Provide fallback options and clear error messages
6. **Validate Elements**: Check for element existence before processing
7. **Use Appropriate Timeouts**: Allow time for content to load and render

## Current Status

✅ **Working**: Text-based PDF generation with proper layout
✅ **Working**: Word document generation with images
✅ **Working**: Comprehensive error handling and debugging
⚠️ **Limited**: Image inclusion in PDF (due to browser security)
💡 **Recommended**: Use separate image download for pictures
