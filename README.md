# Erika Sy - Portfolio Website

[nullPtrErikaS.github.io
](https://nullptrerikas.github.io/)

## Features
- Responsive design
- Typing animation
- Interactive timeline
- **Secure contact form** with validation & spam protection

## Tech Stack
- HTML5/CSS3/JavaScript
- PHP (contact form backend)
- Font Awesome

## Setup
```bash
git clone https://github.com/nullPtrErikaS/nullPtrErikaS.github.io.git
python -m http.server 8000
```

## Files
- `index.html` - Main page
- `styles.css` - Styling  
- `script.js` - Interactions
- `email.php` - **Contact form handler**

## Customization
- Edit content in `index.html`
- Update colors in `styles.css` CSS variables
- Replace images in `images/` folder
- **Configure email in `email.php`** (required for contact form)

## Contact Form Setup
**Important**: Update `email.php` before deployment:
```php
$config = [
    'recipient_email' => 'your-email@domain.com', // Change this!
    'from_email' => 'noreply@yourdomain.com',
    'rate_limit_max' => 5,
];
```

## Deploy
- **GitHub Pages**: Enable in repo settings
- **Netlify**: Connect and deploy
- **Web hosting**: Upload files + **ensure PHP support for contact form**

## Contact & Support
- **Portfolio Owner**: Erika Sy
- **Email**: ebasy22@gmail.com
- **GitHub**: [@nullPtrErikaS](https://github.com/nullPtrErikaS)
- **LinkedIn**: [Erika Sy](https://linkedin.com/in/erika-sy)

**Need help?** Open an issue or contact directly via email.

---

© 2025 Erika Sy. All rights reserved.
