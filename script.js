document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Switcher (Dark by Default) ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light-theme') {
        body.classList.remove('dark-theme');
        themeSwitcher.title = 'Switch to Dark Theme';
    } else {
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
                entry.target.style.transitionDelay = `${(index % 5) * 100}ms`; // Stagger animation
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // --- Footer Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- PDF Export (v13 - Final Fix) ---
    const exportPDF = () => {
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
            }
        };
        
        // only has version, no name and title
        //const addHeaderFooter = () => {
        //    const d = new Date();
        //    const versionString = `v.${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        //
        //    for (let i = 1; i <= pageCount; i++) {
        //        doc.setPage(i);
        //        doc.setFontSize(8);
        //        doc.setTextColor(150); // Gray color for header/footer
        //        doc.text(versionString, pageWidth - margin, margin / 2, { align: 'right' });
        //        doc.text(`${i} / ${pageCount}`, pageWidth / 2, pageHeight - margin / 2, { align: 'center' });
        //    }
        //};
        
        // working but no email
        //const addHeaderFooter = () => {
        //    const d = new Date();
        //    const versionString = `v.${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        //
        //    // Extracting core details for the header
        //    const nameText = document.querySelector('#home h1')?.textContent.trim() || "CV";
        //    const jobTitle = document.querySelector('#home p')?.textContent.trim() || "";
        //    const emailText = document.querySelector('.hero-content .email')?.textContent.trim() || "";
        //
        //    // Concatenate information: Name | Title | Email
        //    // Using filtering to ensure no empty sections or double delimiters occur
        //    const headerInfo = [nameText, jobTitle, emailText]
        //        .filter(part => part.length > 0)
        //        .join(' | ');
        //
        //    for (let i = 1; i <= pageCount; i++) {
        //        doc.setPage(i);
        //        doc.setFontSize(8);
        //        doc.setFont('Helvetica', 'normal');
        //        doc.setTextColor(150);
        //
        //        // --- Header Configuration ---
        //        if (i > 1) {
        //            // Display the detailed contact string from the second page onwards
        //            doc.text(headerInfo, margin, margin / 2, { align: 'left' });
        //        }
        //
        //        // The version string remains at the top right of every page
        //        doc.text(versionString, pageWidth - margin, margin / 2, { align: 'right' });
        //
        //        // --- Footer Configuration ---
        //        doc.text(`${i} / ${pageCount}`, pageWidth / 2, pageHeight - margin / 2, { align: 'center' });
        //    }
        //};
        
        const addHeaderFooter = () => {
            const d = new Date();
            const versionString = `v.${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

            // Data Extraction
            const nameText = document.querySelector('#home h1')?.textContent.trim() || "CV";
            const jobTitle = document.querySelector('#home p')?.textContent.trim() || "";
            
            // Corrected Email extraction for header
            const emailEl = document.querySelector('.hero-content .email');
            const emailText = emailEl ? emailEl.getAttribute('href').replace(/^mailto:/i, '') : "";

            const headerInfo = [nameText, jobTitle, emailText]
                .filter(part => part.length > 0)
                .join(' | ');

            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont('Helvetica', 'normal');
                doc.setTextColor(150);

                if (i > 1) {
                    doc.text(headerInfo, margin, margin / 2, { align: 'left' });
                }

                doc.text(versionString, pageWidth - margin, margin / 2, { align: 'right' });
                doc.text(`${i} / ${pageCount}`, pageWidth / 2, pageHeight - margin / 2, { align: 'center' });
            }
        };

        // --- Content Generation ---
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        // --- 0. Email Data Extraction ---
        const emailElement = document.querySelector('.hero-content .email');
        let emailText = "";
        let emailHref = "";

        if (emailElement) {
            // Gets "mailto:email_address@server.uk"
            emailHref = emailElement.getAttribute('href'); 
            // Use replace() with a regular expression to strip 'mailto:'
            emailText = emailHref.replace(/^mailto:/i, ''); 
        }

        // 1. Title / Hero section
        const heroName = document.querySelector('#home h1');
        const heroTitle = document.querySelector('#home p');
        
        // Render Name
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(22);
        cursorY += 10;
        doc.text(heroName.textContent.trim(), pageWidth / 2, cursorY, { align: 'center' });
        
        // Render Professional Title
        cursorY += 20;
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(heroTitle.textContent.trim(), pageWidth / 2, cursorY, { align: 'center' });
        
        //cursorY += 25;
        //doc.line(margin, cursorY, pageWidth - margin, cursorY);
        //cursorY += 25;
        
        // --- New: Render Email with Hyperlink (Interactive) ---
        if (emailText) {
            cursorY += 15;
            doc.setFontSize(10);
            doc.setTextColor(100); // Elegant grey tone
            
            // Calculate position for the clickable area
            const textWidth = doc.getTextWidth(emailText);
            const textX = (pageWidth - textWidth) / 2;
            
            doc.text(emailText, pageWidth / 2, cursorY, { align: 'center' });
            
            // Add the interactive 'mailto' link
            if (emailHref) {
                doc.link(textX, cursorY - 10, textWidth, 12, { url: emailHref });
            }
        }
        
        cursorY += 20;
        doc.setDrawColor(200);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 25;

        // 2. Loop through sections
        document.querySelectorAll('#main-content section:not(#home)').forEach(section => {
            const h2 = section.querySelector('h2');
            if (!h2) return;

            checkPageBreak(40);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0); // Ensure title is black
            const titleText = h2.textContent.trim().toUpperCase();
            doc.text(titleText, margin, cursorY);
            cursorY += 3;
            doc.line(margin, cursorY, margin + doc.getTextWidth(titleText), cursorY); // Underline
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
            
            // Clean internal whitespace and newlines from HTML source
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

        function addList(ul) {
            const items = ul.querySelectorAll('li');
            for (const li of items) {
                doc.setFont('Times', 'normal');
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);

                // Extract and clean text from list items
                let fullText = li.textContent.replace(/\s+/g, ' ').trim();
                
                const link = li.querySelector('a');
                if (link) {
                    const linkText = link.textContent.trim();
                    // Ensure cleaning doesn't break the link insertion logic
                    fullText = fullText.replace(linkText, ` ${link.href}`);
                }

                const lines = doc.splitTextToSize(fullText, contentWidth - 15);
                checkPageBreak(lines.length * 12 + 5);

                doc.text('•', margin, cursorY);
                doc.text(lines, margin + 15, cursorY);

                cursorY += lines.length * 12 + 5;
            }
        }

        addHeaderFooter();
        
        // --- File Name Construction ---
        // Extract the name, fallback to 'Academic' if the element is missing
        const rawName = document.querySelector('#home h1')?.textContent.trim() || "Academic";

        // Sanitise the string: replace all spaces (including multiple spaces) with underscores
        // Then append the required suffix
        const fileName = `${rawName.replace(/\s+/g, '_')}_cv.pdf`;
        
        doc.save(fileName);
    };

    document.getElementById('export-pdf').addEventListener('click', exportPDF);
});
