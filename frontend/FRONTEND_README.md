# Campus Resource Monitor - Frontend

A professional React application for monitoring campus resource consumption (electricity, water, and food waste).

## 🎯 Features

### 📊 Dashboard

- Overview of all resources at a glance
- Building-wise consumption breakdown
- Quick navigation to detailed views
- Real-time statistics and trends

### ⚡ Electricity Monitoring

- Current usage tracking
- Peak and average usage statistics
- Building-wise electricity consumption
- Usage capacity indicators
- Recent readings timeline
- Energy saving tips

### 💧 Water Monitoring

- Real-time water consumption tracking
- Daily and monthly usage statistics
- Hourly consumption charts
- Building-wise usage with targets
- Alert system for high usage
- Water saving recommendations

### 🍽️ Food Waste Monitoring

- Food waste tracking by location
- Waste breakdown by category (plate waste, preparation, spoilage)
- Weekly trends visualization
- Waste per meal calculations
- Key insights and statistics
- Reduction tips and best practices

## 🛠️ Technologies Used

- **React 19** - UI framework
- **React Router DOM** - Routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern design

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation component
│   │   ├── Navbar.css
│   │   ├── StatCard.jsx      # Reusable stat card
│   │   └── StatCard.css
│   ├── pages/
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Dashboard.css
│   │   ├── Electricity.jsx   # Electricity monitoring
│   │   ├── Electricity.css
│   │   ├── Water.jsx         # Water monitoring
│   │   ├── Water.css
│   │   ├── FoodWaste.jsx     # Food waste monitoring
│   │   └── FoodWaste.css
│   ├── App.jsx              # Main app with routing
│   ├── App.css
│   ├── main.jsx
│   └── index.css
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit:

```
http://localhost:5173
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Features

- **Modern UI** - Clean, professional interface with gradient accents
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Color-coded Sections** - Visual distinction between resource types
- **Interactive Elements** - Hover effects and smooth transitions
- **Data Visualization** - Charts and graphs for easy understanding
- **Status Indicators** - Visual feedback for resource usage levels

## 🔄 Future Enhancements

- [ ] Connect to backend API for real-time data
- [ ] Add user authentication
- [ ] Implement data export functionality
- [ ] Add more detailed analytics
- [ ] Include prediction models
- [ ] Add notification system
- [ ] Dark mode support

## 🤝 Contributing

This project is part of a hackathon. Feel free to contribute by:

1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## 📄 License

This project is part of a hackathon submission.
