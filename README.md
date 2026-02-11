# Going Out for Girls Guide (GOGG) 🍸

A modern, user-friendly web app designed to help you navigate a night out with essential tools and quick links. Pronounced "Go GiGi," GOGG is your pocket guide for handling tips, splitting bills, staying hydrated, finding facilities, and getting transport.

## Features

### 💰 Tip Calculator
Quickly calculate tips on your bill with multiple percentage options (15%, 18%, 20%, custom). See the total amount including tip instantly. Perfect for splitting costs fairly among your group.

### 💸 Split Bill
Divide bills among friends with ease using two modes:
- **Even Split**: Distribute the total evenly across all people
- **Itemized**: Track individual items per person and calculate proportional costs

### ⏱️ Drink Timer
Set reminders to stay hydrated throughout your night out. Choose intervals from 5 to 120 minutes and receive visual and audio notifications. Includes helpful hydration tips for your safety.

### 🚽 Find Bathroom
Quickly locate nearby bathrooms using Google Maps integration. Search by current location or custom address. Perfect for emergencies when you need directions fast.

### 🚕 Quick Links
One-tap access to:
- **Uber** - Request a ride
- **Lyft** - Alternative ride option
- **Yelp** - Discover nearby restaurants and venues
- **Messages** - Contact your friends

## How to Use

### Tip Calculator
1. Enter your bill amount
2. Select a tip percentage or enter a custom amount
3. View your total instantly
4. Share the calculation with your group

### Split Bill
1. Enter the total bill amount and number of people
2. Choose **Even Split** for equal distribution or **Itemized** to add specific items per person
3. View each person's total cost including their share of tax and tip
4. Take a screenshot to share

### Drink Timer
1. Select your desired interval between drinks (5-120 minutes)
2. Tap "Start Timer"
3. Get reminded with a notification when it's time to hydrate
4. Use Pause/Resume as needed throughout your night

### Find Bathroom
1. Tap the tool
2. Choose "Use Current Location" for automatic geolocation or enter a custom address
3. Opens Google Maps with nearby bathroom results
4. Get directions right away

## Design & Tech Stack

- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS with a retro vaporwave aesthetic
- **Colors**: Pink, teal, and purple theme for a modern, fun look
- **Responsive**: Fully optimized for mobile devices (primary use case)
- **Audio**: Custom notification sounds for timers

## Getting Started

### Installation

```bash
# Clone or download the project
git clone <repository-url>

# Navigate to the project
cd gogg

# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Environment Variables

No external API keys required for core functionality. All tools work with built-in browser APIs and third-party services (Uber, Lyft, Yelp, Google Maps) that open in new windows.

## Navigation

- **Home Dashboard**: View all available tools and quick links
- **Each Tool**: Back button to return home
- **Quick Links**: Open directly in new tabs

## Safety Tips

- Use the Drink Timer to maintain hydration and pace throughout your night
- Always have emergency contacts saved on your phone
- Share your location with trusted friends
- Keep your phone charged with the GOGG app ready

## Future Enhancements

- Emergency contact quick dial
- Ride fare estimator
- Night out planner and venue saved list
- SOS button with location sharing
- Dark mode for nighttime use
- Expense tracker for the entire night

## License

Open source and available for personal use.

---

**GOGG** - Your guide for a safe, fun, and well-organized night out. 💅✨
