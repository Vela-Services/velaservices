# 🏠 VelaServices

> **Because life runs better with a little help.**

VelaServices is a modern, full-stack platform that connects customers with reliable home service providers. Built with Next.js 15, TypeScript, and Firebase, it offers a seamless experience for booking cleaning, babysitting, pet sitting, and cooking services.

## ✨ Features

### 🎯 Core Functionality
- **Dual User Roles**: Customer and Provider interfaces with role-based access control
- **Service Marketplace**: Browse and book from 4 main service categories
- **Smart Matching**: AI-powered provider-customer matching algorithm
- **Real-time Scheduling**: Interactive calendar with availability management
- **Shopping Cart**: Add multiple services before checkout
- **Secure Payments**: Integrated payment processing system

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Beautiful gradient designs and smooth animations
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Performance**: Optimized with Next.js 15 and Turbopack

### 🔐 Security & Authentication
- **Firebase Authentication**: Secure user management
- **Role-based Middleware**: Protected routes with role verification
- **Session Persistence**: Cross-tab authentication state
- **Environment Variables**: Secure configuration management

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Icons**: React Icons
- **Fonts**: Google Fonts (Geist, Abhaya Libre)

### Backend & Database
- **Authentication**: Firebase Auth
- **Database**: Firestore (NoSQL)
- **Real-time Updates**: Firestore listeners
- **File Storage**: Firebase Storage (ready for future use)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── customer/          # Customer-specific pages
│   ├── provider/          # Provider-specific pages
│   ├── cart/              # Shopping cart
│   ├── payment/           # Payment processing
│   └── auth/              # Login/signup pages
├── components/             # Reusable UI components
├── lib/                    # Utilities and contexts
├── types/                  # TypeScript type definitions
└── middleware.ts           # Route protection
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/velaservices.git
   cd velaservices
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APIKEY=your_firebase_api_key
   NEXT_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_PROJECTID=your_project_id
   NEXT_PUBLIC_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_APP_ID=your_app_id
   NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
   ```

4. **Firebase Configuration**
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Add your web app and copy the config

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS 4 with custom color schemes and responsive design patterns.

### TypeScript
Strict TypeScript configuration with proper type definitions for all Firebase operations and React components.

### ESLint
Modern ESLint configuration with Next.js specific rules and TypeScript support.

## 📱 User Flows

### Customer Journey
1. **Sign Up/Login** → Create account or sign in
2. **Browse Services** → View available service categories
3. **Select Services** → Choose date, time, and add to cart
4. **Checkout** → Review cart and proceed to payment
5. **Track Orders** → Monitor service status and history

### Provider Journey
1. **Profile Setup** → Complete provider profile and services
2. **Availability Management** → Set working hours and availability
3. **Mission Dashboard** → View and manage incoming requests
4. **Service Completion** → Mark services as completed

## 🔒 Security Features

- **Route Protection**: Middleware-based access control
- **Role Verification**: Server-side role validation
- **Authentication State**: Persistent login sessions
- **Input Validation**: Type-safe data handling

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **Firebase Hosting**: Direct integration with Firebase ecosystem
- **Docker**: Containerized deployment option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure responsive design for all components
- Add proper error handling and loading states
- Write clean, documented code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Firebase](https://firebase.google.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)

## 📞 Support

For support, email support@velaservices.com or create an issue in this repository.

---

**VelaServices** - Making home services accessible, reliable, and convenient. 🏠✨
