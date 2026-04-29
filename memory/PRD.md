# Prachurja - Premium Assam E-commerce Platform

## Original Problem Statement
Build a premium e-commerce website for "Prachurja" (meaning Abundance), a brand from Assam, India selling authentic regional products. WhatsApp-based ordering, clean/minimal/premium design, earthy color palette. Full cart + checkout system.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI (port 3000)
- **Backend**: FastAPI + MongoDB (port 8001)
- **Database**: MongoDB (products, contact_messages, orders)
- **Cart**: localStorage + React Context (CartProvider)
- **Order Flow**: Cart → Checkout form → Order saved to DB → WhatsApp confirmation

## What's Been Implemented
### Phase 1 (2026-03-30)
- Homepage: Hero, About, Why Choose Us, Categories, CTA, Footer
- Products catalog with category filtering
- Individual product detail pages
- About page, Contact page with validated form
- WhatsApp integration throughout

### Phase 2 (2026-03-31) - Cart System
- CartContext with localStorage persistence
- Slide-in cart sidebar (Shadcn Sheet) like Amazon
- Full Cart page with quantity controls, remove, clear, order summary
- Checkout page with form (name, phone, email, address, city, pincode, notes)
- Orders saved to MongoDB via POST /api/orders
- Order success page with WhatsApp confirmation button
- Add to Cart buttons on product cards and detail pages
- Quantity selector on product detail pages
- Cart icon with badge count in navbar
- Toast notifications (sonner) for cart actions
- Vercel deployment compatibility fixes

## Backlog
### P1 (High)
- [ ] Real WhatsApp number + contact details
- [ ] SEO meta tags and Open Graph
- [ ] Payment gateway (Razorpay/Stripe)

### P2 (Medium)
- [ ] Admin dashboard for managing products/orders
- [ ] Product search
- [ ] Order tracking
- [ ] Newsletter subscription
- [ ] Product reviews/testimonials

### P3 (Low)
- [ ] Blog section
- [ ] Multi-language (English/Assamese)
- [ ] Wishlist
