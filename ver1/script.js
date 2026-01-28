document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Switcher (Dark by Default) ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    // If a theme is saved and it's 'light', switch to light. 
    // Otherwise, it stays dark by default (from HTML class or saved preference).
    if (savedTheme === 'light-theme') {
        body.classList.remove('dark-theme');
        themeSwitcher.title = 'Switch to Dark Theme';
    } else {
        // This ensures it's dark if no theme is saved or if dark is explicitly saved
        body.classList.add('dark-theme');
        themeSwitcher.title = 'Switch to Light Theme';
    }

    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark-theme');
            themeSwitcher.title = 'Switch to Light Theme';
        } else {
            localStorage.setItem('theme', 'light-theme');
            themeSwitcher.title = 'Switch to Dark Theme';
        }
    });

    // --- Animate on Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small, staggered delay to the transition for elements visible on load
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // --- Footer Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- PDF Export (v5 - With Margins, Header, Footer) ---
    const { jsPDF } = window.jspdf;

    const exportPDF = (options = {}) => {
        const { isColor = false, noImages = false } = options;

        const mainContent = document.getElementById('main-content');

        // Use the iframe method for reliability
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '1200px';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        const currentThemeClass = document.body.classList.contains('dark-theme') ? 'dark-theme' : '';
        const headContent = document.head.innerHTML;

        let overrideStyles = '';
        if (!isColor) {
            overrideStyles = `
                <style>
                    body { background-color: #fff !important; }
                    * { 
                        color: #000 !important; 
                        background-color: transparent !important; 
                        border-color: #ccc !important;
                        box-shadow: none !important;
                    }
                    h2::before { background-color: #000 !important; }
                    a { text-decoration: none !important; }
                    ${noImages ? 'img, .profile-pic { display: none !important; }' : ''}
                </style>
            `;
        }

        const iframeHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                ${headContent}
                ${overrideStyles}
            </head>
            <body class="${isColor ? currentThemeClass : ''}">
                ${mainContent.innerHTML}
            </body>
            </html>
        `;

        iframeDoc.open();
        iframeDoc.write(iframeHTML);
        iframeDoc.close();

        const handleLoad = () => {
            iframe.removeEventListener('load', handleLoad);

            setTimeout(() => {
                const targetElement = iframe.contentWindow.document.body;

                html2canvas(targetElement, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    width: targetElement.scrollWidth,
                    height: targetElement.scrollHeight,
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    const margin = 40;

                    const imgWidth = pdfWidth - (margin * 2);
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 0;

                    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
                    heightLeft -= (pdfHeight - (margin * 2));

                    while (heightLeft > 0) {
                        position = - (imgHeight - heightLeft) - margin;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                        heightLeft -= (pdfHeight - (margin * 2));
                    }

                    const pageCount = pdf.internal.getNumberOfPages();
                    const d = new Date();
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const versionString = `v.${year}${month}${day}`;

                    for (let i = 1; i <= pageCount; i++) {
                        pdf.setPage(i);

                        pdf.setFontSize(8);
                        pdf.setTextColor(150);
                        pdf.text(versionString, pdfWidth - margin, margin / 2, { align: 'right' });
                        pdf.text(`${i} / ${pageCount}`, pdfWidth / 2, pdfHeight - (margin / 2), { align: 'center' });
                    }

                    pdf.save('academic-profile.pdf');
                }).catch(err => {
                    console.error("Error generating PDF:", err);
                }).finally(() => {
                    document.body.removeChild(iframe);
                });
            }, 500); // Increased delay for fonts/images
        };

        iframe.addEventListener('load', handleLoad);
    };

    document.getElementById('export-pdf-color').addEventListener('click', () => exportPDF({ isColor: true }));
    document.getElementById('export-pdf-bw').addEventListener('click', () => exportPDF({ noImages: true, isBW: true }));
    document.getElementById('export-pdf-text').addEventListener('click', () => exportPDF({ noImages: true }));
});
