# Academic Personal Website Template

A simple, formal, and open-source single-page website template for academics, researchers, and teachers. This template is designed to be highly professional, easy to customize, and deploy.

## Features

- **Responsive & Wide Layout**: A modern, wider layout (`1140px`) that looks great on all devices.
- **Single Page Layout**: All information is accessible via a fixed navigation bar with smooth scrolling.
- **Two High-Contrast Themes**: 
    - A clean, professional **Light** theme.
    - A final, refined **Dark** theme, using a soft, slate/blue palette for a professional and elegant appearance.
    - Your preference is saved in the browser.
- **Icon-Based UI**: Clean and intuitive icons for theme switching and PDF exports, with helpful tooltips.
- **Highly Reliable PDF Export for CVs**:
    - Uses a robust isolation method to generate professional-looking academic CVs reliably across all browsers and themes.
    - **Color PDF**: Full version with images and original theme colors.
    - **Black & White PDF**: High-contrast, grayscale, and no images.
    - **Text-Only PDF**: High-contrast black & white text, without images.
- **Comprehensive & Structured Content**:
    - Includes sections for About, Working Experience, Teaching & Supervision, Engagement, Research, Projects, Education, and Publications.
    - Features a **two-column layout** for sections like "Teaching & Supervision" to present information clearly.
- **Free & Open Source**: Built with standard HTML, CSS, and JavaScript. Uses license-free Google Fonts.
- **Easy to Customize**: No complex frameworks or build steps. Just edit the HTML file.

## How to Use

1.  **Download/Clone the Files**: Get `index.html`, `style.css`, and `script.js`.
2.  **Preview**: Open `index.html` in your browser to see the template in action.
3.  **Edit `index.html`**:
    - Open the file in a text editor.
    - **Personal Information**: Find and replace all placeholder text (e.g., "Your Name", "Your Title").
    - **Profile Picture**: Replace the placeholder image URL (`https://via.placeholder.com/150`) with a link to your own headshot.
    - **Content**: Fill in each `<section>` with your details.
    - **Links**: Update all `href="#"` placeholders with your actual URLs.
4.  **Deploy**: Upload the files to any static web hosting service (like GitHub Pages, Netlify, Vercel, or your university's web space).

## Customization

### Changing Fonts

The template uses 'Lato', 'Noto Sans', and 'Georgia' (for printing). To change them:
1.  Go to [Google Fonts](https://fonts.google.com/) and select new fonts.
2.  Replace the `<link>` in the `<head>` of `index.html` with the one from Google Fonts.
3.  In `style.css`, update the `--font-primary`, `--font-secondary`, and `--font-print` CSS variables.

### Modifying Themes (Colors)

Colors for both themes are managed by CSS variables at the top of `style.css`.

```css
:root {
    /* ... */
    /* Dark Theme (v3 - Softer, more elegant blue/slate) */
    --bg-color-dark: #0f172a;
    --text-color-dark: #cbd5e1;
    /* ...etc. */
}
```

## Dependencies

This template uses two external JavaScript libraries for the PDF export feature, included via a CDN:
- **[jsPDF](https://github.com/parallax/jsPDF)**: For creating the PDF document.
- **[html2canvas](https://html2canvas.hertzen.com/)**: For capturing the page content as an image.

These are already included in `index.html` and require no extra setup.

## License

This project is open source and free to use. You can modify and distribute it as you wish.
