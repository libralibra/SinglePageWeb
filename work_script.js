// This script is a modified version of script.js, tailored for working.html.
// It includes a custom PDF generation logic and all interactive behaviours.

document.addEventListener('DOMContentLoaded', () => {

    // --- PDF Generation Function (defined before use) ---
    const exportPDF = () => {
        // Check if the PDF generation library is available at the moment of click
        if (typeof window.jspdf === 'undefined') {
            console.error('jsPDF library is not loaded. PDF export will not work.');
            alert('Error: The PDF generation library (jsPDF) is not available.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });

        const margin = 40;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - (margin * 2);
        let cursorY = margin;
        let pageCount = 1;

        const checkPageBreak = (neededHeight) => {
            if (cursorY + neededHeight > pageHeight - margin) {
                doc.addPage();
                pageCount++;
                cursorY = margin;
                if (pageCount > 1) {
                    addHeaderFooter(true);
                }
            }
        };

        const addHeaderFooter = (isSubsequentPage = false) => {
            const d = new Date();
            const versionString = `v.${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
            const nameText = document.querySelector('#home h1')?.textContent.trim() || "CV";
            const jobTitle = document.querySelector('#home p.title-sub')?.textContent.trim() || "";
            const emailEl = document.querySelector('.hero-content .email');
            const emailText = emailEl ? emailEl.getAttribute('href').replace(/^mailto:/i, '') : "";
            const headerInfo = [nameText, jobTitle, emailText].filter(part => part.length > 0).join(' | ');

            doc.setFontSize(8);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(150);

            if (isSubsequentPage) {
                doc.text(headerInfo, margin, margin / 2, { align: 'left' });
            }

            doc.text(versionString, pageWidth - margin, margin / 2, { align: 'right' });
            doc.text(`${pageCount}`, pageWidth / 2, pageHeight - margin / 2, { align: 'center' });
        };

        const finaliseHeaderFooter = () => {
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont('Helvetica', 'normal');
                doc.setTextColor(150);
                doc.text(`${i} / ${pageCount}`, pageWidth / 2, pageHeight - margin / 2, { align: 'center' });
            }
        }

        // --- Content Generation ---
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const emailElement = document.querySelector('.hero-content .email');
        let emailText = "";
        let emailHref = "";

        if (emailElement) {
            emailHref = emailElement.getAttribute('href');
            emailText = emailHref.replace(/^mailto:/i, '');
        }

        const heroName = document.querySelector('#home h1');
        const heroTitle = document.querySelector('#home p.title-sub');

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        cursorY += 10;
        doc.text(heroName.textContent.trim(), pageWidth / 2, cursorY, { align: 'center' });

        cursorY += 20;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(heroTitle.textContent.trim(), pageWidth / 2, cursorY, { align: 'center' });

        if (emailText) {
            cursorY += 15;
            doc.setFontSize(10);
            doc.setTextColor(100);

            const textWidth = doc.getTextWidth(emailText);
            const textX = (pageWidth - textWidth) / 2;
            doc.text(emailText, pageWidth / 2, cursorY, { align: 'center' });
            if (emailHref) {
                doc.link(textX, cursorY - 10, textWidth, 12, { url: emailHref });
            }
        }

        cursorY += 20;
        doc.setDrawColor(200);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 25;

        document.querySelectorAll('#main-content section:not(#home)').forEach(section => {
            const h2 = section.querySelector('h2');
            if (!h2) return;

            checkPageBreak(40);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            const titleText = h2.textContent.trim().toUpperCase();
            doc.text(titleText, margin, cursorY);
            cursorY += 3;
            // MODIFICATION: Set a darker colour for the underline
            doc.setDrawColor(150);
            doc.line(margin, cursorY, margin + doc.getTextWidth(titleText), cursorY);
            cursorY += 20;

            const contentNodes = section.querySelector('.container').children;
            for (const node of contentNodes) {
                if (node.tagName === 'H2') continue;
                processNode(node);
            }
            cursorY += 15;
        });

        function processNode(node) {
            if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

            switch (node.tagName.toLowerCase()) {
                case 'p':
                    addText(node.textContent);
                    break;
                case 'ul':
                    addList(node);
                    break;
                case 'div':
                    if (node.classList.contains('two-column-layout')) {
                        node.querySelectorAll('.column').forEach(col => {
                            Array.from(col.children).forEach(childNode => processNode(childNode));
                        });
                    }
                    break;
                case 'h3':
                    addH3(node.textContent);
                    break;
            }
        }

        function addText(text) {
            doc.setFont('Times', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            const cleanText = text.replace(/\s+/g, ' ').trim();
            const lines = doc.splitTextToSize(cleanText, contentWidth);
            checkPageBreak(lines.length * 12 + 10);
            doc.text(lines, margin, cursorY);
            cursorY += lines.length * 12 + 10;
        }

        function addH3(text) {
            checkPageBreak(20);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(text.trim(), margin, cursorY);
            cursorY += 20;
        }

        function addCvItem(li) {
            checkPageBreak(40);

            const dateText = li.querySelector('.date')?.textContent.trim() || '';
            const strongText = li.querySelector('strong')?.textContent.trim() || '';
            const pText = li.querySelector('p')?.textContent.trim() || '';

            const liClone = li.cloneNode(true);
            liClone.querySelector('.date')?.remove();
            liClone.querySelector('strong')?.remove();
            liClone.querySelector('p')?.remove();
            const remainingText = liClone.textContent.replace(/\s+/g, ' ').trim();

            const mainLineText = [strongText, remainingText].filter(Boolean).join(' ');

            doc.text('•', margin, cursorY);

            // MODIFICATION: Set font to normal instead of bold
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);

            const availableWidth = dateText ? contentWidth - 15 - doc.getTextWidth(dateText) - 10 : contentWidth - 15;
            const mainLines = doc.splitTextToSize(mainLineText, availableWidth);
            doc.text(mainLines, margin + 15, cursorY);
            let height = mainLines.length * 12;

            if (dateText) {
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(150);
                const dateWidth = doc.getTextWidth(dateText);
                doc.text(dateText, pageWidth - margin - dateWidth, cursorY);
            }

            cursorY += height;

            if (pText) {
                cursorY += 5;
                doc.setFont('Times', 'normal');
                doc.setFontSize(11);
                doc.setTextColor(50);
                const pLines = doc.splitTextToSize(pText, contentWidth - 25);
                doc.text(pLines, margin + 25, cursorY);
                cursorY += pLines.length * 12;
            }

            cursorY += 10;
        }

        function addList(ul) {
            const items = ul.querySelectorAll(':scope > li');
            for (const li of items) {
                if (li.classList.contains('cv-item')) {
                    addCvItem(li);
                } else {
                    doc.setFont('Times', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(0, 0, 0);

                    let fullText = li.textContent.replace(/\s+/g, ' ').trim();

                    const link = li.querySelector('a');
                    if (link) {
                        fullText = fullText.replace(link.textContent.trim(), ` ${link.href}`);
                    }

                    const lines = doc.splitTextToSize(fullText, contentWidth - 15);
                    checkPageBreak(lines.length * 12 + 5);

                    doc.text('•', margin, cursorY);
                    doc.text(lines, margin + 15, cursorY);

                    cursorY += lines.length * 12 + 5;
                }
            }
        }

        addHeaderFooter(false);
        finaliseHeaderFooter();

        const rawName = document.querySelector('#home h1')?.textContent.trim() || "Academic";
        const fileName = `${rawName.replace(/\s+/g, '_')}_cv.pdf`;

        doc.save(fileName);
    };

    // --- Event Listeners ---

    // Theme Switcher
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            const newTooltip = newTheme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark theme';
            themeSwitcher.setAttribute('data-tooltip', newTooltip);
        });
    }

    // PDF Export
    const pdfButton = document.getElementById('export-pdf');
    if (pdfButton) {
        pdfButton.addEventListener('click', exportPDF);
    }

    // --- Dynamic Year Update ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Animations & Scroll Effects ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navbar a');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            if (scrollTop + windowHeight > secTop + 100) {
                sec.style.opacity = '1';
                sec.style.transform = 'translateY(0)';
                sec.style.transition = 'all 0.8s ease-out';
            }
        });

        // Highlight active nav link
        let activeFound = false;
        sections.forEach((sec, i) => {
            if (sec.offsetTop <= scrollTop + 100) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLinks[i]) navLinks[i].classList.add('active');
                activeFound = true;
            }
        });
        if (!activeFound && navLinks.length > 0) {
            navLinks.forEach(link => link.classList.remove('active'));
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check on load
});
