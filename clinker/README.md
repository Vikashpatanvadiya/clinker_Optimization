# Clinker Allocation & Transportation Optimization Dashboard

A modern, responsive React-based dashboard for visualizing and managing clinker production, transportation, and inventory planning optimization.

## 🚀 Features

### 🎨 Dual UI Themes
- **Normal Mode**: Clean, business-friendly design with light theme
- **Premium Mode**: High-end, futuristic executive dashboard with dark theme and glassmorphism effects

### 📊 Dashboard Components
- **Cost Summary Cards**: Real-time cost breakdown (Production, Transport, Inventory)
- **Interactive Charts**: Inventory trends and capacity utilization visualization
- **Flow Diagram**: Visual representation of clinker movement between units
- **Shipment Planning Table**: Detailed shipment schedules with filtering and sorting

### ⚙️ Configuration Management
- **Integrated Units (IUs)**: Production capacity, costs, inventory management
- **Grinding Units (GUs)**: Demand scheduling and inventory constraints
- **Transportation Modes**: Cost optimization for Truck, Rail, and Barge transport

### 📱 Responsive Design
- Mobile-first layout with collapsible sidebar
- Adaptive charts and tables for all screen sizes
- Touch-friendly controls and interactions

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom themes
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Express.js with mock data API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clinker-optimization-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both frontend (port 3000) and backend (port 3001) servers concurrently.

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the dashboard.

## 🎯 Usage

### Theme Switching
Use the toggle switch in the header to switch between Normal and Premium modes. The entire UI will dynamically adapt to the selected theme.

### Navigation
- **Dashboard**: View optimization results and analytics
- **Configuration**: Set up Integrated Units, Grinding Units, and Transportation modes
- **Sidebar**: Collapsible navigation with data management options

### Data Input
1. Navigate to the Configuration tab
2. Add Integrated Units with production parameters
3. Configure Grinding Units with demand schedules
4. Set up Transportation modes with cost and capacity details
5. Click "Run Optimization" to generate results

### Optimization Results
The dashboard displays:
- Total cost breakdown
- Inventory level trends over time periods
- Capacity utilization charts
- Detailed shipment planning table
- Visual flow diagram of clinker movement

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.jsx          # Main dashboard container
│   │   ├── CostSummary.jsx        # Cost breakdown cards
│   │   ├── InventoryChart.jsx     # Inventory trends chart
│   │   ├── UtilizationChart.jsx   # Capacity utilization chart
│   │   ├── FlowDiagram.jsx        # Clinker flow visualization
│   │   └── ShipmentTable.jsx      # Shipment planning table
│   ├── InputForms/
│   │   ├── InputForms.jsx         # Form container with tabs
│   │   ├── IUForm.jsx            # Integrated Units form
│   │   ├── GUForm.jsx            # Grinding Units form
│   │   └── TransportModeForm.jsx  # Transportation modes form
│   ├── Header.jsx                 # App header with theme toggle
│   ├── Sidebar.jsx               # Navigation sidebar
│   └── ThemeToggle.jsx           # Theme switching component
├── contexts/
│   └── ThemeContext.jsx          # Theme state management
├── App.jsx                       # Main app component
├── main.jsx                      # React entry point
└── index.css                     # Global styles and theme classes
```

## 🎨 Customization

### Adding New Themes
1. Extend the `tailwind.config.js` with new color schemes
2. Update `ThemeContext.jsx` to handle additional theme states
3. Add corresponding CSS classes in `index.css`

### Extending Functionality
- Add new chart types in the Dashboard components
- Implement additional optimization algorithms in the backend
- Create new form components for additional data inputs

## 🔧 API Endpoints

The backend provides the following REST endpoints:

- `GET /api/integrated-units` - Fetch all integrated units
- `POST /api/integrated-units` - Create new integrated unit
- `GET /api/grinding-units` - Fetch all grinding units
- `POST /api/grinding-units` - Create new grinding unit
- `GET /api/transport-modes` - Fetch all transport modes
- `POST /api/transport-modes` - Create new transport mode
- `GET /api/optimization-results` - Get optimization results
- `POST /api/optimize` - Run optimization process

## 🚀 Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Deploy backend**
   - Configure environment variables
   - Set up production database
   - Deploy to your preferred hosting platform

3. **Deploy frontend**
   - Upload build files to static hosting
   - Configure API endpoint URLs for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- [ ] Real-time optimization engine integration
- [ ] Advanced analytics and forecasting
- [ ] Multi-language support
- [ ] PDF export functionality
- [ ] Advanced filtering and search capabilities
- [ ] User authentication and role management
- [ ] Integration with external ERP systems