<img src="https://readme-typing-svg.herokuapp.com?font=Anaheim&size=32&duration=3000&pause=2000&color=8A00C4&width=1000&lines=Prepper;Meal+Planning+and+Calorie+Tracker+App" alt="Typing SVG" />

Prepper is a meal planning and nutrition tracking app designed to simplify your daily food management. The app allows users to create personalized meal plans, manage recipes, track calories and nutrients, and generate shopping lists based on their meal plans.

### Project Overview

**Primary Functionality:**

* Personalized macro calculation based on user's physical details (weight, height, age) and fitness goals  
* Customizable meal planning system with time-based scheduling  
* Profile management with progress tracking  
* Email verification system for secure account creation

**Target Users:**

* Health-conscious individuals looking to manage their nutrition  
* Fitness enthusiasts tracking macro nutrients  
* Busy professionals who want to plan meals efficiently  
* Anyone seeking to organize their weekly meal preparation

**Key Benefits:**

* Eliminates food waste through organized meal planning  
* Provides scientifically calculated macro nutrient targets  
* Simplifies grocery shopping with meal-based planning  
* Offers personalized nutrition guidance based on individual metrics  
* Helps users maintain consistent eating habits aligned with their goals 

### Project Setup

**Installing Dependencies**
1. Clone this repository:
   ```bash
   git clone https://github.com/chuckzxxmello/prepper.git
   ```
2. Install dependencies:
   ```bash
   # note: the app uses older version sdk52, the reason we use --legacy-peer-deps
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```bash
   npx expo start
   #or
   npx expo start --clear
   ```
4. Open the app on your device with Expo Go or an emulator.
- Download/Install Expo SDK 52 App from the official expo website.
- Use Expo Go app on your physical device, then scan the QR code or manual input of the expo link.

### Core Features

### User Authentication & Setup Flow
- Welcome screen entry point
- Sign up with email verification
- Login with credentials

**Initial setup wizard:**
1. Goal selection (lose/gain/maintain)
2. Gender selection
3. Activity level selection
4. Physical measurements input

### Macro & Calorie Calculation System
- Calculates BMR using scientific formulas
- TDEE calculation based on activity level

### Macro distribution based on goals
- Protein calculation (2.2g per kg for weight loss)
- Fat allocation (25% of calories)
- Carbs filling the remaining calories
- Results storage in Firebase for each user

### Navigation & Dashboard System
- Home tab
- Recipes tab
- Groceries tab

### Recipe & Meal Planning
- Recipe browsing interface
- Recipe detail view
- Custom meal plan creation
- Meal plan editing capabilities
- Grocery list generation
- Nutrients tracking indicators

### Progress Tracking
- Water intake monitoring
- Nutrient intake indicators
- Profile management
- Progress visualization

### Future Improvements

**Enhanced Meal Planning Features**
- Add meal scheduling calendar integration
- Enable meal plan templates/favorites saving
- Implement drag-and-drop meal organization
- Add portion scaling for different serving sizes

**Advanced Recipe Management**
- Create recipe collections/categories
- Add recipe rating and review system
- Enable recipe sharing between users
- Implement recipe import from URLs
- Add cooking timer and step-by-step instructions

**Smart Grocery List Optimization**
- Add barcode scanning for items
- Enable price comparison across stores
- Implement smart shopping route suggestions
- Add inventory management
- Create recurring shopping lists

**Expanded Nutrition Tracking**
- Add visual macro tracking dashboard
- Create detailed nutrition reports
- Enable custom goal setting
- Add progress photos
- Implement weight tracking graphs

**Social Features**
- Add friend connections
- Enable meal plan sharing
- Create community recipe boards
- Add achievement/gamification system
- Enable meal prep challenges

**Technical Improvements**
- Implement offline mode functionality
- Add push notifications for reminders
- Enable data export/backup options
- Improve app performance optimization
- Add multi-language support

**User Experience Enhancements**
- Create onboarding tutorials
- Add dark/light theme toggle
- Implement gesture controls
- Add voice command support
- Enable customizable dashboards

### Developers

- **Iguban, Mark Daniel R.** - Project Manager / Lead Developer
- **Española, Chuckie A.** - Backend Developer
- **Umandap, Ron Amielle H.** - UI/UX Developer
- **Gollemas, Eman Dionbert Y.** - Documentation

